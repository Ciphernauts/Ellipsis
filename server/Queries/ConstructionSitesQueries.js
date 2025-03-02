const getAllConstructionSites = `
    SELECT
        site_id AS "id",
        name,
        status,
        safetyScore AS "safetyscore",
        snapshots,
        last_report AS "lastReport",
        is_active AS "isActive",
        duration,
        total_incidents AS "totalIncidents",
        critical_incidents AS "criticalIncidents"
    FROM
        construction_sites;
`;


// const getConstructionSiteById =
// const updateStatus =
// const addConstructionSite =
// const deleteConstructionSite =

module.exports = {
    getAllConstructionSites,
    getConstructionSiteById,
    updateStatus,
    addConstructionSite,
    deleteConstructionSite
};
