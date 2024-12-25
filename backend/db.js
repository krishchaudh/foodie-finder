// foodie-finder/backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost', // Or '127.0.0.1'
  user: 'postgres',
  password: 'password', // Your database password
  database: 'foodiefinder', // Your database name
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
