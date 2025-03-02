// I GENERATED THESE BASED ON THE ENDPOINTS I USED IN THE FRONTEND
// YOU COULD CHANGE IT TO MAKE IT MORE CONSISTENT WITH THE OTHER ROUTES IDK

const { Router } = require('express');
const controller = require('../Controllers/Cameras.js'); // You'll need to create this controller

const router = Router();

// Fetch all paired cameras
router.get('/cameras', controller.getAllCameras);

// Fetch available devices for pairing
router.get('/available-devices', controller.getAvailableDevices);

// Connect a camera
router.post('/connect-camera/:camera_id', controller.connectCamera);

// Pair an available device
router.post('/pair-device/:device_id', controller.pairDevice);

// Delete a camera
router.delete('/delete-camera/:camera_id', controller.deleteCamera);

module.exports = router;