// foodie-finder/backend/config.js
require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'example',
    database: process.env.DB_NAME || 'foodiefinder'
  },
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
};
