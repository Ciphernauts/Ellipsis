const getAllConstructionSites = `SELECT
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', cs.site_id,
      'name', cs.name,
      'snapshots', cs.snapshots,
      'lastReport', (
        SELECT
          MAX(incident_time)
        FROM incidents AS i
        JOIN sessions AS s
          ON i.session_id = s.session_id
        WHERE
          s.site_id = cs.site_id
      ),
      'isActive', (
        CASE WHEN cs.status = 'Active'
        THEN TRUE
        ELSE FALSE
        END
      ),
      'safetyScore', cs.safetyScore,
      'duration', (
        SELECT
          JSON_BUILD_OBJECT(
            'hours', SUM(EXTRACT(HOUR FROM (end_time - start_time))),
            'minutes', SUM(EXTRACT(MINUTE FROM (end_time - start_time))),
            'seconds', SUM(EXTRACT(SECOND FROM (end_time - start_time)))
          )
        FROM sessions
        WHERE
          site_id = cs.site_id
      ),
      'totalIncidents', (
        SELECT
          COUNT(*)
        FROM incidents AS i
        JOIN sessions AS s
          ON i.session_id = s.session_id
        WHERE
          s.site_id = cs.site_id
      ),
      'criticalIncidents', (
        SELECT
          COUNT(*)
        FROM incidents AS i
        JOIN sessions AS s
          ON i.session_id = s.session_id
        WHERE
          s.site_id = cs.site_id AND i.severity = 'Critical'
      )
    )
  ) AS response_data
FROM construction_sites AS cs;`

const updateStatus = `WITH UpdatedSite AS (
  UPDATE construction_sites
  SET status = CASE WHEN status = 'Active' THEN 'Inactive' ELSE 'Active' END
  WHERE site_id = $1
  RETURNING * -- Return the updated row
)
SELECT
  JSON_BUILD_OBJECT(
    'id', us.site_id,
    'name', us.name,
    'snapshots', us.snapshots,
    'lastReport', (
      SELECT
        MAX(incident_time)
      FROM incidents AS i
      JOIN sessions AS s
        ON i.session_id = s.session_id
      WHERE
        s.site_id = us.site_id
    ),
    'isActive', (
      CASE WHEN us.status = 'Active'
      THEN TRUE
      ELSE FALSE
      END
    ),
    'safetyScore', us.safetyScore,
    'duration', (
      SELECT
        JSON_BUILD_OBJECT(
          'hours', SUM(EXTRACT(HOUR FROM (end_time - start_time))),
          'minutes', SUM(EXTRACT(MINUTE FROM (end_time - start_time))),
          'seconds', SUM(EXTRACT(SECOND FROM (end_time - start_time)))
        )
      FROM sessions
      WHERE
        site_id = us.site_id
    ),
    'totalIncidents', (
      SELECT
        COUNT(*)
      FROM incidents AS i
      JOIN sessions AS s
        ON i.session_id = s.session_id
      WHERE
        s.site_id = us.site_id
    ),
    'criticalIncidents', (
      SELECT
        COUNT(*)
      FROM incidents AS i
      JOIN sessions AS s
        ON i.session_id = s.session_id
      WHERE
        s.site_id = us.site_id AND i.severity = 'Critical'
    )
  ) AS response_data
FROM UpdatedSite AS us;`


const addConstructionSite = `-- Insert the new construction site with the provided name and default values
INSERT INTO construction_sites (name, status, safetyscore, snapshots)
VALUES ($1, 'Active', 0, '{}')  -- $1 is the site name from the request
RETURNING
  JSON_BUILD_OBJECT(
    'id', site_id,
    'name', name,
    'snapshots', snapshots,
    'lastReport', NULL, -- No last report for a new site
    'isActive', TRUE, -- New sites are active by default
    'safetyScore', safetyscore,
    'duration', JSON_BUILD_OBJECT(
      'hours', 0,
      'minutes', 0,
      'seconds', 0
    ), -- No duration for a new site
    'totalIncidents', 0, -- No incidents for a new site
    'criticalIncidents', 0 -- No critical incidents for a new site
  ) AS response_data;`

const deleteConstructionSite = `DELETE FROM construction_sites
WHERE site_id = $1;  -- $1 is the site ID to be deleted`

module.exports = {

    getAllConstructionSites,
    updateStatus,
    addConstructionSite,
    deleteConstructionSite
};
