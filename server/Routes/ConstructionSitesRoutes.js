const { Router } = require('express');
const controller = require('../Controllers/ConstructionSites.js');

const router = Router();

router.get('/construction-sites', controller.getAllConstructionSites);

router.put('/construction-sites/:site_id', controller.updateStatus);

router.post('/construction-sites/:name', controller.addConstructionSite);//default active

router.delete('/construction-sites/:site_id', controller.deleteConstructionSite);

module.exports = router; 
