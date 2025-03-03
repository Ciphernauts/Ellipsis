const { Router } = require('express');
const controller = require('../Controllers/IncidentHistory.js');
const { route } = require('./ConstructionSitesRoutes.js');

const router = Router();

router.get('incidents/incident-history', controller.getAllIncidentHistory);
// client/src/pages/IncidentHistory.jsx: lines 39-264

router.put('incidents/incident-history/:incident_id/:status', controller.updateIncidentStatus);
// client/src/components/layout/infoPanes/IncidentsInfoPane.jsx: lines 18-39

module.exports = router;




