const getAllIncidentHistory = `
    SELECT
        i.incident_id AS "id",
        i.session_id,
        i.incident_time AS "time",
        i.severity,
        i.status,
        i.category,
        s.site_id,
        cs.name AS "site",
        s.mode,
        c.name AS "device",
        c.type AS "deviceType",
        ss.image_url AS "snapshot"
    FROM
        incidents i
    JOIN
        sessions s ON i.session_id = s.session_id
    JOIN
        construction_sites cs ON s.site_id = cs.site_id
    JOIN
        cameras c ON s.camera_id = c.camera_id
    LEFT JOIN
        snapshots ss ON i.session_id = ss.session_id
    ORDER BY
        i.incident_time DESC;
`;

//add filters part al;so

module.exports = {
    getAllIncidentHistory,
};