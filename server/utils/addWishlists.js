// migrate_wishlist_tables.js
require('dotenv').config({path: "../.env"});

const pool = require('../db/pool');

const createTables = async () => {
  try {
    console.log("Starting wishlist tables creation...");

    // Create 'wishlists' table
    await pool.query(/*sql*/`
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  share_id UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
    `);
    console.log("✅ 'wishlists' table created or already exists.");

    // Create 'wishlist_items' table
    await pool.query(/*sql*/`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id SERIAL PRIMARY KEY,
        wishlist_id INTEGER REFERENCES wishlists(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE (wishlist_id, product_id) -- prevent duplicate entries
      );
    `);
    console.log("✅ 'wishlist_items' table created or already exists.");

    console.log("All wishlist tables created successfully!");
    process.exit(0); 
  } catch (error) {
    console.error("❌ Error creating wishlist tables:", error);
    process.exit(1);
  }
};

createTables();
