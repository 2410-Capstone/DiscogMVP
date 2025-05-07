require('dotenv').config({ path: '../.env' });
const pool = require('../db/pool.js');
const albums = require('./albums_with_ids.cjs');

const backfillArtistDetails = async () => {
  console.log('Starting backfill of artist_details...');

  let updatedCount = 0;
  let skippedCount = 0;

  for (const album of albums) {
    const release_id = album.url?.split('/').pop();

    if (!album.artist_details || typeof album.artist_details !== 'string' || album.artist_details.trim() === '') {
      console.warn(`Skipping album (no artist_details):`, album.artist, album.title);
      skippedCount++;
      continue;
    }

    const artistProfile = album.artist_details;

    if (!artistProfile) {
      console.warn(`Skipping album (no profile):`, album.artist, album.title);
      skippedCount++;
      continue;
    }

    try {
      const { rowCount } = await pool.query(
        /*sql*/ `
          UPDATE products
          SET artist_details = $1
          WHERE release_id = $2
        `,
        [artistProfile, release_id]
      );

      if (rowCount > 0) {
        console.log(` Updated: ${album.artist} - ${album.title}`);
        updatedCount++;
      } else {
        console.warn(`⚠️ No matching product for: ${album.artist} - ${album.title}`);
        skippedCount++;
      }
    } catch (err) {
      console.error(`🔥 Error updating album: ${album.artist} - ${album.title}`, err);
      skippedCount++;
    }
  }

  console.log(`Backfill complete! Updated ${updatedCount} records, Skipped ${skippedCount}.`);

  await pool.end();
};

if (require.main === module) {
  backfillArtistDetails();
}

module.exports = backfillArtistDetails;
