const { Router } = require('express');
const controller = require('../Controllers/IncidentTrends.js');

const router = Router();

router.get('/incidents/trends-trends', controller.getAllIncidentTrends);

module.exports = router;

