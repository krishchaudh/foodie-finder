const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('./authMiddleware');

// Create a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurant_id, rating, comment } = req.body;
    const userId = req.user.id;

    await pool.query(
      `INSERT INTO reviews (user_id, restaurant_id, rating, comment)
       VALUES ($1, $2, $3, $4)`,
      [userId, restaurant_id, rating, comment]
    );

    // Update average rating in the restaurants table
    const avgResult = await pool.query(
      `SELECT AVG(rating) as avg_rating
       FROM reviews
       WHERE restaurant_id = $1`,
      [restaurant_id]
    );
    const avg = avgResult.rows[0].avg_rating;
    await pool.query(
      `UPDATE restaurants
       SET rating = $1
       WHERE id = $2`,
      [avg, restaurant_id]
    );

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Get reviews for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await pool.query(
      `SELECT r.*, u.username
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.restaurant_id = $1
       ORDER BY created_at DESC`,
      [restaurantId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
