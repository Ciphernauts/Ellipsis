const pool = require("../Database/database");
const queries = require("../Queries/TimelineCalendarQueries");

const getStatsForMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const response = await pool.query(queries.getStatsForMonth, [month, year]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStatsForDay = async (req, res) => {
  try {
    const { day, month, year } = req.params;
    const response = await pool.query(queries.getStatsForDay, [
      day,
      month,
      year,
    ]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStatsForMonth,
  getStatsForDay,
};
