const pool = require('../Database/database');
const queries = require('../Queries/TimelineCalendarQueries');

const getStatsForMonthAndDays = async (req, res) => {
    try {
        const { month, days } = req.params;
        const response = await pool.query(queries.getStatsForMonthAndDays, [month, days]);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getStatsForMonthAndDays,
};