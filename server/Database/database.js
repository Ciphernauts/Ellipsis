/*
const { Pool } = require('pg');

const host= process.env.PG_HOST;
const port= process.env.PG_PORT;

const pool = new Pool ({
    //connectionString: 'postgres://postgres:root@localhost:5432/postgres'
    user:"postgres",
    host:"localhost",
    database:"postgres",
    password:"root",
    port:5432
});

module.exports = pool;

*/

const { Pool } = require("pg");

const pool = new Pool({
  //connectionString: 'postgresql://ellipsis_user:ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak@dpg-cvaugf2n91rc739bco30-a/ellipsis'
  user: "ellipsis_user",
  host: "dpg-cvaugf2n91rc739bco30-a",
  database: "ellipsis",
  password: "ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak",
  port: 5432,
});

module.exports = pool;
