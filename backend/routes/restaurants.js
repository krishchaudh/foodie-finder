const express = require('express');
const router = express.Router();
const pool = require('../db');
const fetchRestaurantsFromYelp = require('../utils/fetchRestaurants');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine } = req.query;

    // First, attempt to fetch restaurants from Yelp
    const yelpRestaurants = await fetchRestaurantsFromYelp('Dallas', cuisine);

    // Combine Yelp results with local database results (if needed)
    const dbRestaurants = await pool.query(
      'SELECT * FROM restaurants WHERE cuisine ILIKE $1',
      [`%${cuisine || ''}%`]
    );

    res.json([...dbRestaurants.rows, ...yelpRestaurants]);
  } catch (error) {
    console.error('Error in /restaurants:', error.message);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get restaurant' });
  }
});

// Create new restaurant (admin-only example)
router.post('/', async (req, res) => {
  try {
    const { name, cuisine, address, city } = req.body;
    const result = await pool.query(
      `INSERT INTO restaurants (name, cuisine, address, city)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, cuisine, address, city]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
});

module.exports = router;
