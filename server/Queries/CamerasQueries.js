const getAllCameras = 'SELECT * FROM cameras';
const getPairedCameras = 'SELECT * FROM cameras WHERE paired = TRUE';
const getAvailableDevices = 'SELECT * FROM cameras WHERE online = TRUE AND paired = FALSE';
const connectCamera = 'UPDATE cameras SET connected = TRUE WHERE camera_id = $1';
const pairDevice = 'UPDATE cameras SET paired = TRUE WHERE camera_id = $1';
const deleteCamera = 'DELETE FROM cameras WHERE camera_id = $1';

module.exports = {
    getAllCameras,
    getAvailableDevices,
    connectCamera,
    pairDevice,
    deleteCamera,
    getPairedCameras
};