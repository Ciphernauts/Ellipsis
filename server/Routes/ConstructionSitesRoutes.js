const { Router } = require('express');
const controller = require('../Controllers/ConstructionSites.js');

const router = Router();

router.get('/construction-sites', controller.getAllConstructionSites);
// client/src/pages/CsnstructionSites.jsx: lines 25-133

router.put('/construction-sites/:site_id', controller.updateStatus);
// client/src/components/layout/infoPanes/ConstructionSitesInfoPane.jsx: lines 17-45

router.post('/construction-sites/:name', controller.addConstructionSite);//default active
// client/src/pages/CsnstructionSites.jsx: lines 162-187

router.delete('/construction-sites/:site_id', controller.deleteConstructionSite);
// client/src/pages/CsnstructionSites.jsx: lines 190-197

module.exports = router; 
