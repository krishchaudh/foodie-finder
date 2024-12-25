// foodie-finder/backend/seed.js
const pool = require('./db.js');
const { createTables } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  await createTables();

  // Clear existing data
  await pool.query('DELETE FROM reviews');
  await pool.query('DELETE FROM reservations');
  await pool.query('DELETE FROM restaurants');
  await pool.query('DELETE FROM users');

  // Create dummy users
  const passwordHash = await bcrypt.hash('password', 10);
  await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES 
     ('alice', 'alice@example.com', $1),
     ('bob', 'bob@example.com', $1)`,
    [passwordHash]
  );

  // Create dummy restaurants
  await pool.query(`
    INSERT INTO restaurants (name, cuisine, address, city)
    VALUES 
    ('Pizza Palace', 'Italian', '123 Main St', 'New York'),
    ('Sushi World', 'Japanese', '456 Elm St', 'Los Angeles'),
    ('Burger Bonanza', 'American', '789 Pine St', 'Chicago')
  `);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
