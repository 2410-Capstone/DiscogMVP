const client = require('./client');

// Products
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('./products');

// Users
const {
  createUser,
  getUserByEmail,
  getUserById
} = require('./users');

// Carts

// Orders


module.exports = {
  client,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createUser,
  getUserByEmail,
  getUserById
};