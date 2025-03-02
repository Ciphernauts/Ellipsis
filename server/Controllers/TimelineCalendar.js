const pool = require('../Database/database');
const queries = require('../Queries/TimelineCalendarQueries');

const getStatsForMonthAndDays = async (req, res) => {
    const { month, year } = req.params;
    const monthStats = await pool.query(queries.getStatsForMonth, [month, year]);
    res.json(monthStats.rows);
}

module.exports = {
    getStatsForMonthAndDays,
};