const { Router } = require("express");
const controller = require("../Controllers/SafetyTrends.js");

const router = Router();

router.get("/safety-trends/:category", controller.getSafetyTrends);
router.get("/safety-trends/", controller.getOverallSafetyTrends);

module.exports = router;
