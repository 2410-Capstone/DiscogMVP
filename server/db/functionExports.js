// This file contains all reusable DB functions
// Moved from index.js to avoid confusion with server/db/index.js (Josh's file)
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

// ---TO DO--- //

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