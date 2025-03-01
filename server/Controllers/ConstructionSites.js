const pool = require('../Database/database');
const queries = require('../Queries/ConstructionSitesQueries');

const getAllConstructionSites = (req, res) => {
    pool.query(queries.getAllConstructionSites, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getConstructionSiteById = (req, res
    ) => {
    const id = parseInt(req.params.site_id);
    pool.query(queries.getConstructionSiteById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const updateStatus = (req, res) => {
    const id = parseInt(req.params.site_id);
    const { status } = req.body;

    pool.query(queries.updateStatus, [status, id], (error, results) => {
        if (error) throw error;
        res.status(200).send(`Construction Site modified with ID: ${id}`);
    });
}

const addConstructionSite = (req, res) => {
    const { name } = req.params;

    pool.query(queries.addConstructionSite, [name], (error, results) => {
        if (error) throw error;
        res.status(201).send(`Construction Site added with ID: ${results.insertId}`);
    });
}

const deleteConstructionSite = (req, res) => {
    const id = parseInt(req.params.site_id);

    pool.query(queries.deleteConstructionSite, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send(`Construction Site deleted with ID: ${id}`);
    });
}

module.exports = {
    getAllConstructionSites,
    getConstructionSiteById,
    updateStatus,
    addConstructionSite,
    deleteConstructionSite
};