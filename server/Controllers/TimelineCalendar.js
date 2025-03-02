const pool = require('../Database/database');
const queries = require('../Queries/TimelineCalendarQueries');

const getStatsForMonthAndDays = async (req, res) => {
    const { month, year } = req.params;
    try {
        const monthStats = await pool.query(queries.getStatsForMonthAndDays, [month, year]);
        res.json(monthStats.rows[0].calendar_data);
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getStatsForMonthAndDays,
};