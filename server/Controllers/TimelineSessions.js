const pool = require('../Database/database');
const queries = require('../Queries/TimelineSessionsQueries');

const getAllSessions = (req, res) => {
    pool.query(queries.getAllSessions, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getSessionById = (req, res) => {
    const id = parseInt(req.params.session_id);
    pool.query(queries.getSessionById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

module.exports = {
    getAllSessions,
    getSessionById
};