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
) AS response_data;`

const getSessionById = `WITH SessionData AS (
  SELECT
    s.session_id,
    s.mode,
    s.start_time,
    s.end_time,
    s.safety_score,
    s.progress,
    cs.site_id AS construction_site_id,
    cs.name AS construction_site_name,
    c.camera_id,
    c.name AS camera_name,
    (
      SELECT
        COUNT(*)
      FROM incidents
      WHERE
        session_id = s.session_id
    ) AS total_incidents,
    (
      SELECT
        COUNT(*)
      FROM incidents
      WHERE
        session_id = s.session_id AND severity = 'Critical'
    ) AS critical_incidents
  FROM sessions AS s
  JOIN construction_sites AS cs
    ON s.site_id = cs.site_id
  JOIN cameras AS c
    ON s.camera_id = c.camera_id
  WHERE
    s.session_id = $1
), Snapshots AS (
  SELECT
    JSON_AGG(image_url) AS snapshots
  FROM snapshots
  WHERE
    session_id = $1
), Trends AS (
  SELECT
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'time', TO_CHAR("timestamp", 'HH24:MI'),
        'score', score
      )
    ) AS trends
  FROM safety_score_trends
  WHERE
    session_id = $1
), Distribution AS (
  SELECT
    helmet_score,
    footwear_score,
    vest_score
  FROM safety_score_distribution
  WHERE
    session_id = $1
)
SELECT
  JSON_BUILD_OBJECT(
    'sessionDetails', (
      SELECT
        JSON_BUILD_OBJECT(
          'sessionId', sd.session_id,
          'constructionSite', JSON_BUILD_OBJECT('id', sd.construction_site_id, 'name', sd.construction_site_name),
          'camera', JSON_BUILD_OBJECT('id', sd.camera_id, 'name', sd.camera_name),
          'snapshots', sn.snapshots,
          'mode', sd.mode,
          'duration', JSON_BUILD_OBJECT(
            'hours', EXTRACT(HOUR FROM (sd.end_time - sd.start_time)),
            'minutes', EXTRACT(MINUTE FROM (sd.end_time - sd.start_time)),
            'seconds', EXTRACT(SECOND FROM (sd.end_time - sd.start_time))
          ),
          'startTime', TO_CHAR(sd.start_time, 'YYYY-MM-DD HH24:MI:SS'),
          'endTime', TO_CHAR(sd.end_time, 'YYYY-MM-DD HH24:MI:SS'),
          'safetyScore', sd.safety_score,
          'progress', sd.progress,
          'totalIncidents', sd.total_incidents,
          'criticalIncidents', sd.critical_incidents,
          'trends', t.trends,
          'safetyScoreDistribution', JSON_BUILD_OBJECT(
            'helmet', d.helmet_score,
            'footwear', d.footwear_score,
            'vest', d.vest_score
          )
        )
      FROM SessionData AS sd, Snapshots AS sn, Trends AS t, Distribution AS d
    ),
    'constructionSites', (
      SELECT
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', site_id,
            'name', name
          )
        )
      FROM construction_sites
    ),
    'cameras', (
      SELECT
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', camera_id,
            'name', name
          )
        )
      FROM cameras
    )
  ) AS response_data;`

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
  );`
module.exports = {
    getAllSessions,
    getSessionById
};
