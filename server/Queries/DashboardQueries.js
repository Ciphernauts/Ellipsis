const getDashboardData = `
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
        Timestamp = (SELECT MAX(Timestamp) FROM records)
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
),
latest_snapshots AS (
    SELECT 
        snapshot_id,
        image_url
    FROM 
        snapshots
    ORDER BY 
        timestamp DESC
    LIMIT 3
),
latest_session AS (
    SELECT 
        start_time,
        end_time
    FROM 
        sessions
    ORDER BY 
        start_time DESC
    LIMIT 1
),
recent_incidents AS (
    SELECT 
        incident_time,
        category,
        severity
    FROM 
        incidents
    ORDER BY 
        incident_time DESC
    LIMIT 3
)
SELECT json_build_object(
    'safetyscore', json_build_object(
        'ppe', json_build_object(
            'helmet', (SELECT helmet_score FROM latest_scores),
            'vest', (SELECT vest_score FROM latest_scores),
            'footwear', (SELECT footwear_score FROM latest_scores),
            'gloves', (SELECT gloves_score FROM latest_scores)
        ),
        'fall', json_build_object(
            'scaffolding', (SELECT scaffolding_score FROM latest_scores),
            'guardrails', (SELECT guardrail_score FROM latest_scores),
            'harness', (SELECT harness_score FROM latest_scores)
        )
    ),
    'trends', json_build_object(
        'chart', json_build_object(
            '24 hours', COALESCE((SELECT json_agg(json_build_object('time', name, 'value', value)) FROM trends_24_hours), '[]'::json),
            '7 days', COALESCE((SELECT json_agg(json_build_object('time', name, 'value', value)) FROM trends_7_days), '[]'::json),
            '30 days', COALESCE((SELECT json_agg(json_build_object('time', name, 'value', value)) FROM trends_30_days), '[]'::json),
            '12 months', COALESCE((SELECT json_agg(json_build_object('time', name, 'value', value)) FROM trends_12_months), '[]'::json)
        ),
        'growth', (
            SELECT json_object_agg(timeframe, growth)
            FROM growth_calculation
        ),
        'best', (
            SELECT metrics->'bestMetric' FROM best_worst_metrics
        ),
        'worst', (
            SELECT metrics->'worstMetric' FROM best_worst_metrics
        )
    ),
    'compliancebreakdown', json_build_object(
        'ppe', json_build_array(
            json_build_object('name', 'helmet', 'value', (SELECT helmet_score FROM latest_record)),
            json_build_object('name', 'vest', 'value', (SELECT vest_score FROM latest_record)),
            json_build_object('name', 'footwear', 'value', (SELECT footwear_score FROM latest_record)),
            json_build_object('name', 'gloves', 'value', (SELECT gloves_score FROM latest_record))
        ),
        'fall', json_build_array(
            json_build_object('name', 'scaffolding', 'value', (SELECT scaffolding_score FROM latest_record)),
            json_build_object('name', 'guardrails', 'value', (SELECT guardrail_score FROM latest_record)),
            json_build_object('name', 'harness', 'value', (SELECT harness_score FROM latest_record))
        )
    ),
    'snapshots', (SELECT json_agg(
        json_build_object(
            'id', snapshot_id,
            'url', image_url
        )
    ) FROM latest_snapshots),
    'sessionduration', (
        SELECT json_build_object(
            'hours', EXTRACT(HOUR FROM (end_time - start_time)),
            'minutes', EXTRACT(MINUTE FROM (end_time - start_time))
        )
        FROM latest_session
    ),
    'activecameras', 1,
    'recentincidents', (
        SELECT json_agg(
            json_build_object(
                'timestamp', incident_time,
                'category', category,
                'severity', severity
            )
        ) FROM recent_incidents
    )
);
`;

module.exports = {
  getDashboardData,
};
