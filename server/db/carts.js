const pool = require('./pool');

// Cart Functions
// ---TO DO--- //
const createCart = async ({ user_id, cart_status }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO carts ( user_id, cart_status)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const {
      rows: [cart],
    } = await pool.query(SQL, [user_id, cart_status]);
    return cart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

const getCartByUserId = async ({ user_Id }) => {
  try {
    const SQL = /*sql*/ `
      SELECT * FROM carts
      WHERE user_id = $1;
    `;
    const {
      rows: [cart],
    } = await pool.query(SQL, [user_Id]);
    return cart;
  } catch (error) {
    console.error("Error getting cart by user ID:", error);
    throw error;
  }
};

const getCartItemById = async ({ cart_item_id }) => {
  const SQL = /*sql*/ `
    SELECT * FROM cart_items
    WHERE id = $1;
  `;
  const {
    rows: [cart_item],
  } = await pool.query(SQL, [cart_item_id]);
  return cart_item;
};

const createCartItem = async ({ cart_id, product_id, quantity }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [cart_id, product_id, quantity]);
    return cart_item;
  } catch (error) {
    console.error("Error creating cart item:", error);
    throw error;
  }
};

// optional, used during login or page load. if user does not have active cart, this creates one
const getOrCreateCart = async (userId) => {};

const addProductToCart = async ({ cart_id, product_id, quantity }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [cart_id, product_id, quantity]);
    return cart_item;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};
const updateCartItemQuantity = async ({ cart_item_id, quantity }) => {
  try {
    const SQL = /*sql*/ `
      UPDATE cart_items
      SET quantity = $1
      WHERE id = $2
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [quantity, cart_item_id]);
    return cart_item;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

const removeProductFromCart = async ({ cart_item_id }) => {
  try {
    const SQL = /*sql*/ `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [cart_item_id]);
    return cart_item;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
};

const clearCart = async ({ user_id }) => {
  try {
    const SQL = /*sql*/ `
      DELETE FROM cart_items
      WHERE cart_id IN (
        SELECT id FROM carts WHERE user_id = $1
      )
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [user_id]);
    return cart_item;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

module.exports = {
  createCart,
  createCartItem,
  getCartByUserId,
  getCartItemById,
  getOrCreateCart,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearCart,
};
