const getAllIncidentHistory = `
WITH incident_data AS (
    SELECT
        i.incident_id,
        i.category,
        i.incident_time,
        i.status,
        i.severity,
        i.session_id,
        s.mode,
        cs.name AS site_name,
        c.name AS camera_name,
        c.type AS camera_type,
        (
            SELECT
                image_url
            FROM snapshots
            WHERE session_id = i.session_id
            ORDER BY
              RANDOM()
            LIMIT 1
        ) AS snapshot
    FROM incidents AS i
    LEFT JOIN sessions AS s ON i.session_id = s.session_id
    LEFT JOIN construction_sites AS cs ON s.site_id = cs.site_id
    LEFT JOIN cameras AS c ON s.camera_id = c.camera_id
	order by i.incident_time desc
)
SELECT
    JSON_BUILD_OBJECT(
        'incidents', (
            SELECT
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', incident_id,
                        'category', category,
                        'snapshot', snapshot,
                        'site', site_name,
                        'time', incident_time,
                        'status', status,
                        'isCritical', (
                            CASE WHEN severity = 'Critical' THEN TRUE ELSE FALSE END
                        ),
                        'sessionId', session_id,
                        'mode', mode,
                        'device', JSON_BUILD_OBJECT(
                            'name', camera_name,
                            'type', camera_type
                        )
                    )
                )
            FROM incident_data
        ),
        'constructionSites', (
            SELECT
                JSON_AGG(name)
            FROM construction_sites
        )
    ) AS response_data;
 `;

const updateIncidentStatus = `WITH UpdatedIncident AS (
    UPDATE incidents
    SET status = $2  -- $2 is the new status from the request
    WHERE incident_id = $1  -- $1 is the incident ID from the request
    RETURNING status  -- Return the updated status
)
SELECT JSON_BUILD_OBJECT('status', status)  -- Build a JSON object with the status
FROM UpdatedIncident;`;

module.exports = {
  getAllIncidentHistory,
  updateIncidentStatus,
};
