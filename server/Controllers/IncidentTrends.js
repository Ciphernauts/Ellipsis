const pool = require('../Database/database');
const queries = require('../Queries/IncidentTrendsQueries');

const getAlertMetricsForLast24Hours = (req, res) => {
    pool.query(queries.getAlertMetricsForLast24Hours, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAlertMetricsForLast7Days = (req, res) => {
    pool.query(queries.getAlertMetricsForLast7Days, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAlertMetricsForLast30Days = (req, res) => {
    pool.query(queries.getAlertMetricsForLast30Days, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAlertMetricsForLast12Months = (req, res) => {
    pool.query(queries.getAlertMetricsForLast12Months, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAllTrendsForLast24Hours = (req, res) => {
    pool.query(queries.getAllTrendsForLast24Hours, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAllTrendsForLast7Days = (req, res) => {
    pool.query(queries.getAllTrendsForLast7Days, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAllTrendsForLast30Days = (req, res) => {
    pool.query(queries.getAllTrendsForLast30Days, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getAllTrendsForLast12Months = (req, res) => {
    pool.query(queries.getAllTrendsForLast12Months, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getBreakdownForLast24Hours = (req, res) => {
    pool.query(queries.getBreakdownForLast24Hours, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getBreakdownForLast7Days = (req, res) => {
    pool.query(queries.getBreakdownForLast7Days, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getBreakdownForLast30Days = (req, res) => {
    pool.query(queries.getBreakdownForLast30Days, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getBreakdownForLast12Months = (req, res) => {
    pool.query(queries.getBreakdownForLast12Months, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

module.exports = {
    getAlertMetricsForLast24Hours,
    getAlertMetricsForLast7Days,
    getAlertMetricsForLast30Days,
    getAlertMetricsForLast12Months,
    getAllTrendsForLast24Hours,
    getAllTrendsForLast7Days,
    getAllTrendsForLast30Days,
    getAllTrendsForLast12Months,
    getBreakdownForLast24Hours,
    getBreakdownForLast7Days,
    getBreakdownForLast30Days,
    getBreakdownForLast12Months
};

