const pool = require('../Database/database');
const queries = require('../Queries/IncidentHistoryQueries');

const getAllIncidentHistory = (req, res) => {
    pool.query(queries.getAllIncidentHistory, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

// const getIncidentHistoryById = (req, res) => {
//     const id = parseInt(req.params.incident_id);
//     pool.query(queries.getIncidentHistoryById, [id], (error, results) => {
//         if (error) throw error;
//         res.status(200).json(results.rows);
//     });
// }

// const updateIncidentStatus = (req, res) => {
//     const id = parseInt(req.params.incident_id);
//     const status = req.params.status;
//     pool.query(queries.updateIncidentStatus, [status, id], (error, results) => {
//         if (error) throw error;
//         res.status(200).send(`Incident modified with ID: ${id}`);
//     });
// }

// const getIncidentHistoryBySiteId = (req, res) => {
//     const id = parseInt(req.params.site_id);
//     pool.query(queries.getIncidentHistoryBySiteId, [id], (error, results) => {
//         if (error) throw error;
//         res.status(200).json(results.rows);
//     });
// }

// const getIncidentHistoryByDate = (req, res) => {
//     const date = req.params.date;
//     pool.query(queries.getIncidentHistoryByDate, [date], (error, results) => {
//         if (error) throw error;
//         res.status(200).json(results.rows);
//     });
// }

// const getIncidentHistoryByCategory = (req, res) => {
//     const category = req.params.category;
//     pool.query(queries.getIncidentHistoryByCategory, [category], (error, results) => {
//         if (error) throw error;
//         res.status(200).json(results.rows);
//     });
// }

// const getIncidentHistoryBySeverity = (req, res) => {
//     const severity = req.params.severity;
//     pool.query(queries.getIncidentHistoryBySeverity, [severity], (error, results) => {
//         if (error) throw error;
//         res.status(200).json(results.rows);
//     });
// }

module.exports = {
    getAllIncidentHistory,
    // getIncidentHistoryById,
    // updateIncidentStatus,
    // getIncidentHistoryBySiteId,
    // getIncidentHistoryByDate,
    // getIncidentHistoryByCategory,
    // getIncidentHistoryBySeverity
};

