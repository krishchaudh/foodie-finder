// foodie-finder/backend/models/createTables.js

const pool = require('../db');

// This script will create tables if they do not exist already


const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cuisine VARCHAR(50),
      address TEXT,
      city VARCHAR(50),
      rating REAL DEFAULT 0
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      restaurant_id INT REFERENCES restaurants(id),
      reservation_time TIMESTAMP,
      party_size INT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      restaurant_id INT REFERENCES restaurants(id),
      rating INT CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ml_recommendations (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      restaurant_id INT REFERENCES restaurants(id),
      score REAL
    );
  `);
};

module.exports = createTables;
