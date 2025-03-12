const getSafetyTrends = `
WITH latest_scores AS (
    SELECT
        session_id,
        MAX(timestamp) AS latest_timestamp
    FROM
        records
    GROUP BY
        session_id
),
current_avg AS (
    SELECT
        ROUND(AVG(
            CASE 
                WHEN $1 = 'helmet' THEN helmet_score
                WHEN $1 = 'footwear' THEN footwear_score
                WHEN $1 = 'vest' THEN vest_score
                WHEN $1 = 'gloves' THEN gloves_score
                WHEN $1 = 'scaffolding' THEN scaffolding_score
                WHEN $1 = 'guardrail' THEN guardrail_score
                WHEN $1 = 'harness' THEN harness_score
                ELSE NULL
            END
        )::numeric, 2) AS current_avg
    FROM
        records
    WHERE
        session_id IN (SELECT session_id FROM latest_scores)
),
next_sync AS (
    SELECT
        to_char(MAX(timestamp) + INTERVAL '5 minutes', 'YYYY-MM-DD HH12:MI AM') AS nextSync
    FROM
        records
),
trends_24_hours AS (
    SELECT
        to_char(date_trunc('hour', r.timestamp), 'HH24:00') AS name,
        ROUND(AVG(
            CASE 
                WHEN $1 = 'helmet' THEN r.helmet_score
                WHEN $1 = 'footwear' THEN r.footwear_score
                WHEN $1 = 'vest' THEN r.vest_score
                WHEN $1 = 'gloves' THEN r.gloves_score
                WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                WHEN $1 = 'guardrail' THEN r.guardrail_score
                WHEN $1 = 'harness' THEN r.harness_score
                ELSE NULL
            END
        )::numeric, 0) AS value,
		date_trunc('hour', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '24 hours'
    GROUP BY
        date_trunc('hour', r.timestamp)
    ORDER BY timestamp ASC
	),
trends_7_days AS (
    SELECT
        to_char(date_trunc('day', r.timestamp), 'DD Mon') AS name,
        ROUND(AVG(
            CASE 
                WHEN $1 = 'helmet' THEN r.helmet_score
                WHEN $1 = 'footwear' THEN r.footwear_score
                WHEN $1 = 'vest' THEN r.vest_score
                WHEN $1 = 'gloves' THEN r.gloves_score
                WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                WHEN $1 = 'guardrail' THEN r.guardrail_score
                WHEN $1 = 'harness' THEN r.harness_score
                ELSE NULL
            END
        )::numeric, 0) AS value,
		date_trunc('day', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '7 days'
    GROUP BY
        date_trunc('day', r.timestamp)
	ORDER BY timestamp ASC
),
trends_30_days AS (
    SELECT
        to_char(date_trunc('day', r.timestamp), 'DD Mon') AS name,
        ROUND(AVG(
            CASE 
                WHEN $1 = 'helmet' THEN r.helmet_score
                WHEN $1 = 'footwear' THEN r.footwear_score
                WHEN $1 = 'vest' THEN r.vest_score
                WHEN $1 = 'gloves' THEN r.gloves_score
                WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                WHEN $1 = 'guardrail' THEN r.guardrail_score
                WHEN $1 = 'harness' THEN r.harness_score
                ELSE NULL
            END
        )::numeric, 0) AS value,
		date_trunc('day', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY
        date_trunc('day', r.timestamp)
	ORDER BY timestamp ASC
),
trends_12_months AS (
    SELECT
        to_char(date_trunc('month', r.timestamp), 'Mon') AS name,
        ROUND(AVG(
            CASE 
                WHEN $1 = 'helmet' THEN r.helmet_score
                WHEN $1 = 'footwear' THEN r.footwear_score
                WHEN $1 = 'vest' THEN r.vest_score
                WHEN $1 = 'gloves' THEN r.gloves_score
                WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                WHEN $1 = 'guardrail' THEN r.guardrail_score
                WHEN $1 = 'harness' THEN r.harness_score
                ELSE NULL
            END
        )::numeric, 0) AS value,
		date_trunc('month', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '12 months'
    GROUP BY
        date_trunc('month', r.timestamp)
	ORDER BY timestamp ASC
),
growth_calculation AS (
    SELECT
        '24 hours' AS timeframe,
        COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_24_hours ORDER BY timestamp DESC LIMIT 1), 0) AS growth
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_7_days ORDER BY timestamp DESC LIMIT 1), 0) AS growth
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_30_days ORDER BY timestamp DESC LIMIT 1), 0) AS growth
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_12_months ORDER BY timestamp DESC LIMIT 1), 0) AS growth
),
max_score_calculation AS (
    SELECT
        '24 hours' AS timeframe,
        MAX(value) AS maxScore
    FROM
        trends_24_hours
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        MAX(value) AS maxScore
    FROM
        trends_7_days
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        MAX(value) AS maxScore
    FROM
        trends_30_days
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        MAX(value) AS maxScore
    FROM
        trends_12_months
),
min_score_calculation AS (
    SELECT
        '24 hours' AS timeframe,
        MIN(value) AS minScore
    FROM
        trends_24_hours
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        MIN(value) AS minScore
    FROM
        trends_7_days
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        MIN(value) AS minScore
    FROM
        trends_30_days
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        MIN(value) AS minScore
    FROM
        trends_12_months
),
latest_records AS (
    SELECT
        to_char(r.timestamp, 'YYYY-MM-DD HH12:MI AM') AS timestamp,
        ROUND(
            CASE 
                WHEN $1 = 'helmet' THEN r.helmet_score
                WHEN $1 = 'footwear' THEN r.footwear_score
                WHEN $1 = 'vest' THEN r.vest_score
                WHEN $1 = 'gloves' THEN r.gloves_score
                WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                WHEN $1 = 'guardrail' THEN r.guardrail_score
                WHEN $1 = 'harness' THEN r.harness_score
                ELSE NULL
            END, 2
        ) AS safetyScore,
        COALESCE(
            CASE 
                WHEN $1 = 'helmet' THEN r.helmet_score
                WHEN $1 = 'footwear' THEN r.footwear_score
                WHEN $1 = 'vest' THEN r.vest_score
                WHEN $1 = 'gloves' THEN r.gloves_score
                WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                WHEN $1 = 'guardrail' THEN r.guardrail_score
                WHEN $1 = 'harness' THEN r.harness_score
                ELSE NULL
            END - 
            LEAD(
                CASE 
                    WHEN $1 = 'helmet' THEN r.helmet_score
                    WHEN $1 = 'footwear' THEN r.footwear_score
                    WHEN $1 = 'vest' THEN r.vest_score
                    WHEN $1 = 'gloves' THEN r.gloves_score
                    WHEN $1 = 'scaffolding' THEN r.scaffolding_score
                    WHEN $1 = 'guardrail' THEN r.guardrail_score
                    WHEN $1 = 'harness' THEN r.harness_score
                    ELSE NULL
                END
            ) OVER (ORDER BY r.timestamp DESC), 0
        ) AS growth,
        COUNT(i.incident_id) AS alertCount
    FROM
        records r
    LEFT JOIN
        incidents i ON r.recordid = i.recordid
    GROUP BY
		r.recordid
    ORDER BY
        r.timestamp DESC
    LIMIT 50
)
SELECT
    json_build_object(
        'currentAvg', (SELECT current_avg FROM current_avg),
        'growth', (
            SELECT json_object_agg(timeframe, growth)
            FROM growth_calculation
        ),
        'maxScore', (
            SELECT json_object_agg(timeframe, maxScore)
            FROM max_score_calculation
        ),
        'minScore', (
            SELECT json_object_agg(timeframe, minScore)
            FROM min_score_calculation
        ),
        'nextSync', (SELECT nextSync FROM next_sync),
        'trends', json_build_object(
            '24 hours', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_24_hours), '[]'::json),
            '7 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_7_days), '[]'::json),
            '30 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_30_days), '[]'::json),
            '12 months', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_12_months), '[]'::json)
        ),
        'records', COALESCE((SELECT json_agg(json_build_object('timestamp', timestamp, 'safetyScore', safetyScore, 'growth', growth, 'alertCount', alertCount)) FROM latest_records), '[]'::json)
    ) AS compliance_data;
`;

const getOverallSafetyTrends = `
WITH latest_scores AS (
    SELECT
        session_id,
        MAX(timestamp) AS latest_timestamp
    FROM
        records
    GROUP BY
        session_id
),
current_avg AS (
    SELECT
        ROUND(AVG(
            (helmet_score + footwear_score + vest_score + gloves_score + scaffolding_score + guardrail_score + harness_score) / 7.0
        )::numeric, 2) AS current_avg
    FROM
        records
    WHERE
        session_id IN (SELECT session_id FROM latest_scores)
),
next_sync AS (
    SELECT
        to_char(MAX(timestamp) + INTERVAL '5 minutes', 'YYYY-MM-DD HH12:MI AM') AS nextSync
    FROM
        records
),
trends_24_hours AS (
    SELECT
        to_char(date_trunc('hour', r.timestamp), 'HH24:00') AS name,
        ROUND(AVG(
            (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0
        )::numeric, 0) AS value,
        date_trunc('hour', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '24 hours'
    GROUP BY
        date_trunc('hour', r.timestamp)
	ORDER BY timestamp ASC
),
trends_7_days AS (
    SELECT
        to_char(date_trunc('day', r.timestamp), 'DD Mon') AS name,
        ROUND(AVG(
            (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0
        )::numeric, 0) AS value,
        date_trunc('day', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '7 days'
    GROUP BY
        date_trunc('day', r.timestamp)
	ORDER BY timestamp ASC
),
trends_30_days AS (
    SELECT
        to_char(date_trunc('day', r.timestamp), 'DD Mon') AS name,
        ROUND(AVG(
            (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0
        )::numeric, 0) AS value,
        date_trunc('day', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY
        date_trunc('day', r.timestamp)
	ORDER BY timestamp ASC
),
trends_12_months AS (
    SELECT
        to_char(date_trunc('month', r.timestamp), 'Mon') AS name,
        ROUND(AVG(
            (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0
        )::numeric, 0) AS value,
        date_trunc('month', r.timestamp) AS timestamp
    FROM
        records r
    WHERE
        r.timestamp >= NOW() - INTERVAL '12 months'
    GROUP BY
        date_trunc('month', r.timestamp)
	ORDER BY timestamp ASC
),
growth_calculation AS (
    SELECT
        '24 hours' AS timeframe,
        ROUND(COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_24_hours ORDER BY timestamp DESC LIMIT 1), 0), 1) AS growth
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        ROUND(COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_7_days ORDER BY timestamp DESC LIMIT 1), 0), 1) AS growth
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        ROUND(COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_30_days ORDER BY timestamp DESC LIMIT 1), 0), 1) AS growth
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        ROUND(COALESCE((SELECT value - LAG(value) OVER (ORDER BY timestamp ASC) FROM trends_12_months ORDER BY timestamp DESC LIMIT 1), 0), 1) AS growth
),
latest_record AS (
    SELECT
        r.helmet_score,
        r.footwear_score,
        r.vest_score,
        r.gloves_score,
        r.scaffolding_score,
        r.guardrail_score,
        r.harness_score
    FROM
        records r
    ORDER BY
        r.timestamp DESC
    LIMIT 1
),
latest_records AS (
    SELECT
        to_char(r.timestamp, 'YYYY-MM-DD HH12:MI AM') AS timestamp,
        ROUND(
            (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0, 2
        ) AS safetyScore,
        ROUND(
            COALESCE(
                (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0 - 
                LEAD(
                    (r.helmet_score + r.footwear_score + r.vest_score + r.gloves_score + r.scaffolding_score + r.guardrail_score + r.harness_score) / 7.0
                ) OVER (ORDER BY r.timestamp DESC), 0
            ), 1
        ) AS growth,  -- Round growth to 1 decimal point
        COUNT(i.incident_id) AS alertCount
    FROM
        records r
    LEFT JOIN
        incidents i ON r.recordid = i.recordid
    GROUP BY
		r.recordid
    ORDER BY
        r.timestamp DESC
    LIMIT 50
),
best_worst_metrics AS (
    SELECT
        json_build_object(
            'bestMetric', json_build_object(
                'category', 
                CASE 
                    WHEN helmet_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'helmet'
                    WHEN footwear_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'footwear'
                    WHEN vest_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'vest'
                    WHEN gloves_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'gloves'
                    WHEN scaffolding_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'scaffolding'
                    WHEN guardrail_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'guardrail'
                    WHEN harness_score = GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'harness'
                END,
                'value', GREATEST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score)
            ),
            'worstMetric', json_build_object(
                'category', 
                CASE 
                    WHEN helmet_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'helmet'
                    WHEN footwear_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'footwear'
                    WHEN vest_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'vest'
                    WHEN gloves_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'gloves'
                    WHEN scaffolding_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'scaffolding'
                    WHEN guardrail_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'guardrail'
                    WHEN harness_score = LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score) THEN 'harness'
                END,
                'value', LEAST(helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrail_score, harness_score)
            )
        ) AS metrics
    FROM
        latest_record
)
SELECT
    json_build_object(
        'currentAvg', (SELECT current_avg FROM current_avg),
        'growth', (
            SELECT json_object_agg(timeframe, growth)
            FROM growth_calculation
        ),
        'bestMetric', (
            SELECT metrics->'bestMetric' FROM best_worst_metrics
        ),
        'worstMetric', (
            SELECT metrics->'worstMetric' FROM best_worst_metrics
        ),
        'nextSync', (SELECT nextSync FROM next_sync),
        'trends', json_build_object(
            '24 hours', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_24_hours), '[]'::json),
            '7 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_7_days), '[]'::json),
            '30 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_30_days), '[]'::json),
            '12 months', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_12_months), '[]'::json)
        ),
        'records', COALESCE((SELECT json_agg(json_build_object('timestamp', timestamp, 'safetyScore', safetyScore, 'growth', ROUND(growth, 1), 'alertCount', alertCount)) FROM latest_records), '[]'::json) -- Round growth to 1 decimal point
    ) AS compliance_data;
`;

module.exports = {
  getSafetyTrends,
  getOverallSafetyTrends,
};
