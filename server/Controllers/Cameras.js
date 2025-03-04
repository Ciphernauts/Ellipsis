const pool = require('../Database/database');
const queries = require('../Queries/CamerasQueries');

const getAllCameras = (req, res) => {
    pool.query(queries.getAllCameras, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const connectCamera = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.connectCamera, [id], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send(`Error connecting camera with ID ${id}`);
        }
        res.status(200).send(`Camera with ID ${id} connected.`);
    });
};


const getAvailableDevices = (req, res) => {
    pool.query(queries.getAvailableDevices, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const pairDevice = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.pairDevice, [id], (error) => {
        if (error) throw error;
        res.status(200).send(`Device with ID ${id} paired.`);
    });
};

const deleteCamera = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.deleteCamera, [id], (error) => {
        if (error) throw error;
        res.status(200).send(`Camera with ID ${id} deleted.`);
    });
};

module.exports = {
    getAllCameras,
    connectCamera,
    getAvailableDevices,
    pairDevice,
    deleteCamera
};
