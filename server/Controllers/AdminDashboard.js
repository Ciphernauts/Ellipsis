const pool = require("../Database/database");
const queries = require("../Queries/AdminDashboardQueries");

const getAdminDashboardData = (req, res) => {
  pool.query(queries.getAdminDashboardData, (error, results) => {
    if (error) {
      console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.rows.length > 0) {
        res.status(200).json(results.rows[0].json_build_object);
      } else {
        res.status(404).json({ message: "No data found" });
      }
    }
  });
};

module.exports = {
  getAdminDashboardData,
};
