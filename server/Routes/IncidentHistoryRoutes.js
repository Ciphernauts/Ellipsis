const { Router } = require('express');
const controller = require('../Controllers/IncidentHistory.js');
const { route } = require('./ConstructionSitesRoutes.js');

const router = Router();

router.get('incidents/incident-history', controller.getAllIncidentHistory);

router.put('incidents/incident-history/:incident_id/:status', controller.updateIncidentStatus);

module.exports = router;




