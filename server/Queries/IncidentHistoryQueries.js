const getAllIncidentHistory = `SELECT
JSON_BUILD_OBJECT(
  'incidents', (
    SELECT
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', i.incident_id,
          'category', i.category,
          'snapshot', (
            SELECT
              image_url
            FROM snapshots
            WHERE
              session_id = i.session_id
            ORDER BY
              "timestamp" DESC
            LIMIT 1
          ),
          'site', cs.name,
          'time', i.incident_time,
          'status', i.status,
          'isCritical', (
            CASE WHEN i.severity = 'Critical'
            THEN TRUE
            ELSE FALSE
            END
          ),
          'sessionId', i.session_id,
          'mode', s.mode,
          'device', JSON_BUILD_OBJECT(
            'name', c.name,
            'type', c.type
          )
        )
      )
    FROM incidents AS i
    JOIN sessions AS s
      ON i.session_id = s.session_id
    JOIN construction_sites AS cs
      ON s.site_id = cs.site_id
    JOIN cameras AS c
      ON s.camera_id = c.camera_id
  ),
  'constructionSites', (
    SELECT
      JSON_AGG(name)
    FROM construction_sites
  )
) AS response_data;`


const updateIncidentStatus = `WITH UpdatedIncident AS (
    UPDATE incidents
    SET status = $2  -- $2 is the new status from the request
    WHERE incident_id = $1  -- $1 is the incident ID from the request
    RETURNING status  -- Return the updated status
)
SELECT JSON_BUILD_OBJECT('status', status)  -- Build a JSON object with the status
FROM UpdatedIncident;`

module.exports = {
    getAllIncidentHistory,
    updateIncidentStatus
};