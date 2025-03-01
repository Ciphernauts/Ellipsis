const { Router } = require('express');
const controller = require('../Controllers/TimelineCalendar.js');

const router = Router();

router.get('/:month', controller.getStatsForMonth);
router.get('/:month/:day', controller.getStatsForDay);

module.exports = router;