const getAllCameras = 'SELECT * FROM cameras';
const getAvailableDevices = 'SELECT * FROM cameras WHERE online = true AND connected = false';
const connectCamera = 'UPDATE cameras SET connected = true WHERE id = $1';
const pairDevice = 'UPDATE cameras SET connected = true WHERE id = $1';
const deleteCamera = 'DELETE FROM cameras WHERE id = $1';

module.exports = {
    getAllCameras,
    getAvailableDevices,
    connectCamera,
    pairDevice,
    deleteCamera
};