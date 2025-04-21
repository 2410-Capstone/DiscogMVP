const express = require('express');
const pool = require('../db/pool');
const { addProductToCart, getOrCreateCart, updateCartItemQuantity, removeProductFromCart } = require('../db/carts');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// GET /cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, p.id as product_id, p.artist, p.price, p.image_url, ci.quantity
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

 // POST /cart/items
 router.post('/items', authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const cart = await getOrCreateCart(req.user.id);
    const item = await addProductToCart({
      cart_id: cart.id,
      product_id,
      quantity
    });
    res.status(201).json(item);
  } catch (error) {
    console.error("Failed to add item:", error.message);
    res.status(500).json({ error: error.message });
  }
});

 // PUT /cart/items/:id
 router.put('/items/:id', authenticateToken, async (req, res) => {
  const cart_item_id = req.params.id;
  const { quantity } = req.body;
  try {
    const updatedItem = await updateCartItemQuantity({ cart_item_id, quantity });
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

 // DELETE /cart/items/:id
 router.delete('/items/:id', authenticateToken, async (req, res) => {
  const cart_item_id = req.params.id;
  try {
    const deletedItem = await removeProductFromCart({ cart_item_id });
    res.json({ message: 'Item removed', item: deletedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

 // DELETE /cart/clear
 router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const clearedItems = await clearCart({ user_id: req.user.userId });
    res.json({ message: 'Cart cleared', clearedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});


module.exports = router;