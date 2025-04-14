// This file contains all reusable DB functions
// Moved from index.js to avoid confusion with server/db/index.js (Josh's file)
const client = require('./client');

// Products
const {
  getProductById,
  createProduct,
} = require('./products');

// Users
const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  authenticateUser
} = require('./users');

// Carts
const {
  createCart,
  createCartItem,
  getCartByUserId,
  getCartItemById,
  getOrCreateCart,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearCart
} = require('./carts');

// Orders
const {
  createOrder,
  getOrderByUserId,
  getOrderById,
  createOrderItem,
  getOrderItems
} = require('./orders');

// Admin
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  deleteProduct
} = require('./admin');

// Payments
const {
  createPayment,
  updatePaymentStatus
} = require("./payments");


module.exports = {
  client,

  // Products
  getProductById,
  createProduct,

  // Users
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  authenticateUser,

  // Carts
  createCart,
  createCartItem,
  getCartByUserId,
  getCartItemById,
  getOrCreateCart,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearCart,

  // Orders
  createOrder,
  getOrderByUserId,
  getOrderById,
  createOrderItem,
  getOrderItems,

  // Admin
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  deleteProduct,

  // Payments
  createPayment,
  updatePaymentStatus,
};