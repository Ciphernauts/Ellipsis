const { Router } = require('express');
const controller = require('../Controllers/TimelineSessions.js');

const router = Router();

router.get('/timeline/sessions', controller.getAllSessions);
router.get('/timeline/sessions/:session_id', controller.getSessionById);

module.exports = router; 
