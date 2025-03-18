const getAllSessions = `SELECT
JSON_BUILD_OBJECT(
    'constructionSites', (
        SELECT
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', site_id,
                    'siteName', name
                )
            )
        FROM construction_sites
    ),
    'cameras', (
        SELECT
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', camera_id,
                    'cameraName', name
                )
            )
        FROM cameras
    ),
    'sessions', (
        SELECT
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'sessionId', session_id,
                    'safetyScore', safety_score,
                    'mode', mode,
                    'startTime', TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS'), -- Format start_time
                    'endTime', TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') -- Format end_time
                )
            )
        FROM sessions
    )
) AS response_data;`;

const getSessionById = `
WITH latest_scores AS (
    SELECT 
        helmet_score,
        vest_score,
        footwear_score,
        gloves_score,
        scaffolding_score,
        guardrail_score,
        harness_score
    FROM 
        records
    WHERE 
        session_id = $1  -- Use parameterized session ID
    ORDER BY 
        timestamp DESC
    LIMIT 1
),
safety_score_distribution AS (
    SELECT
        ROUND(AVG(helmet_score), 1) AS avg_helmet_score,
        ROUND(AVG(footwear_score), 1) AS avg_footwear_score,
        ROUND(AVG(vest_score), 1) AS avg_vest_score,
        ROUND(AVG(gloves_score), 1) AS avg_gloves_score,
        ROUND(AVG(scaffolding_score), 1) AS avg_scaffolding_score,
        ROUND(AVG(guardrail_score), 1) AS avg_guardrail_score,
        ROUND(AVG(harness_score), 1) AS avg_harness_score
    FROM 
        records
    WHERE 
        session_id = $1  -- Use parameterized session ID
),
trends AS (
    SELECT 
        to_char(timestamp, 'YYYY-MM-DD HH24:00') AS time,
        ROUND(AVG(
            (helmet_score + footwear_score + vest_score + gloves_score + scaffolding_score + guardrail_score + harness_score) / 7.0
        )::numeric, 2) AS score
    FROM 
        records
    WHERE 
        session_id = $1
    GROUP BY 
        to_char(timestamp, 'YYYY-MM-DD HH24:00')  -- Group by date and hour
    ORDER BY 
        to_char(timestamp, 'YYYY-MM-DD HH24:00')
),
growth_calculation AS (
    SELECT 
        session_id,
        safety_score,
        LAG(safety_score) OVER (ORDER BY start_time ASC) AS previous_score,
        COALESCE(safety_score - LAG(safety_score) OVER (ORDER BY start_time ASC), NULL) AS growth
    FROM 
        sessions
    WHERE 
        session_id = $1  -- Use parameterized session ID
)
SELECT json_build_object(
    'sessionId', s.session_id,
    'constructionSite', json_build_object(
        'id', cs.site_id,
        'name', cs.name
    ),
    'camera', json_build_object(
        'id', c.camera_id,
        'name', c.name
    ),
    'snapshots', (SELECT array_agg(ss.image_url) FROM snapshots ss WHERE ss.session_id = s.session_id),
    'mode', s.mode,
    'duration', json_build_object(
        'hours', EXTRACT(HOUR FROM (s.end_time - s.start_time)),
        'minutes', EXTRACT(MINUTE FROM (s.end_time - s.start_time)),
        'seconds', EXTRACT(SECOND FROM (s.end_time - s.start_time))
    ),
    'startTime', s.start_time,
    'endTime', s.end_time,
    'safetyScore', s.safety_score,
    'progress', COALESCE(
        CASE 
            WHEN gc.growth IS NULL THEN '0.00%'
            WHEN gc.growth >= 0 THEN '+' || TO_CHAR(gc.growth, 'FM999999999.00%')
            ELSE TO_CHAR(gc.growth, 'FM999999999.00%')
        END, '0.00%'
    ),
    'totalIncidents', COUNT(i.*),
    'criticalIncidents', COUNT(CASE WHEN i.severity = 'Critical' THEN 1 END),
    'trends', json_agg(json_build_object('time', t.time, 'score', t.score)),
    'safetyScoreDistribution', json_build_object(
        'helmet', (SELECT avg_helmet_score FROM safety_score_distribution),
        'footwear', (SELECT avg_footwear_score FROM safety_score_distribution),
        'vest', (SELECT avg_vest_score FROM safety_score_distribution),
        'gloves', (SELECT avg_gloves_score FROM safety_score_distribution),
        'scaffolding', (SELECT avg_scaffolding_score FROM safety_score_distribution),
        'guardrails ', (SELECT avg_guardrail_score FROM safety_score_distribution),
        'harness', (SELECT avg_harness_score FROM safety_score_distribution)
    )
)
FROM 
    sessions s
JOIN 
    construction_sites cs ON s.site_id = cs.site_id
JOIN 
    cameras c ON c.camera_id = s.camera_id
LEFT JOIN 
    incidents i ON i.session_id = s.session_id
LEFT JOIN 
    growth_calculation gc ON gc.session_id = s.session_id
LEFT JOIN 
    trends t ON t.time IS NOT NULL
WHERE 
    s.session_id = $1  -- Filter for the specific session ID
GROUP BY 
    s.session_id, cs.site_id, c.camera_id, gc.growth
ORDER BY 
    s.start_time ASC;
`;

const updateSessionById = `WITH UpdatedSession AS (
  UPDATE sessions
  SET site_id = $2, camera_id = $3
  WHERE session_id = $1
  RETURNING *
)
SELECT
  JSON_BUILD_OBJECT(
    'sessionDetails', (
      SELECT
        JSON_BUILD_OBJECT(
          'sessionId', us.session_id,
          'constructionSite', JSON_BUILD_OBJECT(
            'id', cs.site_id,
            'name', cs.name
          ),
          'camera', JSON_BUILD_OBJECT(
            'id', c.camera_id,
            'name', c.name
          ),
          'snapshots', (
            SELECT
              JSON_AGG(image_url)
            FROM snapshots
            WHERE
              session_id = us.session_id
          ),
          'mode', us.mode,
          'duration', JSON_BUILD_OBJECT(
            'hours', EXTRACT(
              HOUR
              FROM (
                us.end_time - us.start_time
              )
            ),
            'minutes', EXTRACT(
              MINUTE
              FROM (
                us.end_time - us.start_time
              )
            ),
            'seconds', EXTRACT(
              SECOND
              FROM (
                us.end_time - us.start_time
              )
            )
          ),
          'startTime', TO_CHAR(us.start_time, 'YYYY-MM-DD HH24:MI:SS'),
          'endTime', TO_CHAR(us.end_time, 'YYYY-MM-DD HH24:MI:SS'),
          'safetyScore', us.safety_score,
          'progress', us.progress,
          'totalIncidents', (
            SELECT
              COUNT(*)
            FROM incidents
            WHERE
              session_id = us.session_id
          ),
          'criticalIncidents', (
            SELECT
              COUNT(*)
            FROM incidents
            WHERE
              session_id = us.session_id AND severity = 'Critical'
          ),
          'trends', (
            SELECT
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'time', TO_CHAR("timestamp", 'HH24:MI'),
                  'score', score
                )
              )
            FROM safety_score_trends
            WHERE
              session_id = us.session_id
          ),
          'safetyScoreDistribution', (
            SELECT
              JSON_BUILD_OBJECT(
                'helmet', ssd.helmet_score,
                'footwear', ssd.footwear_score,
                'vest', ssd.vest_score
              )
            FROM safety_score_distribution AS ssd
            WHERE
              ssd.session_id = us.session_id
          )
        )
      FROM UpdatedSession AS us
      JOIN construction_sites AS cs
        ON us.site_id = cs.site_id
      JOIN cameras AS c
        ON us.camera_id = c.camera_id
    )
  );`;

module.exports = {
  getAllSessions,
  getSessionById,
};
