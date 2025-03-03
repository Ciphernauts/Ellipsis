const { Pool } = require('pg');

const pool = new Pool ({
    //connectionString: 'postgres://postgres:root@localhost:5432/postgres'
    user:"postgres",
    host:"localhost",
    database:"localhost",
    password:"root",
    port:5432
});

module.exports = pool;