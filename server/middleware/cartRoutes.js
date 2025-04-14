const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/cart', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, p.id as product_id, p.artist, p.price, p.image, c.quantity 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

module.exports = router;
