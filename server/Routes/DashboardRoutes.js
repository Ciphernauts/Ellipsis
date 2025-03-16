const { Router } = require("express");
const controller = require("../Controllers/Dashboard.js");

const router = Router();

router.get("/dashboard", controller.getDashboardData);

module.exports = router;
