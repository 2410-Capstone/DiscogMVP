const pool = require("./pool");

// Order Functions

// ---TO DO--- //
const createOrder = async ({ user_id, shipping_address, order_status, tracking_number, total }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO orders (user_id, shipping_address, order_status, tracking_number, total)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const {
      rows: [order],
    } = await pool.query(SQL, [user_id, shipping_address, order_status, tracking_number, total]);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getOrderByUserId = async (user_id = null) => {
  try {
    const query = user_id
      ? `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`
      : `SELECT * FROM orders ORDER BY created_at DESC`;
    const params = user_id ? [user_id] : [];
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
const getOrderById = async (order_id) => {
  try {
    const {
      rows: [order],
    } = await pool.query(
      /*sql*/ `
      SELECT * FROM orders WHERE id = $1;
    `,
      [order_id]
    );
    return order;
  } catch (error) {
    console.error("Error getting order by ID:", error);

    throw error;
  }
};

const updateOrder = async (order_id, updates) => {
  try {
    const { order_status, tracking_number, shipping_address } = updates;
    const { rows } = await pool.query(
      /*sql*/ `
      UPDATE orders
      SET order_status = $1,
          tracking_number = $2,
          shipping_address = $3
      WHERE id = $4
      RETURNING *;
    `,
      [order_status, tracking_number, shipping_address, order_id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const createOrderItem = async ({ order_id, product_id, quantity }) => {
  try {
    // Get product price at the time of order
    const {
      rows: [product],
    } = await pool.query(
      /*sql*/ `
      SELECT price FROM products WHERE id = $1;
    `,
      [product_id]
    );
    if (!product) {
      throw new Error(`Product with ID ${product_id} not found`);
    }
    const price = product.price;
    // Insert order with price
    const {
      rows: [orderItem],
    } = await pool.query(
      /*sql*/ `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [order_id, product_id, quantity, price]
    );
    return orderItem;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw error;
  }
};

const getOrderItems = async (order_id) => {
  try {
    const { rows } = await pool.query(
      /*sql*/ `
      SELECT 
        oi.id AS order_item_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.artist,
        p.image_url,
        p.genre
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1;
    `,
      [order_id]
    );

    return rows;
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

const calculateOrderTotal = async (order_id) => {
  try {
    const {
      rows: [result],
    } = await pool.query(
      /*sql*/ `
      SELECT SUM(price * quantity) AS total
      FROM order_items
      WHERE order_id = $1;
    `,
      [order_id]
    );
    return Number(result.total) || 0;
  } catch (error) {
    console.error("Error calculating order total:", error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrderByUserId,
  getOrderById,
  createOrderItem,
  getOrderItems,
  updateOrder,
  calculateOrderTotal,
};
