// This script fetches images from the Discogs API for each product in the database
require('dotenv').config({ path: '../../.env' });

const { Pool } = require('pg');
const fetch = require('node-fetch');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback in case .env fails to load (it failed for me)
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/music_capstone_db';
const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || 'your_fallback_token';

// Initialize DB pool
const pool = new Pool({ connectionString: DATABASE_URL });

(async () => {
  try {
    // Debug: confirm which DB you're using
    const currentDb = await pool.query('SELECT current_database()');
    console.log('Connected to DB:', currentDb.rows[0].current_database);

    // Confirm schema includes release_id
    const schemaRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND table_schema = 'public';
    `);
    
    const productColumns = schemaRes.rows.map(row => row.column_name);
    console.log('Columns in products table:', productColumns);

    if (!productColumns.includes('release_id')) {
      throw new Error("'release_id' column is missing from 'products' table");
    }

    // Fetch products
    const { rows: products } = await pool.query('SELECT id, release_id FROM products');

    for (const product of products) {
      const { id, release_id } = product;
    
      if (!release_id || isNaN(release_id)) {
        console.log(`⏭Skipping product ${id} — invalid release_id:`, release_id);
        continue;
      }
    
      try {
        const res = await fetch(`https://api.discogs.com/releases/${release_id}`, {
          headers: {
            Authorization: `Discogs token=${DISCOGS_TOKEN}`,
            'User-Agent': 'DiscogMVP',
          },
        });
    
        if (!res.ok) {
          console.warn(`Failed fetch for ${release_id}: ${res.status}`);
          continue;
        }
    
        const data = await res.json();
        const imageUrl = data.images?.[0]?.uri;
    
        if (imageUrl) {
          await pool.query(
            'UPDATE products SET image_url = $1 WHERE id = $2',
            [imageUrl, id]
          );
          console.log(`Updated image for product ${id} (release ${release_id})`);
        } else {
          console.log(`No image for product ${id} (release ${release_id})`);
        }
      } catch (err) {
        console.error(`Error processing release_id ${release_id}:`, err.message);
      }
    
      await sleep(1000); // wait 1 second to avoid 429 rate limit
    }    

    console.log('Finished updating product images.');
    process.exit();
  } catch (err) {
    console.error('Unexpected error:', err.message);
    process.exit(1);
  }
})();
