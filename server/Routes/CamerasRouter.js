/*
// I GENERATED THESE BASED ON THE ENDPOINTS I USED IN THE FRONTEND
// YOU COULD CHANGE IT TO MAKE IT MORE CONSISTENT WITH THE OTHER ROUTES IDK

const { Router } = require('express');
const controller = require('../Controllers/Cameras.js'); // You'll need to create this controller

const router = Router();

// Fetch all paired cameras
router.get('/cameras', controller.getAllCameras);
// client/src/pages/Cameras.jsx: lines 37-133

// Fetch available devices for pairing
router.get('/available-devices', controller.getAvailableDevices);
// client/src/pages/Cameras.jsx: lines 141-177

// Connect a camera
router.post('/connect-camera/:camera_id', controller.connectCamera);
// client/src/pages/Cameras.jsx: lines 180-191

// Pair an available device
router.post('/pair-device/:device_id', controller.pairDevice);
// client/src/pages/Cameras.jsx: lines 194-208

// Delete a camera
router.delete('/delete-camera/:camera_id', controller.deleteCamera);
// client/src/pages/Cameras.jsx: lines 121-128

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const camerasController = require('../Controllers/Cameras');

router.get('/cameras', camerasController.getAllCameras);
router.get('/available-devices', camerasController.getAvailableDevices);
router.post('/connect-camera/:id', camerasController.connectCamera);
router.post('/pair-device/:id', camerasController.pairDevice);
router.delete('/delete-camera/:id', camerasController.deleteCamera);

module.exports = router;
