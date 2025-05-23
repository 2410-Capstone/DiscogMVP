const pool = require('./pool');

// Wishlists Functions

// Create a new wishlist
const createWishlist = async ({ user_id, name, is_public }) => {
  try {
    const {
      rows: [wishlist],
    } = await pool.query(
      /*sql*/ `
      INSERT INTO wishlists (user_id, name, is_public, share_id)
      VALUES ($1, $2, $3, gen_random_uuid())
      RETURNING *;
    `,
      [user_id, name, is_public]
    );
    return wishlist;
  } catch (error) {
    console.error('Error creating wishlist:', error);
    throw error;
  }
};

// Get wishlist by ID
const getWishlistById = async ({ id }) => {
  try {
    const {
      rows: [wishlist],
    } = await pool.query(
      /*sql*/ `
      SELECT * FROM wishlists WHERE id = $1;
    `,
      [id]
    );
    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist by ID:', error);
    throw error;
  }
};

// Get wishlist by share link (public view)
const getWishlistByShareId = async ({ share_id }) => {
  try {
    const {
      rows: [wishlist],
    } = await pool.query(
      /*sql*/ `
      SELECT * FROM wishlists WHERE share_id = $1 AND is_public = true;
    `,
      [share_id]
    );
    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist by share ID:', error);
    throw error;
  }
};

// Add a product to a wishlist
const addProductToWishlist = async ({ wishlist_id, product_id }) => {
  try {
    await pool.query(
      /*sql*/ `
      INSERT INTO wishlist_items (wishlist_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING; -- prevent duplicate items
    `,
      [wishlist_id, product_id]
    );
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    throw error;
  }
};

// Remove a product from a wishlist
const removeProductFromWishlist = async ({ wishlist_id, product_id }) => {
  try {
    await pool.query(
      /*sql*/ `
      DELETE FROM wishlist_items
      WHERE wishlist_id = $1 AND product_id = $2;
    `,
      [wishlist_id, product_id]
    );
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    throw error;
  }
};

// Get all products in a wishlist
const getProductsInWishlist = async ({ wishlist_id }) => {
  try {
    const { rows } = await pool.query(
      /*sql*/ `
      SELECT p.*
      FROM wishlist_items wi
      JOIN products p ON wi.product_id = p.id
      WHERE wi.wishlist_id = $1;
    `,
      [wishlist_id]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching products in wishlist:', error);
    throw error;
  }
};

const getUserWishlists = async (user_id) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT w.*, 
        (SELECT COUNT(*) FROM wishlist_items WHERE wishlist_id = w.id) as items_count
      FROM wishlists w
      WHERE w.user_id = $1::uuid
    `,
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error('Database error:', {
      message: error.message,
      query: error.query,
    });
    throw error;
  }
};

const updateWishlist = async ({ id, name, is_public }) => {
  try {
    const {
      rows: [wishlist],
    } = await pool.query(
      `
      UPDATE wishlists 
      SET name = $1, is_public = $2 
      WHERE id = $3
      RETURNING *;
    `,
      [name, is_public, id]
    );
    return wishlist;
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
};

const deleteWishlist = async (id) => {
  try {
    await pool.query('DELETE FROM wishlists WHERE id = $1;', [id]);
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    throw error;
  }
};

const isProductInWishlist = async ({ wishlist_id, product_id }) => {
  try {
    const {
      rows: [item],
    } = await pool.query(
      `
      SELECT 1 FROM wishlist_items 
      WHERE wishlist_id = $1 AND product_id = $2;
    `,
      [wishlist_id, product_id]
    );
    return !!item;
  } catch (error) {
    console.error('Error checking product in wishlist:', error);
    throw error;
  }
};
module.exports = {
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
};
