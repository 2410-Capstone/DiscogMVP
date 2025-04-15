const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/orders', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Get user's cart items
    const cartItems = await client.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.userId]
    );
    
    if (cartItems.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // 2. Check stock and calculate total
    let total = 0;
    for (const item of cartItems.rows) {
      if (item.quantity > item.stock) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
      total += item.quantity * item.price;
    }
    
    // 3. Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING id',
      [req.user.userId, total, 'pending']
    );
    const orderId = orderResult.rows[0].id;
    
    // 4. Create order items and update product stock
    for (const item of cartItems.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    // 5. Clear cart
    await client.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [req.user.userId]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
