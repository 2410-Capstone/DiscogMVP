const client = require('./client');

// Admin Functions

// User Management
const getAllUsers = async () => {}

const deleteUser = async (userId) => {
  try {
    const { rows: [user] } = await client.query(/*sql*/ `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
    `, [userId]);
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Order Management
const getAllOrders = async () => {}

const updateOrderStatus = async (orderId, status) => {}

// Product Management
const getAllProducts = async () => {
  try {
    const { rows } = await client.query( /*sql*/`
      SELECT * FROM products;
    `);
    return rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

const updateProduct = async () => {}

const deleteProduct = async (id) => {
  try {
    const { rows: [product] } = await client.query(/*sql*/ `
      DELETE FROM products
      WHERE id = $1
      RETURNING *;
    `, [id]);
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}


module.exports = {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  updateProduct,
  deleteProduct,
};