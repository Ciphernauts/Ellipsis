const pool = require('../Database/database');
const queries = require('../Queries/TimelineSessionsQueries');

const getAllSessions = async (req, res) => {
    try {
        const response = await pool.query(queries.getAllSessions);
        res.status(200).json(response.rows[0].response_data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSessionById = async (req, res) => {
    try {
        const { session_id } = req.params;
        const response = await pool.query(queries.getSessionById, [session_id]);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSessionById = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { safety_score, progress } = req.body;
        const response = await pool.query(queries.updateSessionById, [safety_score, progress, session_id]);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getAllSessions,
    getSessionById,
    updateSessionById
};