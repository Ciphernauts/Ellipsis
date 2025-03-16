const getAllIncidentTrends = `
WITH trends_24_hours AS (
    SELECT 
        to_char(date_trunc('hour', incident_time), 'HH12:00 AM') AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '24 hours'
    GROUP BY date_trunc('hour', incident_time)
    ORDER BY date_trunc('hour', incident_time)
),
trends_7_days AS (
    SELECT 
        to_char(date_trunc('day', incident_time), 'Day') AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '7 days'
    GROUP BY date_trunc('day', incident_time)
    ORDER BY date_trunc('day', incident_time)
),
trends_30_days AS (
    SELECT 
        to_char(date_trunc('day', incident_time), 'DD Mon') AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '30 days'
    GROUP BY date_trunc('day', incident_time)
    ORDER BY date_trunc('day', incident_time)
),
trends_12_months AS (
    SELECT 
        to_char(date_trunc('month', incident_time), 'Mon') AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '12 months'
    GROUP BY date_trunc('month', incident_time)
    ORDER BY date_trunc('month', incident_time)
),
breakdown_24_hours AS (
    SELECT 
        category AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '24 hours'
    GROUP BY category
),
breakdown_7_days AS (
    SELECT 
        category AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '7 days'
    GROUP BY category
),
breakdown_30_days AS (
    SELECT 
        category AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '30 days'
    GROUP BY category
),
breakdown_12_months AS (
    SELECT 
        category AS name,
        COUNT(*) AS value
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '12 months'
    GROUP BY category
),
alert_metrics_24_hours AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS falseAlarm,
        COUNT(*) AS totalIncidents,
        (SELECT cs.name 
         FROM construction_sites cs
         JOIN sessions s ON cs.site_id = s.site_id
         JOIN incidents i ON s.session_id = i.session_id
         WHERE i.incident_time >= NOW() - INTERVAL '24 hours'
         GROUP BY cs.name
         ORDER BY COUNT(i.incident_id) DESC 
         LIMIT 1) AS topIncidentConstructionSite,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS criticalIncidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderateIncidents
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '24 hours'
),
alert_metrics_7_days AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS falseAlarm,
        COUNT(*) AS totalIncidents,
        (SELECT cs.name 
         FROM construction_sites cs
         JOIN sessions s ON cs.site_id = s.site_id
         JOIN incidents i ON s.session_id = i.session_id
         WHERE i.incident_time >= NOW() - INTERVAL '7 days'
         GROUP BY cs.name
         ORDER BY COUNT(i.incident_id) DESC 
         LIMIT 1) AS topIncidentConstructionSite,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS criticalIncidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderateIncidents
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '7 days'
),
alert_metrics_30_days AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS falseAlarm,
        COUNT(*) AS totalIncidents,
        (SELECT cs.name 
         FROM construction_sites cs
         JOIN sessions s ON cs.site_id = s.site_id
         JOIN incidents i ON s.session_id = i.session_id
         WHERE i.incident_time >= NOW() - INTERVAL '30 days'
         GROUP BY cs.name
         ORDER BY COUNT(i.incident_id) DESC 
         LIMIT 1) AS topIncidentConstructionSite,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS criticalIncidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderateIncidents
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '30 days'
),
alert_metrics_12_months AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS falseAlarm,
        COUNT(*) AS totalIncidents,
        (SELECT cs.name 
         FROM construction_sites cs
         JOIN sessions s ON cs.site_id = s.site_id
         JOIN incidents i ON s.session_id = i.session_id
         WHERE i.incident_time >= NOW() - INTERVAL '12 months'
         GROUP BY cs.name
         ORDER BY COUNT(i.incident_id) DESC 
         LIMIT 1) AS topIncidentConstructionSite,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS criticalIncidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderateIncidents
    FROM incidents
    WHERE incident_time >= NOW() - INTERVAL '12 months'
)
SELECT json_build_object(
    'trendsAndBreakdown', json_build_object(
        'trends', json_build_object(
            '24 hours', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_24_hours), '[]'::json),
            '7 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_7_days), '[]'::json),
            '30 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_30_days), '[]'::json),
            '12 months', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends_12_months), '[]'::json)
        ),
        'breakdown', json_build_object(
            '24 hours', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown_24_hours), '[]'::json),
            '7 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown_7_days), '[]'::json),
            '30 days', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown_30_days), '[]'::json),
            '12 months', COALESCE((SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown_12_months), '[]'::json)
        )
    ),
    'alertMetrics', json_build_object(
        '24 hours', (SELECT json_build_object(
            'open', open,
            'resolved', resolved,
            'falseAlarm', falseAlarm,
            'totalIncidents', totalIncidents,
            'topIncidentConstructionSite', topIncidentConstructionSite,
            'criticalIncidents', criticalIncidents,
            'moderateIncidents', moderateIncidents
        ) FROM alert_metrics_24_hours),
        '7 days', (SELECT json_build_object(
            'open', open,
            'resolved', resolved,
            'falseAlarm', falseAlarm,
            'totalIncidents', totalIncidents,
            'topIncidentConstructionSite', topIncidentConstructionSite,
            'criticalIncidents', criticalIncidents,
            'moderateIncidents', moderateIncidents
        ) FROM alert_metrics_7_days),
        '30 days', (SELECT json_build_object(
            'open', open,
            'resolved', resolved,
            'falseAlarm', falseAlarm,
            'totalIncidents', totalIncidents,
            'topIncidentConstructionSite', topIncidentConstructionSite,
            'criticalIncidents', criticalIncidents,
            'moderateIncidents', moderateIncidents
        ) FROM alert_metrics_30_days),
        '12 months', (SELECT json_build_object(
            'open', open,
            'resolved', resolved,
            'falseAlarm', falseAlarm,
            'totalIncidents', totalIncidents,
            'topIncidentConstructionSite', topIncidentConstructionSite,
            'criticalIncidents', criticalIncidents,
            'moderateIncidents', moderateIncidents
        ) FROM alert_metrics_12_months)
    )
) AS result;
`;

module.exports = {
  getAllIncidentTrends,
};
