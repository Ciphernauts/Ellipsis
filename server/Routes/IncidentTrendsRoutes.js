const { Router } = require('express');
const controller = require('../Controllers/IncidentTrends.js');

const router = Router();

router.get('/incidents/trends-trends', controller.getAlertMetricsForLast24Hours);
router.get('/incidents/trends-trends/last7days', controller.getAlertMetricsForLast7Days);
router.get('/incidents/trends-trends/last30days', controller.getAlertMetricsForLast30Days);
router.get('/incidents/trends-trends/last12months', controller.getAlertMetricsForLast12Months);

router.get('/incidents/trends-trends/trends', controller.getAllTrendsForLast24Hours);
router.get('/incidents/trends-trends/trends/last7days', controller.getAllTrendsForLast7Days);
router.get('/incidents/trends-trends/trends/last30days', controller.getAllTrendsForLast30Days); 
router.get('/incidents/trends-trends/trends/last12months', controller.getAllTrendsForLast12Months);

router.get('/incidents/trends-trends/breakdown',controller.getBreakdownForLast24Hours);
router.get('/incidents/trends-trends/breakdown/last7days', controller.getBreakdownForLast7Days);
router.get('/incidents/trends-trends/breakdown/last30days', controller.getBreakdownForLast30Days);
router.get('/incidents/trends-trends/breakdown/last12months', controller.getBreakdownForLast12Months);

module.exports = router;

