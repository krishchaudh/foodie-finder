const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('./authMiddleware');

// Create a reservation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { reservation_time, party_size, restaurant_id } = req.body;
    const userId = req.user.id;
    const result = await pool.query(
      `INSERT INTO reservations (user_id, restaurant_id, reservation_time, party_size)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, restaurant_id, reservation_time, party_size]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Get reservations for the logged-in user
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT r.*, rest.name as restaurant_name
       FROM reservations r
       JOIN restaurants rest ON rest.id = r.restaurant_id
       WHERE r.user_id = $1
       ORDER BY reservation_time DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reservations' });
  }
});

module.exports = router;
