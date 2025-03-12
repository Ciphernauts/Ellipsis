const pool = require("../Database/database");
const queries = require("../Queries/SafetyTrendsQueries");

const getSafetyTrends = (req, res) => {
  const { category } = req.params;

  pool.query(queries.getSafetyTrends, [category], (error, results) => {
    if (error) {
      console.error("Error fetching safety trends:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows[0].compliance_data);
    }
  });
};

const getOverallSafetyTrends = (req, res) => {
  pool.query(queries.getOverallSafetyTrends, (error, results) => {
    if (error) {
      console.error("Error fetching overall safety trends:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows[0].compliance_data);
    }
  });
};

module.exports = {
  getSafetyTrends,
  getOverallSafetyTrends,
};
