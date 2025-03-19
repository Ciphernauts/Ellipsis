const getStatsForMonth = `
WITH monthly_data AS (
    SELECT
        DATE_TRUNC('day', r.Timestamp) AS record_date,
        AVG(r.helmet_score) AS avg_helmet_score,
        AVG(r.footwear_score) AS avg_footwear_score,
        AVG(r.vest_score) AS avg_vest_score,
        AVG(r.gloves_score) AS avg_gloves_score,
        AVG(r.harness_score) AS avg_harness_score,
        AVG(r.scaffolding_score) AS avg_scaffolding_score,
        AVG(r.guardrail_score) AS avg_guardrail_score,
        COUNT(DISTINCT i.incident_id) AS total_incidents,
        COUNT(DISTINCT CASE WHEN i.severity = 'Critical' THEN i.incident_id END) AS critical_incidents,
        SUM(EXTRACT(EPOCH FROM (s.end_time - s.start_time))) AS total_duration
    FROM records r
    LEFT JOIN sessions s ON r.session_id = s.session_id
    LEFT JOIN incidents i ON s.session_id = i.session_id
    WHERE
        EXTRACT(MONTH FROM r.Timestamp) = $1
        AND EXTRACT(YEAR FROM r.Timestamp) = $2
    GROUP BY record_date
), previous_month_data AS (
    SELECT
        AVG(helmet_score) AS prev_helmet_score,
        AVG(footwear_score) AS prev_footwear_score,
        AVG(vest_score) AS prev_vest_score,
        AVG(gloves_score) AS prev_gloves_score,
        AVG(harness_score) AS prev_harness_score,
        AVG(scaffolding_score) AS prev_scaffolding_score,
        AVG(guardrail_score) AS prev_guardrail_score
    FROM records
    WHERE
        (EXTRACT(MONTH FROM Timestamp) = $1 - 1 AND EXTRACT(YEAR FROM Timestamp) = $2) OR
        ($1 = 1 AND EXTRACT(MONTH FROM Timestamp) = 12 AND EXTRACT(YEAR FROM Timestamp) = $2 - 1)
), trends AS (
    SELECT
        DATE_TRUNC('day', Timestamp) AS record_date,
        (AVG(helmet_score) + AVG(footwear_score) + AVG(vest_score) + AVG(gloves_score) + AVG(scaffolding_score) + AVG(guardrail_score) + AVG(harness_score)) / 7 AS daily_avg_safety_score
    FROM records
    WHERE
        EXTRACT(MONTH FROM Timestamp) = $1
        AND EXTRACT(YEAR FROM Timestamp) = $2
    GROUP BY record_date
), snapshots AS (
    SELECT
        session_id,
        image_url,
        "timestamp"
    FROM snapshots
    WHERE
        session_id IN (SELECT session_id FROM sessions WHERE EXTRACT(MONTH FROM start_time) = $1 AND EXTRACT(YEAR FROM start_time) = $2)
    ORDER BY "timestamp" DESC
    LIMIT 15
), percentage_changes AS (
    SELECT
        'helmet' AS item,
        AVG(md.avg_helmet_score - pmd.prev_helmet_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
	group by pmd.prev_helmet_score
    UNION ALL
    SELECT
        'footwear',
        AVG(md.avg_footwear_score - pmd.prev_footwear_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
    group by pmd.prev_footwear_score
	UNION ALL
    SELECT
        'vest',
        AVG(md.avg_vest_score - pmd.prev_vest_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
    group by pmd.prev_vest_score
    UNION ALL
    SELECT
        'gloves',
        AVG(md.avg_gloves_score - pmd.prev_gloves_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
    group by pmd.prev_gloves_score
    UNION ALL
    SELECT
        'harness',
        AVG(md.avg_harness_score - pmd.prev_harness_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
    group by pmd.prev_harness_score
    UNION ALL
    SELECT
        'scaffolding',
        AVG(md.avg_scaffolding_score - pmd.prev_scaffolding_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
    group by pmd.prev_scaffolding_score
    UNION ALL
    SELECT
        'guardrail',
        AVG(md.avg_guardrail_score - pmd.prev_guardrail_score) AS change
    FROM monthly_data md
    CROSS JOIN previous_month_data pmd
    group by pmd.prev_guardrail_score
), top3_improvements AS (
    SELECT
        item,
        change
    FROM percentage_changes
    ORDER BY change DESC
    LIMIT 3
), top3_declined AS (
    SELECT
        item,
        change
    FROM percentage_changes
    ORDER BY change ASC
    LIMIT 3
)
SELECT JSON_BUILD_OBJECT(
        'name', TO_CHAR(TO_DATE($1::TEXT, 'MM'), 'Month'),
        'safetyScore', COALESCE(ROUND(AVG(md.avg_helmet_score), 2), 0),
        'progress', COALESCE(
            CASE
                WHEN (ROUND(AVG(md.avg_helmet_score), 2) - (SELECT prev_helmet_score FROM previous_month_data)) > 0
                THEN '+' || TO_CHAR(
                    ((ROUND(AVG(md.avg_helmet_score), 2) - (SELECT prev_helmet_score FROM previous_month_data)) /
                    NULLIF((SELECT prev_helmet_score FROM previous_month_data), 0)) * 100,
                    'FM999999999.00%'
                )
                ELSE TO_CHAR(
                    ((ROUND(AVG(md.avg_helmet_score), 2) - (SELECT prev_helmet_score FROM previous_month_data)) /
                    NULLIF((SELECT prev_helmet_score FROM previous_month_data), 0)) * 100,
                    'FM999999999.00%'
                )
            END,
            '0.00%'
        ),
        'totalIncidents', COALESCE(SUM(md.total_incidents), 0),
        'criticalIncidents', COALESCE(SUM(md.critical_incidents), 0),
        'duration', JSON_BUILD_OBJECT(
            'hours', COALESCE(ROUND(SUM(md.total_duration) / 3600, 0), 0),
            'minutes', COALESCE(ROUND((SUM(md.total_duration) % 3600) / 60, 0), 0 ),
            'seconds', COALESCE(ROUND(SUM(md.total_duration) % 60, 0), 0)
        ),
        'trends', (SELECT JSON_AGG(
            JSON_BUILD_OBJECT('date', record_date, 'score', ROUND(daily_avg_safety_score, 0))
        ) FROM trends),
        'safetyScoreDistribution', JSON_BUILD_OBJECT(
            'helmet', COALESCE(ROUND(AVG(md.avg_helmet_score), 1), 0),
            'footwear', COALESCE(ROUND(AVG(md.avg_footwear_score), 1), 0),
            'vest', COALESCE(ROUND(AVG(md.avg_vest_score), 1), 0),
            'gloves', COALESCE(ROUND(AVG(md.avg_gloves_score), 1), 0),
            'harness', COALESCE(ROUND(AVG(md.avg_harness_score), 1), 0),
            'scaffolding', COALESCE(ROUND(AVG(md.avg_scaffolding_score), 1), 0),
            'guardrails', COALESCE(ROUND(AVG(md.avg_guardrail_score), 1), 0)
        ),
        'snapshots', (SELECT JSON_AGG(
            JSON_BUILD_OBJECT('session_id', session_id, 'image_url', image_url, 'timestamp', "timestamp")
        ) FROM snapshots),
        'top3', JSON_BUILD_OBJECT(
            'improvements', (SELECT JSON_AGG(
                JSON_BUILD_OBJECT('name', item, 'positive', change>=0, 'value', ROUND(ABS(change), 1))
            ) FROM top3_improvements),
            'declinedMetrics', (SELECT JSON_AGG(
                JSON_BUILD_OBJECT('name', item, 'positive', change>=0, 'value', ROUND(ABS(change), 1))
            ) FROM top3_declined)
        )
    )
FROM monthly_data md;
 `;

const getStatsForDay = `
WITH day_data AS (
    SELECT
        DATE_TRUNC('hour', r.Timestamp) AS record_hour,
        AVG(r.helmet_score) AS avg_helmet_score,
        AVG(r.footwear_score) AS avg_footwear_score,
        AVG(r.vest_score) AS avg_vest_score,
        AVG(r.gloves_score) AS avg_gloves_score,
        AVG(r.harness_score) AS avg_harness_score,
        AVG(r.scaffolding_score) AS avg_scaffolding_score,
        AVG(r.guardrail_score) AS avg_guardrail_score,
        COUNT(DISTINCT i.incident_id) AS total_incidents,
        COUNT(DISTINCT CASE WHEN i.severity = 'Critical' THEN i.incident_id END) AS critical_incidents,
        SUM(EXTRACT(EPOCH FROM (s.end_time - s.start_time))) AS total_duration
    FROM records r
    LEFT JOIN sessions s ON r.session_id = s.session_id
    LEFT JOIN incidents i ON s.session_id = i.session_id
    WHERE EXTRACT(DAY FROM r.Timestamp) = $1
      AND EXTRACT(MONTH FROM r.Timestamp) = $2
      AND EXTRACT(YEAR FROM r.Timestamp) = $3
    GROUP BY record_hour
),
previous_day_data AS (
    SELECT
        AVG(r.helmet_score) AS prev_helmet_score,
        AVG(r.footwear_score) AS prev_footwear_score,
        AVG(r.vest_score) AS prev_vest_score,
        AVG(r.gloves_score) AS prev_gloves_score,
        AVG(r.harness_score) AS prev_harness_score,
        AVG(r.scaffolding_score) AS prev_scaffolding_score,
        AVG(r.guardrail_score) AS prev_guardrail_score
    FROM records r
    WHERE 
        (EXTRACT(DAY FROM r.Timestamp) = $1 - 1
        AND EXTRACT(MONTH FROM r.Timestamp) = $2
        AND EXTRACT(YEAR FROM r.Timestamp) = $3
    OR 
        ($1 = 1 
         AND EXTRACT(DAY FROM r.Timestamp) = 
             CASE 
                 WHEN $2 = 1 THEN 31 
                 ELSE DATE_PART('day', (DATE_TRUNC('month', MAKE_DATE($3::INT, $2::INT, 1)) - INTERVAL '1 day')::DATE)
             END
         AND EXTRACT(MONTH FROM r.Timestamp) = 
             CASE 
                 WHEN $2 = 1 THEN 12 
                 ELSE $2 - 1 
             END
         AND EXTRACT(YEAR FROM r.Timestamp) = 
             CASE 
                 WHEN $2 = 1 THEN $3 - 1 
                 ELSE $3 
             END
))),
trends AS (
    SELECT
        TO_CHAR(r.Timestamp, 'HH24:MI') AS record_hour,
        (AVG(r.helmet_score) + AVG(r.footwear_score) + AVG(r.vest_score) + AVG(r.gloves_score) + 
        AVG(r.scaffolding_score) + AVG(r.guardrail_score) + AVG(r.harness_score)) / 7 AS hourly_avg_safety_score
    FROM records r
    WHERE EXTRACT(DAY FROM r.Timestamp) = $1
      AND EXTRACT(MONTH FROM r.Timestamp) = $2
      AND EXTRACT(YEAR FROM r.Timestamp) = $3
    GROUP BY record_hour
),
snapshots AS (
    SELECT
        session_id,
        image_url,
        "timestamp"
    FROM snapshots
    WHERE session_id IN (
        SELECT session_id
        FROM sessions
        WHERE EXTRACT(DAY FROM start_time) = $1
          AND EXTRACT(MONTH FROM start_time) = $2
          AND EXTRACT(YEAR FROM start_time) = $3
    )
    ORDER BY "timestamp" DESC
    LIMIT 15
),
percentage_changes AS (
    SELECT
        'helmet' AS item,
        AVG(dd.avg_helmet_score - pdd.prev_helmet_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_helmet_score
    UNION ALL
    SELECT 'footwear' AS item, AVG(dd.avg_footwear_score - pdd.prev_footwear_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_footwear_score
    UNION ALL
    SELECT 'vest' AS item, AVG(dd.avg_vest_score - pdd.prev_vest_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_vest_score
    UNION ALL
    SELECT 'gloves' AS item, AVG(dd.avg_gloves_score - pdd.prev_gloves_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_gloves_score
    UNION ALL
    SELECT 'harness' AS item, AVG(dd.avg_harness_score - pdd.prev_harness_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_harness_score
    UNION ALL
    SELECT 'scaffolding' AS item, AVG(dd.avg_scaffolding_score - pdd.prev_scaffolding_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_scaffolding_score
    UNION ALL
    SELECT 'guardrail' AS item, AVG(dd.avg_guardrail_score - pdd.prev_guardrail_score) AS change
    FROM day_data dd
    CROSS JOIN previous_day_data pdd
    GROUP BY pdd.prev_guardrail_score
),
top3_improvements AS (
    SELECT item, change
    FROM percentage_changes
    ORDER BY change DESC
    LIMIT 3
),
top3_declined AS (
    SELECT item, change
    FROM percentage_changes
    ORDER BY change ASC
    LIMIT 3
)
SELECT JSON_BUILD_OBJECT(
    'date', TO_CHAR(TO_DATE($1::TEXT || '-' || $2::TEXT || '-' || $3::TEXT, 'DD-MM-YYYY'), 'YYYY-MM-DD'),
    'safetyScore', COALESCE(ROUND(AVG(dd.avg_helmet_score), 2), 0),
    'progress', COALESCE(
        CASE 
            WHEN (ROUND(AVG(dd.avg_helmet_score), 2) - (SELECT prev_helmet_score FROM previous_day_data)) > 0 
            THEN '+' || TO_CHAR(
                ((ROUND(AVG(dd.avg_helmet_score), 2) - (SELECT prev_helmet_score FROM previous_day_data)) / 
                NULLIF((SELECT prev_helmet_score FROM previous_day_data), 0)) * 100, 'FM999999999.00%'
            )
            ELSE TO_CHAR(
                ((ROUND(AVG(dd.avg_helmet_score), 2) - (SELECT prev_helmet_score FROM previous_day_data)) / 
                NULLIF((SELECT prev_helmet_score FROM previous_day_data), 0)) * 100, 'FM999999999.00%'
            )
        END, '0.00%'
    ),
    'totalIncidents', COALESCE(SUM(dd.total_incidents), 0),
    'criticalIncidents', COALESCE(SUM(dd.critical_incidents), 0),
    'duration', JSON_BUILD_OBJECT(
        'hours', COALESCE(ROUND(SUM(dd.total_duration) / 3600, 0), 0),
        'minutes', COALESCE(ROUND((SUM(dd.total_duration) % 3600) / 60, 0), 0),
        'seconds', COALESCE(ROUND(SUM(dd.total_duration) % 60, 0), 0)
    ),
    'trends', (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT('time', record_hour, 'score', ROUND(hourly_avg_safety_score, 0))
        ) FROM trends
    ),
    'safetyScoreDistribution', JSON_BUILD_OBJECT(
        'helmet', COALESCE(ROUND(AVG(dd.avg_helmet_score), 1), 0),
        'footwear', COALESCE(ROUND(AVG(dd.avg_footwear_score), 1), 0),
        'vest', COALESCE(ROUND(AVG(dd.avg_vest_score), 1), 0),
        'gloves', COALESCE(ROUND(AVG(dd.avg_gloves_score), 1), 0),
        'harness', COALESCE(ROUND(AVG(dd.avg_harness_score), 1), 0),
        'scaffolding', COALESCE(ROUND(AVG(dd.avg_scaffolding_score), 1), 0),
        'guardrails', COALESCE(ROUND(AVG(dd.avg_guardrail_score), 1), 0)
    ),
    'snapshots', (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT('session_id', session_id, 'image_url', image_url, 'timestamp', "timestamp")
        ) FROM snapshots
    ),
    'top3', JSON_BUILD_OBJECT(
        'improvements', (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT('name', item, 'positive', change >= 0, 'value', ROUND(ABS(change), 1))
            ) FROM top3_improvements
        ),
        'declinedMetrics', (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT('name', item, 'positive', change >= 0, 'value', ROUND(ABS(change), 1))
            ) FROM top3_declined
        )
    )
) AS day_data
FROM day_data dd;
`;

module.exports = {
  getStatsForMonth,
  getStatsForDay,
};
