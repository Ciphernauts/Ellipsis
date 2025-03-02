const { Router } = require('express');
const controller = require('../Controllers/TimelineSessions.js');

const router = Router();

router.get('/timeline/sessions', controller.getAllSessions);
router.get('/timeline/sessions/:session_id', controller.getSessionById);

router.put('/timeline/sessions/:session_id', controller.updateSessionById);
//line 109 to 118, src, components, layount, infopanes, sessioninfopane

module.exports = router; 
