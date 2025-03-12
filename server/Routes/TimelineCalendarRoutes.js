const { Router } = require("express");
const {
  getStatsForMonth,
  getStatsForDay,
} = require("../Controllers/TimelineCalendar.js");

const router = Router();

router.get("/timeline/calendar/month/:month/:year", getStatsForMonth);
router.get("/timeline/calendar/day/:day/:month/:year", getStatsForDay);

module.exports = router;
