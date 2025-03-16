const pool = require("../Database/database");
const queries = require("../Queries/IncidentTrendsQueries");

const getAllIncidentTrends = (req, res) => {
  pool.query(queries.getAllIncidentTrends, (error, results) => {
    if (error) {
      console.error("Error fetching incident trends:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.rows.length > 0) {
        res.status(200).json(results.rows[0].result);
      } else {
        res.status(404).json({ message: "No data found" });
      }
    }
  });
};

module.exports = {
  getAllIncidentTrends,
};
