const express = require('express');
const pool = require('../db/pool');
const { addProductToCart, getOrCreateCart, updateCartItemQuantity, removeProductFromCart, clearCart, getCartItems } = require('../db/carts');

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
//Create a new cart for the user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json(cart);
    res.status(201).json(cart);
  } catch (error) {
    console.error("Failed to create cart:", error.message);
    res.status(500).json({ error: error.message });
  }
});

 // POST /cart/items
 router.post('/items', authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    console.log('Getting or creating cart...');
    const cart = await getOrCreateCart(req.user.id);
    console.log("cart: ", cart);

    const item = await addProductToCart({
      cart_id: cart.id,
      product_id,
      quantity
    });
    console.log('Added item:', item);
    
    res.status(201).json(item);
    
  } catch (error) {
    console.error("Failed to add item:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Persist guest cart items after registration
router.post('/sync', authenticateToken, async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items to sync' });
  }

  try {
    const cart = await getOrCreateCart(userId);

    for (const item of items) {
      const productId = item.product_id || item.id;
      const quantity = item.quantity;
    
      if (!productId || !quantity || quantity < 1) continue;
    
      await pool.query(/*sql*/ `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      `, [cart.id, productId, quantity]);
    }
    

    res.status(200).json({ message: 'Cart synced successfully' });
  } catch (err) {
    console.error("Cart sync failed:", err.message);
    res.status(500).json({ error: 'Cart sync failed' });
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
    
    const clearedItems = await clearCart({ user_id: req.user.id });
    res.json({ message: 'Cart cleared', clearedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});


module.exports = router;