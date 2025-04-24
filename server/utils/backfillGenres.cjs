// This script fetches genres from Discogs for products with missing/unknown genres in our DB
require('dotenv').config();
const fetch = require('node-fetch');
const pool = require('../db/pool');

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchGenreFromDiscogs = async (releaseId) => {
  try {
    const res = await fetch(`https://api.discogs.com/releases/${releaseId}`, {
      headers: {
        Authorization: `Discogs token=${DISCOGS_TOKEN}`,
        'User-Agent': 'DiscogMVP',
      },
    });

    if (!res.ok) throw new Error(`Discogs API returned ${res.status}`);
    const data = await res.json();
    return data.genres?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch genre for ${releaseId}:`, error.message);
    return null;
  }
};

const updateGenreInDB = async (productId, genre) => {
  try {
    await pool.query(
      'UPDATE products SET genre = $1, updated_at = NOW() WHERE id = $2',
      [genre, productId]
    );
    console.log(`Updated product ${productId} with genre: ${genre}`);
  } catch (err) {
    console.error(`DB update failed for product ${productId}:`, err.message);
  }
};

const backfillGenres = async () => {
  console.log('Backfilling genres...');

  const { rows: products } = await pool.query(`
    SELECT id, release_id FROM products 
    WHERE genre IS NULL OR genre = 'Unknown'
  `);

  for (const { id, release_id } of products) {
    if (!release_id) continue;
  
    const genre = await fetchGenreFromDiscogs(release_id);
    if (genre) {
      await updateGenreInDB(id, genre);
    }
  
    await wait(1200); // wait 1.2 seconds to stay below the 60 req/min limit
  }  

  console.log('Genre backfill complete!');
};

backfillGenres();
