const getStatsForMonthAndDays = `WITH month_data AS (
  SELECT
    s.session_id,
    s.start_time,
    s.end_time,
    s.safety_score,
    s.progress,
    cs.name AS site_name,
    c.name AS camera_name,
    ss.image_url,
    ss."timestamp",
    sd.helmet_score,
    sd.footwear_score,
    sd.vest_score,
    sd.gloves_score,
    sd.scaffolding_score,
    sd.guardrails_score,
    sd.harness_score,
    st.trend_id,
    st.score,
    st."timestamp" AS trend_timestamp
  FROM sessions s
  LEFT JOIN construction_sites cs
    ON s.site_id = cs.site_id
  LEFT JOIN cameras c
    ON s.camera_id = c.camera_id
  LEFT JOIN snapshots ss
    ON s.session_id = ss.session_id
  LEFT JOIN safety_score_distribution sd
    ON s.session_id = sd.session_id
  LEFT JOIN safety_score_trends st
    ON s.session_id = st.session_id
  WHERE
    EXTRACT(MONTH FROM s.start_time) = $1 AND EXTRACT(YEAR FROM s.start_time) = $2
), DailyData AS (
  SELECT
    s.session_id,
    s.start_time,
    s.end_time,
    s.safety_score,
    s.progress,
    cs.name AS site_name,
    c.name AS camera_name,
    ss.image_url,
    ss."timestamp",
    sd.helmet_score,
    sd.footwear_score,
    sd.vest_score,
    sd.gloves_score,
    sd.scaffolding_score,
    sd.guardrails_score,
    sd.harness_score,
    st.trend_id,
    st.score,
    st."timestamp" AS trend_timestamp
  FROM sessions s
  LEFT JOIN construction_sites cs
    ON s.site_id = cs.site_id
  LEFT JOIN cameras c
    ON s.camera_id = c.camera_id
  LEFT JOIN snapshots ss
    ON s.session_id = ss.session_id
  LEFT JOIN safety_score_distribution sd
    ON s.session_id = sd.session_id
  LEFT JOIN safety_score_trends st
    ON s.session_id = st.session_id
  WHERE
    EXTRACT(MONTH FROM s.start_time) = $1 AND EXTRACT(YEAR FROM s.start_time) = $2
), PrevMonthData AS (
  SELECT
    AVG(safety_score) AS prev_month_safety_score
  FROM sessions
  WHERE
    EXTRACT(MONTH FROM start_time) = $1 - 1 AND EXTRACT(YEAR FROM start_time) = $2
)
SELECT
  JSON_BUILD_OBJECT(
    'month', (
      SELECT
        JSON_BUILD_OBJECT(
          'name',
          to_char(to_date($1::TEXT, 'MM'), 'Month'),
          'snapshots',
          (
            SELECT
              JSON_AGG(image_url)
            FROM (
              SELECT
                image_url
              FROM month_data
              GROUP BY
                image_url
              LIMIT 4
            ) AS distinct_snapshots
          ),
          'safetyScore',
          COALESCE(AVG(safety_score), 0),
          'progress',
          COALESCE(
            to_char(
              (
                AVG(safety_score) - (
                  SELECT
                    prev_month_safety_score
                  FROM PrevMonthData
                )
              ) * 100 / (
                SELECT
                  prev_month_safety_score
                FROM PrevMonthData
              ),
              'FM999999999.0%'
            ),
            '0%'
          ),
          'totalIncidents',
          COUNT(DISTINCT session_id),
          'criticalIncidents',
          COUNT(DISTINCT CASE WHEN severity = 'Critical' THEN session_id ELSE NULL END),
          'duration',
          json_build_object(
            'hours',
            COALESCE(
              EXTRACT(
                HOUR
                FROM SUM(end_time - start_time)
              ),
              0
            ),
            'minutes',
            COALESCE(
              EXTRACT(
                MINUTE
                FROM SUM(end_time - start_time)
              ),
              0
            ),
            'seconds',
            COALESCE(
              EXTRACT(
                SECOND
                FROM SUM(end_time - start_time)
              ),
              0
            )
          ),
          'trends',
          json_agg(
            DISTINCT json_build_object('date', trend_timestamp::DATE, 'score', score)
          ),
          'safetyScoreDistribution',
          json_build_object(
            'helmet',
            COALESCE(AVG(helmet_score), 0),
            'footwear',
            COALESCE(AVG(footwear_score), 0),
            'vest',
            COALESCE(AVG(vest_score), 0),
            'gloves',
            COALESCE(AVG(gloves_score), 0),
            'scaffolding',
            COALESCE(AVG(scaffolding_score), 0),
            'guardrails',
            COALESCE(AVG(guardrails_score), 0),
            'harness',
            COALESCE(AVG(harness_score), 0)
          ),
          'top3',
          (
            SELECT
              json_build_object(
                'improvements',
                json_agg(
                  json_build_object('name', category, 'positive', TRUE, 'value', avg_diff)
                ),
                'declinedMetrics',
                json_agg(
                  json_build_object('name', category, 'positive', FALSE, 'value', avg_diff)
                )
              )
            FROM (
              SELECT
                category,
                AVG(
                  CASE WHEN EXTRACT(MONTH FROM incident_time) = $1
                  THEN 1
                  ELSE 0
                  END
                ) - AVG(
                  CASE WHEN EXTRACT(MONTH FROM incident_time) = $1 - 1
                  THEN 1
                  ELSE 0
                  END
                ) AS avg_diff
              FROM incidents
              GROUP BY
                category
              ORDER BY
                avg_diff DESC
              LIMIT 3
            ) AS top3_data
          )
        )
      FROM month_data
    ),
    'days',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'date',
              to_char(start_time, 'YYYY-MM-DD'),
              'safetyScore',
              safety_score,
              'progress',
              progress,
              'totalIncidents',
              (
                SELECT
                  COUNT(*)
                FROM incidents
                WHERE
                  session_id = dd.session_id
              ),
              'criticalIncidents',
              (
                SELECT
                  COUNT(*)
                FROM incidents
                WHERE
                  session_id = dd.session_id AND severity = 'Critical' -- Reference the correct table for severity
              ),
              'duration',
              json_build_object(
                'hours',
                EXTRACT(
                  HOUR
                  FROM (
                    dd.end_time - dd.start_time
                  )
                ),
                'minutes',
                EXTRACT(
                  MINUTE
                  FROM (
                    dd.end_time - dd.start_time
                  )
                ),
                'seconds',
                EXTRACT(
                  SECOND
                  FROM (
                    dd.end_time - dd.start_time
                  )
                )
              ),
              'safetyScoreDistribution',
              json_build_object(
                'helmet',
                helmet_score,
                'footwear',
                footwear_score,
                'vest',
                vest_score,
                'gloves',
                gloves_score,
                'scaffolding',
                scaffolding_score,
                'guardrails',
                guardrails_score,
                'harness',
                harness_score
              ),
              'top3',
              (
                SELECT
                  json_build_object(
                    'improvements',
                    json_agg(
                      json_build_object('name', category, 'positive', TRUE, 'value', avg_diff)
                    ),
                    'declinedMetrics',
                    json_agg(
                      json_build_object('name', category, 'positive', FALSE, 'value', avg_diff)
                    )
                  )
                FROM (
                  SELECT
                    category,
                    AVG(
                      CASE WHEN incident_time::DATE = dd.start_time::DATE
                      THEN 1
                      ELSE 0
                      END
                    ) - AVG(
                      CASE WHEN incident_time::DATE = dd.start_time::DATE - 1
                      THEN 1
                      ELSE 0
                      END
                    ) AS avg_diff
                  FROM incidents
                  GROUP BY
                    category
                  ORDER BY
                    avg_diff DESC
                  LIMIT 3
                ) AS top3_data
              ),
              'trends',
              json_agg(
                DISTINCT json_build_object('time', to_char(trend_timestamp, 'HH24:MI'), 'score', score)
              ),
              'snapshots',
              json_agg(DISTINCT image_url)
            )
          )
        FROM DailyData AS dd
      ),
      ''::JSON
    )
  );`



module.exports = {
    getStatsForMonthAndDays,
};
