const { Router } = require('express');
const controller = require('../Controllers/IncidentTrends.js');

const router = Router();

// router.get('/incidents/trends-trends', controller.getAllIncidentTrends);
router.get('/incidents/incident-trends', controller.getAllIncidentTrends); //updated what i think is a typo?

module.exports = router;

