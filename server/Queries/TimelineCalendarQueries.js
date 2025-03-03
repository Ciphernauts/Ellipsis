const getStatsForMonthAndDays = `WITH month_data AS (
    SELECT
        s.session_id,
        s.start_time,
        s.end_time,
        s.safety_score,
        s.progress,
        ss.image_url,
        ss."timestamp",
        sd.helmet_score, -- Corrected column name
        sd.footwear_score,
        sd.vest_score,
        sd.gloves_score,
        sd.scaffolding_score,
        sd.guardrails_score,
        sd.harness_score,
        st.trend_id,
        st.score,
        st."timestamp" AS date -- Alias the timestamp column from safety_score_trends as date
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
            'safetyScore', AVG(s.safety_score),
            'progress', MAX(s.progress),
            'totalIncidents', COUNT(DISTINCT i.incident_id),
            'criticalIncidents', COUNT(DISTINCT i.incident_id) FILTER (WHERE i.severity = 'Critical'),
            'duration', json_build_object(
                'hours', EXTRACT(HOUR FROM SUM(s.end_time - s.start_time)),
                'minutes', EXTRACT(MINUTE FROM SUM(s.end_time - s.start_time)),
                'seconds', EXTRACT(SECOND FROM SUM(s.end_time - s.start_time))
            ),
            'trends', json_agg(DISTINCT json_build_object('date', st.date, 'score', st.score)),
            'safetyScoreDistribution', json_build_object(
                'helmet', AVG(sd.helmet_score), -- Corrected column name
                'footwear', AVG(sd.footwear_score),
                'vest', AVG(sd.vest_score),
                'gloves', AVG(sd.gloves_score),
                'scaffolding', AVG(sd.scaffolding_score),
                'guardrails', AVG(sd.guardrails_score),
                'harness', AVG(sd.harness_score)
            ),
            'top3', json_build_object(
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
                'helmet', sd.helmet_score, -- Corrected column name
                'footwear', sd.footwear_score,
                'vest', sd.vest_score,
                'gloves', sd.gloves_score,
                'scaffolding', sd.scaffolding_score,
                'guardrails', sd.guardrails_score,
                'harness', sd.harness_score
            ),
            'top3', json_build_object(
                'improvements', json_agg(DISTINCT json_build_object('name', 'footwear', 'positive', true, 'value', 2.5)),
                'declinedMetrics', json_agg(DISTINCT json_build_object('name', 'scaffolding', 'positive', false, 'value', 1.3))
            ),
            'trends', json_agg(DISTINCT json_build_object('time', to_char(st.date, 'HH24:MI'), 'score', st.score)),
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
