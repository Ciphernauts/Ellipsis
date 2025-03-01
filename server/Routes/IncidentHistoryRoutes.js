const { Router } = require('express');
const controller = require('../Controllers/IncidentHistory.js');
const { route } = require('./ConstructionSitesRoutes.js');

const router = Router();

router.get('incidents/incident-history', controller.getAllIncidentHistory);
router.get('incidents/incident-history/:incident_id', controller.getIncidentHistoryById);

router.put('incidents/incident-history/:incident_id/:status', controller.updateIncidentStatus);

router.get('incidents/incident-history/:site_id', controller.getIncidentHistoryBySiteId);
router.get('incidents/incident-history/:date', controller.getIncidentHistoryByDate);
router.get('incidents/incident-history/:category', controller.getIncidentHistoryByCategory);
router.get('incidents/incident-history/:severity', controller.getIncidentHistoryBySeverity);

module.exports = router;




