const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');

const router = express.Router();

router.get('/metrics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const usersResult = await pool.query("SELECT COUNT(*) FROM users WHERE user_role IN ('customer', 'admin')");
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total), 0) FROM orders');

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count, 10),
      totalProducts: parseInt(productsResult.rows[0].count, 10),
      totalOrders: parseInt(ordersResult.rows[0].count, 10),
      totalRevenue: parseFloat(revenueResult.rows[0].coalesce),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin metrics' });
  }
});

module.exports = router;
