const { Pool } = require('pg');

const host= process.env.PG_HOST;
const port= process.env.PG_PORT;

const pool = new Pool ({
    //connectionString: 'postgres://postgres:root@localhost:5432/postgres'
    user:"postgres",
    host:"localhost",
    database:"Ellipsis",
    password:"Post",
    port:5433
});

module.exports = pool;