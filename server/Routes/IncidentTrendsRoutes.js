const { Router } = require('express');
const controller = require('../Controllers/IncidentTrends.js');

const router = Router();

router.get('/incidents/incident-trends', controller.getAllIncidentTrends); 

module.exports = router;

