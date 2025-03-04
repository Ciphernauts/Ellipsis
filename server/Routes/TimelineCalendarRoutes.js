const { Router } = require('express');
const controller = require('../Controllers/TimelineCalendar.js');

const router = Router();

router.get('/timeline/calendar/:month/:year', controller.getStatsForMonthAndDays); // month here is from 1-12, not 0-11
// client/src/pages/TimelineCalendar.jsx: lines 159-1150

module.exports = router;