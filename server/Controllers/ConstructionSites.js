const pool = require('../Database/database');
const queries = require('../Queries/ConstructionSitesQueries');

const getAllConstructionSites = async (req, res) => {
  try {
    const response = await pool.query(queries.getAllConstructionSites);
    res.status(200).json(response.rows[0].response_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateStatus = async (req, res) => {
  const { site_id } = req.params;
  const { isActive } = req.body;

  try {
    const response = await pool.query(queries.updateStatus, [site_id, isActive]);
    res.status(200).json(response.rows[0].response_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addConstructionSite = async (req, res) => {
  const { name } = req.params;

  try {
    const response = await pool.query(queries.addConstructionSite, [name]);
    res.status(201).json(response.rows[0].response_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteConstructionSite = async (req, res) => {
  const { site_id } = req.params;

  try {
    await pool.query(queries.deleteConstructionSite, [site_id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    getAllConstructionSites,
    updateStatus,
    addConstructionSite,
    deleteConstructionSite

};