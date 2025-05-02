require('dotenv').config({ path: '../../.env' });

const { Pool } = require('pg');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const imagesDir = path.resolve(__dirname, '../..', 'public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/music_capstone_db';
const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || 'DISCOGS_KEY';

// Initialize DB pool
const pool = new Pool({ connectionString: DATABASE_URL });

(async () => {
  try {
    const currentDb = await pool.query('SELECT current_database()');
    console.log('Connected to DB:', currentDb.rows[0].current_database);

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
          
          const imageRes = await fetch(imageUrl, {
            headers: {
              'User-Agent': 'DiscogMVP',
            }
          });
          if (!imageRes.ok) {
            console.warn(`Failed to download image for product ${id}`);
            continue;
          }

          const buffer = await imageRes.buffer();

          
          const contentType = imageRes.headers.get('content-type');
          let extension = '.jpg';
          if (contentType === 'image/png') {
            extension = '.png';
          }

          
          const savePath = path.join(imagesDir, `product-${id}${extension}`);
          fs.writeFileSync(savePath, buffer);
          console.log(`✅ Saved image for product ${id} to ${savePath}`);

          
          const localPath = `/images/product-${id}${extension}`;
          await pool.query(
            'UPDATE products SET image_url = $1 WHERE id = $2',
            [localPath, id]
          );

          console.log(`🔄 Updated DB for product ${id}`);
        } else {
          console.log(`No image found for product ${id} (release ${release_id})`);
        }
      } catch (err) {
        console.error(`❌ Error processing release_id ${release_id}:`, err.message);
      }

      await sleep(1000); 
    }

    console.log('🎉 Finished updating product images.');
    process.exit();
  } catch (err) {
    console.error('Unexpected error:', err.message);
    process.exit(1);
  }
})();
