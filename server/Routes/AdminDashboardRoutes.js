const { Router } = require("express");
const controller = require("../Controllers/AdminDashboard.js");

const router = Router();

router.get("/admin-dashboard", controller.getAdminDashboardData);

module.exports = router;
