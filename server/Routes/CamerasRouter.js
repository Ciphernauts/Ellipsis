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
const pool = require('../Database/database'); // Ensure this is correctly set up to connect to PostgreSQL

// Fetch all cameras
router.get('/cameras', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cameras');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch available devices (online but not connected)
router.get('/available-devices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cameras WHERE online = true AND connected = false');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Connect a camera
router.post('/connect-camera/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('UPDATE cameras SET connected = true WHERE camera_id = $1 RETURNING *', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Pair a device (same as connecting it)
router.post('/pair-device/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('UPDATE cameras SET connected = true WHERE camera_id = $1 RETURNING *', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a camera
router.delete('/delete-camera/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM cameras WHERE camera_id = $1', [id]);
        res.json({ message: 'Camera deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
