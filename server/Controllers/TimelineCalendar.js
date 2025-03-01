const pool = require('../Database/database');
const queries = require('../Queries/TimelineCalendarQueries');

const getStatsForMonth = (req, res) => {
    const month = parseInt(req.params.month);
    pool.query(queries.getStatsForMonth, [month], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getStatsForDay = (req, res) => {
    const month = parseInt(req.params.month);
    const day = parseInt(req.params.day);
    pool.query(queries.getStatsForDay, [month, day], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

module.exports = {
    getStatsForMonth,
    getStatsForDay
};