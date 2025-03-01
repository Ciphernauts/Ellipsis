const { Router } = require('express');
const controller = require('../Controllers/TimelineCalendar.js');

const router = Router();

router.get('timeline/calendar/:month', controller.getStatsForMonth);

module.exports = router;