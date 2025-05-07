const express = require('express');
const router = express.Router();
const {
  createWishlist,
  getWishlistById,
  getWishlistByShareId,
  addProductToWishlist,
  removeProductFromWishlist,
  getProductsInWishlist,
  getUserWishlists,
  updateWishlist,
  deleteWishlist,
  isProductInWishlist,
} = require('../db/wishlist');
const authenticate = require('../middleware/authMiddleware');

router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    // Convert to UUID if needed
    const userId = req.params.userId;

    const wishlists = await getUserWishlists(userId);

    console.log('Found wishlists:', wishlists);
    res.json(wishlists);
  } catch (error) {
    console.error('Error in /user/:userId:', {
      message: error.message,
      stack: error.stack,
      query: error.query,
    });
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
});

// Update wishlist
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const wishlist = await updateWishlist({
      id: req.params.id,
      name,
      is_public: isPublic,
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// Delete wishlist
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await deleteWishlist(req.params.id);
    res.json({ message: 'Wishlist deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete wishlist' });
  }
});

// Check if product is in wishlist
router.get('/:id/items/:productId', async (req, res) => {
  try {
    const exists = await isProductInWishlist({
      wishlist_id: req.params.id,
      product_id: req.params.productId,
    });
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check product' });
  }
});

router.use((req, res, next) => {
  console.log(`[WISHLISTS] ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/', async (req, res) => {
  try {
    const { userId, name, isPublic } = req.body;
    const wishlist = await createWishlist({
      user_id: userId,
      name,
      is_public: isPublic,
    });
    res.json(wishlist);
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
});
router.post('/:id/items', async (req, res) => {
  try {
    const { productId } = req.body;
    const { id: wishlist_id } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    await addProductToWishlist({ wishlist_id, product_id: productId });
    res.status(201).json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const { id: wishlist_id } = req.params;
    const items = await getProductsInWishlist({ wishlist_id });
    res.json(items);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const wishlist = await getWishlistById({ id: req.params.id });
    res.json(wishlist);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
});

router.get('/share/:shareId', async (req, res) => {
  try {
    const wishlist = await getWishlistByShareId({ share_id: req.params.shareId });
    res.json(wishlist);
  } catch (error) {
    console.error('Error getting shared wishlist:', error);
    res.status(500).json({ error: 'Failed to get shared wishlist' });
  }
});

router.delete('/:id/items/:productId', async (req, res) => {
  try {
    const { id: wishlist_id, productId: product_id } = req.params;
    await removeProductFromWishlist({ wishlist_id, product_id });
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ error: 'Failed to remove product' });
  }
});

module.exports = router;
