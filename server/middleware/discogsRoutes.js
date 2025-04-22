const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;
if (!DISCOGS_TOKEN) {
  console.warn("⚠️ No Discogs token found in environment variables.");
}

// In-memory cache to avoid duplicate requests
const cache = {}; // { [releaseId]: responseData }

router.get('/release/:id', async (req, res) => {
  const { id: releaseId } = req.params;

  // Validate releaseId
  if (!releaseId || isNaN(releaseId)) {
    return res.status(400).json({ error: 'Invalid release ID' });
  }
  
  // Serve from cache if available
  if (cache[releaseId]) {
    return res.json(cache[releaseId]);
  }

  try {
    const response = await fetch(`https://api.discogs.com/releases/${releaseId}`, {
      headers: {
        Authorization: `Discogs token=${DISCOGS_TOKEN}`,
        'User-Agent': 'DiscogMVP', // required by Discogs
      },
    });

    if (!response.ok) {
      const errorMsg = `Discogs API error ${response.status}`;
      console.warn(`Caching failed fetch for release ${releaseId}`);
      cache[releaseId] = { error: errorMsg };
      return res.status(response.status).json({ error: errorMsg });
    }    

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Discogs release:', error);
    res.status(500).json({ error: 'Server error fetching Discogs data' });
  }
});

module.exports = router;
