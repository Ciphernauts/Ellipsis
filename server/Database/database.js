const { Pool } = require('pg');

const pool = new Pool ({
    //connectionString: 'postgres://postgres:root@localhost:5432/postgres'
    user:"postgres",
    host:"localhost",
    database:"postgres",
    password:"root",
    port:5432
});

module.exports = pool;