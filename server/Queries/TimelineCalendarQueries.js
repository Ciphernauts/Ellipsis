const getStatsForMonth = `
WITH month_data AS (
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
        st."timestamp" AS trend_timestamp,
        i.severity
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
    LEFT JOIN incidents i
        ON s.session_id = i.session_id
    WHERE
        EXTRACT(MONTH FROM s.start_time) = $1 AND EXTRACT(YEAR FROM s.start_time) = $2
), PrevMonthData AS (
    SELECT
        AVG(s.safety_score) AS prev_month_safety_score,
        AVG(sd.helmet_score) AS prev_helmet_score,
        AVG(sd.footwear_score) AS prev_footwear_score,
        AVG(sd.vest_score) AS prev_vest_score,
        AVG(sd.gloves_score) AS prev_gloves_score,
        AVG(sd.scaffolding_score) AS prev_scaffolding_score,
        AVG(sd.guardrails_score) AS prev_guardrails_score,
        AVG(sd.harness_score) AS prev_harness_score
    FROM sessions s
    LEFT JOIN safety_score_distribution sd
        ON s.session_id = sd.session_id
    WHERE
        EXTRACT(MONTH FROM start_time) = $1 - 1 AND EXTRACT(YEAR FROM start_time) = $2
)
SELECT
    JSON_BUILD_OBJECT(
        'name', to_char(to_date($1::TEXT, 'MM'), 'Month'),
        'safetyScore', COALESCE(ROUND(AVG(month_data.safety_score)::NUMERIC, 2), 0),
        'progress', COALESCE(
            CASE
                WHEN (AVG(month_data.safety_score) - (SELECT prev_month_safety_score FROM PrevMonthData)) > 0
                THEN '+' || to_char(
                    ((AVG(month_data.safety_score) - (SELECT prev_month_safety_score FROM PrevMonthData)) /
                    NULLIF((SELECT prev_month_safety_score FROM PrevMonthData), 0)) * 100,
                    'FM999999999.00%'
                )
                ELSE to_char(
                    ((AVG(month_data.safety_score) - (SELECT prev_month_safety_score FROM PrevMonthData)) /
                    NULLIF((SELECT prev_month_safety_score FROM PrevMonthData), 0)) * 100,
                    'FM999999999.00%'
                )
            END,
            '0.00%'
        ),
        'totalIncidents', COUNT(DISTINCT i.incident_id),
        'criticalIncidents', COUNT(DISTINCT CASE WHEN i.severity = 'Critical' THEN i.incident_id ELSE NULL END),
        'duration', json_build_object(
            'hours', COALESCE(EXTRACT(HOUR FROM SUM(end_time - start_time)), 0),
            'minutes', COALESCE(EXTRACT(MINUTE FROM SUM(end_time - start_time)), 0),
            'seconds', COALESCE(EXTRACT(SECOND FROM SUM(end_time - start_time)), 0)
        ),
        'trends', (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT('date', trend_timestamp::DATE, 'score', score)
            )
            FROM (
                SELECT DISTINCT ON (trend_timestamp::DATE)
                    trend_timestamp::DATE,
                    score
                FROM month_data
                ORDER BY trend_timestamp::DATE, trend_timestamp DESC
            ) AS unique_trends
        ),
        'safetyScoreDistribution', json_build_object(
            'helmet', COALESCE(ROUND(AVG(sd.helmet_score)::NUMERIC, 1), 0),
            'footwear', COALESCE(ROUND(AVG(sd.footwear_score)::NUMERIC, 1), 0),
            'vest', COALESCE(ROUND(AVG(sd.vest_score)::NUMERIC, 1), 0),
            'gloves', COALESCE(ROUND(AVG(sd.gloves_score)::NUMERIC, 1), 0),
            'scaffolding', COALESCE(ROUND(AVG(sd.scaffolding_score)::NUMERIC, 1), 0),
            'guardrails', COALESCE(ROUND(AVG(sd.guardrails_score)::NUMERIC, 1), 0),
            'harness', COALESCE(ROUND(AVG(sd.harness_score)::NUMERIC, 1), 0)
        ),
        'top3', (
            SELECT
                json_build_object(
                    'improvements', (
                        SELECT json_agg(
                            json_build_object('name', metric, 'positive', diff > 0, 'value', ABS(ROUND(diff::NUMERIC, 1)))
                        )
                        FROM (
                            SELECT
                                metric,
                                current_score,
                                prev_score,
                                current_score - prev_score AS diff
                            FROM (
                                VALUES
                                    ('helmet', COALESCE(AVG(sd.helmet_score), 0), (SELECT prev_helmet_score FROM PrevMonthData)),
                                    ('footwear', COALESCE(AVG(sd.footwear_score), 0), (SELECT prev_footwear_score FROM PrevMonthData)),
                                    ('vest', COALESCE(AVG(sd.vest_score), 0), (SELECT prev_vest_score FROM PrevMonthData)),
                                    ('gloves', COALESCE(AVG(sd.gloves_score), 0), (SELECT prev_gloves_score FROM PrevMonthData)),
                                    ('scaffolding', COALESCE(AVG(sd.scaffolding_score), 0), (SELECT prev_scaffolding_score FROM PrevMonthData)),
                                    ('guardrails', COALESCE(AVG(sd.guardrails_score), 0), (SELECT prev_guardrails_score FROM PrevMonthData)),
                                    ('harness', COALESCE(AVG(sd.harness_score), 0), (SELECT prev_harness_score FROM PrevMonthData))
                            ) AS metrics(metric, current_score, prev_score)
                            ORDER BY ABS(current_score - prev_score) DESC
                            LIMIT 3
                        )
                    ),
                    'declinedMetrics', (
                        SELECT json_agg(
                            json_build_object('name', metric, 'positive', diff > 0, 'value', ABS(ROUND(diff::NUMERIC, 1)))
                        )
                        FROM (
                            SELECT
                                metric,
                                current_score,
                                prev_score,
                                current_score - prev_score AS diff
                            FROM (
                                VALUES
                                    ('helmet', COALESCE(AVG(sd.helmet_score), 0), (SELECT prev_helmet_score FROM PrevMonthData)),
                                    ('footwear', COALESCE(AVG(sd.footwear_score), 0), (SELECT prev_footwear_score FROM PrevMonthData)),
                                    ('vest', COALESCE(AVG(sd.vest_score), 0), (SELECT prev_vest_score FROM PrevMonthData)),
                                    ('gloves', COALESCE(AVG(sd.gloves_score), 0), (SELECT prev_gloves_score FROM PrevMonthData)),
                                    ('scaffolding', COALESCE(AVG(sd.scaffolding_score), 0), (SELECT prev_scaffolding_score FROM PrevMonthData)),
                                    ('guardrails', COALESCE(AVG(sd.guardrails_score), 0), (SELECT prev_guardrails_score FROM PrevMonthData)),
                                    ('harness', COALESCE(AVG(sd.harness_score), 0), (SELECT prev_harness_score FROM PrevMonthData))
                            ) AS metrics(metric, current_score, prev_score)
                            ORDER BY ABS(current_score - prev_score) DESC
                            OFFSET 3
                            LIMIT 3
                        )
                    )
                )
        ),
        'snapshots', (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT('image_url', image_url, 'timestamp', "timestamp")
            )
            FROM (
                SELECT
                    image_url,
                    "timestamp"
                FROM snapshots
                WHERE
                    EXTRACT(MONTH FROM "timestamp") = $1
                    AND EXTRACT(YEAR FROM "timestamp") = $2
                ORDER BY "timestamp" DESC
                LIMIT 15
            ) AS latest_snapshots
        )
    ) AS month_data
FROM month_data
LEFT JOIN incidents i ON month_data.session_id = i.session_id
LEFT JOIN safety_score_distribution sd ON month_data.session_id = sd.session_id;
`;

const getStatsForDay = `
WITH day_data AS (
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
        st."timestamp" AS trend_timestamp,
        i.severity,
        i.incident_id,  -- Include incident_id in day_data
        sd.distribution_id -- Include distribution_id in day_data
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
    LEFT JOIN incidents i
        ON s.session_id = i.session_id
    WHERE
        EXTRACT(DAY FROM s.start_time) = $1
        AND EXTRACT(MONTH FROM s.start_time) = $2
        AND EXTRACT(YEAR FROM s.start_time) = $3
), PrevDayData AS (
    SELECT
        AVG(s.safety_score) AS prev_day_safety_score,
        AVG(sd.helmet_score) AS prev_helmet_score,
        AVG(sd.footwear_score) AS prev_footwear_score,
        AVG(sd.vest_score) AS prev_vest_score,
        AVG(sd.gloves_score) AS prev_gloves_score,
        AVG(sd.scaffolding_score) AS prev_scaffolding_score,
        AVG(sd.guardrails_score) AS prev_guardrails_score,
        AVG(sd.harness_score) AS prev_harness_score
    FROM sessions s
    LEFT JOIN safety_score_distribution sd
        ON s.session_id = sd.session_id
    WHERE
        EXTRACT(DAY FROM start_time) = $1 - 1
        AND EXTRACT(MONTH FROM start_time) = $2
        AND EXTRACT(YEAR FROM start_time) = $3
)
SELECT
    JSON_BUILD_OBJECT(
        'date', to_char(to_date($1::TEXT || '-' || $2::TEXT || '-' || $3::TEXT, 'DD-MM-YYYY'), 'YYYY-MM-DD'),
        'safetyScore', COALESCE(ROUND(AVG(day_data.safety_score)::NUMERIC, 2), 0),
        'progress', COALESCE(
            CASE
                WHEN (AVG(day_data.safety_score) - (SELECT prev_day_safety_score FROM PrevDayData)) > 0
                THEN '+' || to_char(
                    ((AVG(day_data.safety_score) - (SELECT prev_day_safety_score FROM PrevDayData)) /
                    NULLIF((SELECT prev_day_safety_score FROM PrevDayData), 0)) * 100,
                    'FM999999999.00%'
                )
                ELSE to_char(
                    ((AVG(day_data.safety_score) - (SELECT prev_day_safety_score FROM PrevDayData)) /
                    NULLIF((SELECT prev_day_safety_score FROM PrevDayData), 0)) * 100,
                    'FM999999999.00%'
                )
            END,
            '0.00%'
        ),
        'totalIncidents', COUNT(DISTINCT incident_id),
        'criticalIncidents', COUNT(DISTINCT CASE WHEN severity = 'Critical' THEN incident_id ELSE NULL END),
        'duration', json_build_object(
            'hours', COALESCE(EXTRACT(HOUR FROM SUM(end_time - start_time)), 0),
            'minutes', COALESCE(EXTRACT(MINUTE FROM SUM(end_time - start_time)), 0),
            'seconds', COALESCE(EXTRACT(SECOND FROM SUM(end_time - start_time)), 0)
        ),
        'trends', (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT('time', to_char(trend_timestamp, 'HH12am'), 'score', score)
            )
            FROM (
                SELECT DISTINCT ON (trend_timestamp::TIME)
                    trend_timestamp,
                    score
                FROM day_data
                ORDER BY trend_timestamp::TIME, trend_timestamp DESC
            ) AS unique_trends
        ),
        'safetyScoreDistribution', json_build_object(
            'helmet', COALESCE(ROUND(AVG(sd.helmet_score)::NUMERIC, 1), 0),
            'footwear', COALESCE(ROUND(AVG(sd.footwear_score)::NUMERIC, 1), 0),
            'vest', COALESCE(ROUND(AVG(sd.vest_score)::NUMERIC, 1), 0),
            'gloves', COALESCE(ROUND(AVG(sd.gloves_score)::NUMERIC, 1), 0),
            'scaffolding', COALESCE(ROUND(AVG(sd.scaffolding_score)::NUMERIC, 1), 0),
            'guardrails', COALESCE(ROUND(AVG(sd.guardrails_score)::NUMERIC, 1), 0),
            'harness', COALESCE(ROUND(AVG(sd.harness_score)::NUMERIC, 1), 0)
        ),
        'top3', (
            SELECT
                json_build_object(
                    'improvements', (
                        SELECT json_agg(
                            json_build_object('name', metric, 'positive', diff > 0, 'value', ABS(ROUND(diff::NUMERIC, 1)))
                        )
                        FROM (
                            SELECT
                                metric,
                                current_score,
                                prev_score,
                                current_score - prev_score AS diff
                            FROM (
                                VALUES
                                    ('helmet', COALESCE(AVG(sd.helmet_score), 0), (SELECT prev_helmet_score FROM PrevDayData)),
                                    ('footwear', COALESCE(AVG(sd.footwear_score), 0), (SELECT prev_footwear_score FROM PrevDayData)),
                                    ('vest', COALESCE(AVG(sd.vest_score), 0), (SELECT prev_vest_score FROM PrevDayData)),
                                    ('gloves', COALESCE(AVG(sd.gloves_score), 0), (SELECT prev_gloves_score FROM PrevDayData)),
                                    ('scaffolding', COALESCE(AVG(sd.scaffolding_score), 0), (SELECT prev_scaffolding_score FROM PrevDayData)),
                                    ('guardrails', COALESCE(AVG(sd.guardrails_score), 0), (SELECT prev_guardrails_score FROM PrevDayData)),
                                    ('harness', COALESCE(AVG(sd.harness_score), 0), (SELECT prev_harness_score FROM PrevDayData))
                            ) AS metrics(metric, current_score, prev_score)
                            ORDER BY ABS(current_score - prev_score) DESC
                            LIMIT 3)
                    ),
                    'declinedMetrics', (
                        SELECT json_agg(
                            json_build_object('name', metric, 'positive', diff > 0, 'value', ABS(ROUND(diff::NUMERIC, 1)))
                        )
                        FROM (
                            SELECT
                                metric,
                                current_score,
                                prev_score,
                                current_score - prev_score AS diff
                            FROM (
                                VALUES
                                    ('helmet', COALESCE(AVG(sd.helmet_score), 0), (SELECT prev_helmet_score FROM PrevDayData)),
                                    ('footwear', COALESCE(AVG(sd.footwear_score), 0), (SELECT prev_footwear_score FROM PrevDayData)),
                                    ('vest', COALESCE(AVG(sd.vest_score), 0), (SELECT prev_vest_score FROM PrevDayData)),
                                    ('gloves', COALESCE(AVG(sd.gloves_score), 0), (SELECT prev_gloves_score FROM PrevDayData)),
                                    ('scaffolding', COALESCE(AVG(sd.scaffolding_score), 0), (SELECT prev_scaffolding_score FROM PrevDayData)),
                                    ('guardrails', COALESCE(AVG(sd.guardrails_score), 0), (SELECT prev_guardrails_score FROM PrevDayData)),
                                    ('harness', COALESCE(AVG(sd.harness_score), 0), (SELECT prev_harness_score FROM PrevDayData))
                            ) AS metrics(metric, current_score, prev_score)
                            ORDER BY ABS(current_score - prev_score) DESC
                            OFFSET 3
                            LIMIT 3 
                    )
                )
            )
        ),
        'snapshots', (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT('image_url', image_url, 'timestamp', "timestamp")
            )
            FROM (
                SELECT
                    image_url,
                    "timestamp"
                FROM snapshots
                WHERE
                    EXTRACT(DAY FROM "timestamp") = $1
                    AND EXTRACT(MONTH FROM "timestamp") = $2
                    AND EXTRACT(YEAR FROM "timestamp") = $3
                ORDER BY "timestamp" DESC
                LIMIT 15
            ) AS latest_snapshots
        )
    ) AS day_data
FROM day_data
LEFT JOIN safety_score_distribution sd
    ON day_data.distribution_id = sd.distribution_id;
`;

module.exports = {
  getStatsForMonth,
  getStatsForDay,
};
