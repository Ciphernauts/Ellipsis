const { Router } = require('express');
const controller = require('../Controllers/TimelineSessions.js');

const router = Router();

router.get('/timeline/sessions', controller.getAllSessions);
// client/src/pages/TimelineSessions.jsx: lines 19-184

router.get('/timeline/sessions/:session_id', controller.getSessionById);
// client/src/pages/TimelineSessions.jsx: lines 191-258

router.put('/timeline/sessions/:session_id', controller.updateSessionById);
// client/src/components/layout/infoPanes/SessionsInfoPane.jsx: lines 120-143

module.exports = router; 
