const pool = require('../Database/database');
const queries = require('../Queries/IncidentHistoryQueries');

const getAllIncidentHistory = async (req, res) => {
    try {
        const response = await pool.query(queries.getAllIncidentHistory);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateIncidentStatus = async (req, res) => {
    const { incident_id, status } = req.params;

    try {
        const response = await pool.query(queries.updateIncidentStatus, [incident_id, status]);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    getAllIncidentHistory,
    updateIncidentStatus,
};


