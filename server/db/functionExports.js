const client = require('./client');

// Products
const { getProductById, createProduct, getProductsByGenre, searchProducts } = require('./products');

// Users
const { createUser, getUserByEmail, getUserById, updateUser, authenticateUser } = require('./users');

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
  clearCart,
} = require('./carts');

// Orders
const {
  createOrder,
  getOrderByUserId,
  getOrderById,
  createOrderItem,
  getOrderItems,
  calculateOrderTotal,
} = require('./orders');

// Admin
const { getAllUsers, deleteUser, getAllOrders, updateOrderStatus, getAllProducts, deleteProduct } = require('./admin');

// Payments
const { createPayment, updatePaymentStatus } = require('./payments');

module.exports = {
  client,

  // Products
  getProductById,
  createProduct,
  getProductsByGenre,
  searchProducts,

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
  calculateOrderTotal,

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
