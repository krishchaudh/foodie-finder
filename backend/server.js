// foodie-finder/backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db.js');
const { createTables } = require('./models');
const authRoutes = require('./routes/auth.js');
const restaurantRoutes = require('./routes/restaurants.js');
const reservationRoutes = require('./routes/reservations.js');
const reviewRoutes = require('./routes/reviews.js');

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);
app.use(bodyParser.json());

// Create tables on startup
createTables()
  .then(() => console.log('Tables ensured'))
  .catch((err) => console.error('Error creating tables:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5001; // Changed port to 5001
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
