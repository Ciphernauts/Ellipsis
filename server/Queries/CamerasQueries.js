const getAllCameras = 'SELECT * FROM cameras';
const getAvailableDevices = 'SELECT * FROM cameras WHERE online = TRUE AND connected = FALSE';
const connectCamera = 'UPDATE cameras SET connected = TRUE WHERE camera_id = $1';
const pairDevice = 'UPDATE cameras SET connected = TRUE WHERE camera_id = $1';
const deleteCamera = 'DELETE FROM cameras WHERE camera_id = $1';

module.exports = {
    getAllCameras,
    getAvailableDevices,
    connectCamera,
    pairDevice,
    deleteCamera
};