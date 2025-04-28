const express = require('express');
const router = express.Router();
const {createWishlist, getWishlistById, getWishlistByShareId, addProductToWishlist, removeProductFromWishlist, getProductsInWishlist} = require('../db/wishlist')


router.use((req, res, next) => {
    console.log(`[WISHLISTS] ${req.method} ${req.originalUrl}`);
    next();
  });

router.post('/', async (req, res) => {
    try {
      const { userId, name, isPublic } = req.body;
      const wishlist = await createWishlist({
        user_id: userId,     // mapping here
        name,
        is_public: isPublic  // mapping here
      });
      res.json(wishlist);
    } catch (error) {
      console.error("Error creating wishlist:", error);
      res.status(500).json({ error: "Failed to create wishlist" });
    }
  });
  router.post('/:id/items', async (req, res) => {
    try {
      const { productId } = req.body;
      const { id: wishlist_id } = req.params;
  
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }
  
      await addProductToWishlist({ wishlist_id, product_id: productId });
      res.status(201).json({ message: "Product added to wishlist" });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Failed to add product to wishlist" });
    }
  });
  
router.get ('/:id/items', async(req, res) => {
    try{
        const { id: wishlist_id} = req.params;
        const items = await getProductsInWishlist({wishlist_id});
        res.json(items);
    }catch (error){
        console.error("Error fetching wishlist items:", error);
        res.status(500).json({ error: "Failed to fetch wishlist items" });
      }
    
    });

router.get('/:id', async (req, res) => {
  try {
    const wishlist = await getWishlistById({ id: req.params.id });
    res.json(wishlist);
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({ error: "Failed to get wishlist" });
  }
});

router.get('/share/:shareId', async (req, res) => {
  try {
    const wishlist = await getWishlistByShareId({ share_id: req.params.shareId });
    res.json(wishlist);
  } catch (error) {
    console.error("Error getting shared wishlist:", error);
    res.status(500).json({ error: "Failed to get shared wishlist" });
  }
});

router.delete('/:id/items/:productId', async (req, res) => {
  try {
    const { id: wishlist_id, productId: product_id } = req.params;
    await removeProductFromWishlist({ wishlist_id, product_id });
    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ error: "Failed to remove product" });
  }
});


module.exports = router;
