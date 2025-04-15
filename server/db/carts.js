const client = require("./client");

// Cart Functions
// ---TO DO--- //
const createCart = async ({ user_id, cart_status }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO carts (id, user_id, cart_status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const {
      rows: [cart],
    } = await client.query(SQL, [id, user_id, cart_status]);
    return cart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

const getCartByUserId = async (userId) => {};

const getCartItemById = async (cartItemId) => {};

const createCartItem = async (cartId, productId, quantity) => {};

// optional, used during login or page load. if user does not have active cart, this creates one
const getOrCreateCart = async (userId) => {};

const addProductToCart = async (cartId, productId, quantity) => {};

const updateCartItemQuantity = async (cartItemId, quantity) => {};

const removeProductFromCart = async (cartItemId) => {};

const clearCart = async (userId) => {};

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
