const { Router } = require("express");
const controller = require("../Controllers/IncidentTrends.js");

const router = Router();

router.get("/incidents/incident-trends", controller.getAllIncidentTrends);
// client/src/pages/IncidentTrends.jsx: lines 14-157

module.exports = router;
