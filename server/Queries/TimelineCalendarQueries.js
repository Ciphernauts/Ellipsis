const getStatsForMonthAndDays = `WITH month_data AS (
    SELECT
        s.session_id,
        s.start_time,
        s.end_time,
        s.safety_score,
        s.progress,
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
    FROM
        sessions s
    LEFT JOIN
        snapshots ss ON s.session_id = ss.session_id
    LEFT JOIN
        safety_score_distribution sd ON s.session_id = sd.session_id
    LEFT JOIN
        safety_score_trends st ON s.session_id = st.session_id
    WHERE
        EXTRACT(MONTH FROM s.start_time) = $1
        AND EXTRACT(YEAR FROM s.start_time) = $2
)
SELECT
    json_build_object(
        'month', json_build_object(
            'name', to_char(to_date($1::text, 'MM'), 'Month'),
            'snapshots', json_agg(DISTINCT ss.image_url),
            'safetyScore', COALESCE(AVG(s.safety_score), 0), -- Use COALESCE to handle cases with no sessions
            'progress', COALESCE(MAX(s.progress), '0%'), -- Use COALESCE to handle cases with no progress data
            'totalIncidents', COUNT(DISTINCT i.incident_id),
            'criticalIncidents', COUNT(DISTINCT i.incident_id) FILTER (WHERE i.severity = 'Critical'),
            'duration', json_build_object(
                'hours', COALESCE(EXTRACT(HOUR FROM SUM(s.end_time - s.start_time)), 0), -- Use COALESCE to handle cases with no sessions
                'minutes', COALESCE(EXTRACT(MINUTE FROM SUM(s.end_time - s.start_time)), 0),
                'seconds', COALESCE(EXTRACT(SECOND FROM SUM(s.end_time - s.start_time)), 0)
            ),
            'trends', json_agg(DISTINCT json_build_object('date', st.trend_timestamp, 'score', st.score)),
            'safetyScoreDistribution', json_build_object(
                'helmet', COALESCE(AVG(sd.helmet_score), 0), -- Use COALESCE to handle cases with no data
                'footwear', COALESCE(AVG(sd.footwear_score), 0),
                'vest', COALESCE(AVG(sd.vest_score), 0),
                'gloves', COALESCE(AVG(sd.gloves_score), 0),
                'scaffolding', COALESCE(AVG(sd.scaffolding_score), 0),
                'guardrails', COALESCE(AVG(sd.guardrails_score), 0),
                'harness', COALESCE(AVG(sd.harness_score), 0)
            ),
            'top3', json_build_object( -- Placeholder values for top3
                'improvements', json_agg(DISTINCT json_build_object('name', 'footwear', 'positive', true, 'value', 2.5)),
                'declinedMetrics', json_agg(DISTINCT json_build_object('name', 'scaffolding', 'positive', false, 'value', 1.3))
            )
        ),
        'days', json_agg(DISTINCT json_build_object(
            'date', to_char(s.start_time, 'YYYY-MM-DD'),
            'safetyScore', s.safety_score,
            'progress', s.progress,
            'totalIncidents', COUNT(DISTINCT i.incident_id),
            'criticalIncidents', COUNT(DISTINCT i.incident_id) FILTER (WHERE i.severity = 'Critical'),
            'duration', json_build_object(
                'hours', EXTRACT(HOUR FROM (s.end_time - s.start_time)),
                'minutes', EXTRACT(MINUTE FROM (s.end_time - s.start_time)),
                'seconds', EXTRACT(SECOND FROM (s.end_time - s.start_time))
            ),
            'safetyScoreDistribution', json_build_object(
                'helmet', sd.helmet_score,
                'footwear', sd.footwear_score,
                'vest', sd.vest_score,
                'gloves', sd.gloves_score,
                'scaffolding', sd.scaffolding_score,
                'guardrails', sd.guardrails_score,
                'harness', sd.harness_score
            ),
            'top3', json_build_object( -- Placeholder values for top3
                'improvements', json_agg(DISTINCT json_build_object('name', 'footwear', 'positive', true, 'value', 2.5)),
                'declinedMetrics', json_agg(DISTINCT json_build_object('name', 'scaffolding', 'positive', false, 'value', 1.3))
            ),
            'trends', json_agg(DISTINCT json_build_object('time', to_char(st.trend_timestamp, 'HH24:MI'), 'score', st.score)),
            'snapshots', json_agg(DISTINCT ss.image_url)
        ))
    ) AS calendar_data
FROM
    month_data s
LEFT JOIN
    incidents i ON s.session_id = i.session_id
LEFT JOIN
    snapshots ss ON s.session_id = ss.session_id
LEFT JOIN
    safety_score_distribution sd ON s.session_id = sd.session_id
LEFT JOIN
    safety_score_trends st ON s.session_id = st.session_id
GROUP BY
    s.session_id, s.start_time, s.end_time, s.safety_score, s.progress;`
    
module.exports = {
    getStatsForMonthAndDays,
};
