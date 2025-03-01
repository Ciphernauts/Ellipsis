const { Router } = require('express');
const controller = require('../Controllers/TimelineCalendar.js');

const router = Router();

router.get('/:month/:day', controller.getStatsForDay);
router.get('/:month', controller.getStatsForMonth);

module.exports = router;