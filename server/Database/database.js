const { Pool } = require('pg');

const pool = new Pool ({
    //connectionString: 'postgres://postgres:root@localhost:5432/postgres'
    user:"postgres",
    host:"localhost",
    database:"Ellipsis",
    password:"Post",
    port:5433
});

module.exports = pool;