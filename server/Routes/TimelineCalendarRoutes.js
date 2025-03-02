const { Router } = require('express');
const controller = require('../Controllers/TimelineCalendar.js');

const router = Router();

router.get('timeline/calendar/:month/:year', controller.getStatsForMonthAndDays); // changed this to include year

module.exports = router;