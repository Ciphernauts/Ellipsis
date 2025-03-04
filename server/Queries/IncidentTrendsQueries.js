const getAllIncidentTrends = `
WITH trends AS (
    SELECT
        '24 hours' AS timeframe,
        to_char(date_trunc('hour', incident_time), 'HH:MI AM') AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '24 hours'
    GROUP BY
        date_trunc('hour', incident_time)
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        to_char(date_trunc('day', incident_time), 'Day') AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '7 days'
    GROUP BY
        date_trunc('day', incident_time)
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        to_char(date_trunc('day', incident_time), 'DD Mon') AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '30 days'
    GROUP BY
        date_trunc('day', incident_time)
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        to_char(date_trunc('month', incident_time), 'Mon') AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '12 months'
    GROUP BY
        date_trunc('month', incident_time)
),
breakdown AS (
    SELECT
        '24 hours' AS timeframe,
        category AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '24 hours'
    GROUP BY
        category
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        category AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '7 days'
    GROUP BY
        category
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        category AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '30 days'
    GROUP BY
        category
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        category AS name,
        COUNT(*) AS value
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '12 months'
    GROUP BY
        category
),
metrics AS (
    SELECT
        '24 hours' AS timeframe,
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS false_alarm,
        COUNT(*) AS total_incidents,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS critical_incidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderate_incidents,
        (SELECT site FROM construction_sites WHERE site_id = (SELECT site_id FROM incidents WHERE incident_time >= NOW() - INTERVAL '24 hours' GROUP BY site_id ORDER BY COUNT(*) DESC LIMIT 1)) AS top_incident_construction_site
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '24 hours'
    UNION ALL
    SELECT
        '7 days' AS timeframe,
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS false_alarm,
        COUNT(*) AS total_incidents,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS critical_incidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderate_incidents,
        (SELECT site FROM construction_sites WHERE site_id = (SELECT site_id FROM incidents WHERE incident_time >= NOW() - INTERVAL '7 days' GROUP BY site_id ORDER BY COUNT(*) DESC LIMIT 1)) AS top_incident_construction_site
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '7 days'
    UNION ALL
    SELECT
        '30 days' AS timeframe,
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS false_alarm,
        COUNT(*) AS total_incidents,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS critical_incidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderate_incidents,
        (SELECT site FROM construction_sites WHERE site_id = (SELECT site_id FROM incidents WHERE incident_time >= NOW() - INTERVAL '30 days' GROUP BY site_id ORDER BY COUNT(*) DESC LIMIT 1)) AS top_incident_construction_site
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '30 days'
    UNION ALL
    SELECT
        '12 months' AS timeframe,
        COUNT(*) FILTER (WHERE status = 'Open') AS open,
        COUNT(*) FILTER (WHERE status = 'Resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'False Alarm') AS false_alarm,
        COUNT(*) AS total_incidents,
        COUNT(*) FILTER (WHERE severity = 'Critical') AS critical_incidents,
        COUNT(*) FILTER (WHERE severity = 'Moderate') AS moderate_incidents,
        (SELECT site FROM construction_sites WHERE site_id = (SELECT site_id FROM incidents WHERE incident_time >= NOW() - INTERVAL '12 months' GROUP BY site_id ORDER BY COUNT(*) DESC LIMIT 1)) AS top_incident_construction_site
    FROM
        incidents
    WHERE
        incident_time >= NOW() - INTERVAL '12 months'
)
SELECT
    json_build_object(
        'trendsAndBreakdown', json_build_object(
            'trends', json_build_object(
                '24 hours', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends WHERE timeframe = '24 hours'),
                '7 days', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends WHERE timeframe = '7 days'),
                '30 days', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends WHERE timeframe = '30 days'),
                '12 months', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM trends WHERE timeframe = '12 months')
            ),
            'breakdown', json_build_object(
                '24 hours', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown WHERE timeframe = '24 hours'),
                '7 days', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown WHERE timeframe = '7 days'),
                '30 days', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown WHERE timeframe = '30 days'),
                '12 months', (SELECT json_agg(json_build_object('name', name, 'value', value)) FROM breakdown WHERE timeframe = '12 months')
            )
        ),
        'alertMetrics', json_build_object(
            '24 hours', (SELECT json_build_object(
                'open', open,
                'resolved', resolved,
                'falseAlarm', false_alarm,
                'totalIncidents', total_incidents,
                'topIncidentConstructionSite', top_incident_construction_site,
                'criticalIncidents', critical_incidents,
                'moderateIncidents', moderate_incidents
            ) FROM metrics WHERE timeframe = '24 hours'),
            '7 days', (SELECT json_build_object(
                'open', open,
                'resolved', resolved,
                'falseAlarm', false_alarm,
                'totalIncidents', total_incidents,
                'topIncidentConstructionSite', top_incident_construction_site,
                'criticalIncidents', critical_incidents,
                'moderateIncidents', moderate_incidents
            ) FROM metrics WHERE timeframe = '7 days'),
            '30 days', (SELECT json_build_object(
                'open', open,
                'resolved', resolved,
                'falseAlarm', false_alarm,
                'totalIncidents', total_incidents,
                'topIncidentConstructionSite', top_incident_construction_site,
                'criticalIncidents', critical_incidents,
                'moderateIncidents', moderate_incidents
            ) FROM metrics WHERE timeframe = '30 days'),
            '12 months', (SELECT json_build_object(
                'open', open,
                'resolved', resolved,
                'falseAlarm', false_alarm,
                'totalIncidents', total_incidents,
                'topIncidentConstructionSite', top_incident_construction_site,
                'criticalIncidents', critical_incidents,
                'moderateIncidents', moderate_incidents
            ) FROM metrics WHERE timeframe = '12 months')
        )
    ) AS incident_trends_data;
`;

module.exports = {
    getAllIncidentTrends,
};