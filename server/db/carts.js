const client = require('./client');

// Cart Functions
// ---TO DO--- //
const createCart = async (userId) => {}

const getCartByUserId = async (userId) => {}

const getCartItemById = async (cartItemId) => {}

const createCartItem = async (cartId, productId, quantity) => {}

// optional, used during login or page load. if user does not have active cart, this creates one
const getOrCreateCart = async (userId) => {}

const addProductToCart = async (cartId, productId, quantity) => {}

const updateCartItemQuantity = async (cartItemId, quantity) => {}

const removeProductFromCart = async (cartItemId) => {}

const clearCart = async (userId) => {}


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
}