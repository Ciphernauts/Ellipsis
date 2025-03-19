// dblistener.js
const { Client } = require('pg');

const setupDbListener = (io) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  client.connect();
  client.query('LISTEN new_incident');

  client.on('notification', (msg) => {
    const payload = JSON.parse(msg.payload);
    console.log(`New incident added: ${JSON.stringify(payload)}`);
    io.emit('newIncident', { message: JSON.stringify(payload) });
  });

  client.on('error', (err) => {
    console.error('Error in PostgreSQL client', err);
  });
};

module.exports = setupDbListener;
