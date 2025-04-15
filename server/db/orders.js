const client = require("./client");

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
    } = await client.query(SQL, [user_id, shipping_address, order_status, tracking_number, total]);
    return order;

  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }

};

const getOrderByUserId = async ({ orderId }) => {
  try {
    const SQL = /*sql*/ `
      SELECT * FROM orders
      WHERE user_id = $1;
    `;
    const { rows: orders } = await client.query(SQL, [orderId]);
    return orders;
  } catch (error) {
    console.error("Error getting order by user ID:", error);
}

const getOrderById = async (orderId) => {
  try {
    const { rows: [order] } = await client.query(/*sql*/ `
      SELECT * FROM orders WHERE id = $1;
    `, [orderId]);
    
    return order;
  } catch (error) {
    console.error("Error getting order by ID:", error);

    throw error;
  }
};

const createOrderItem = async ({ orderId, productId, quantity, price }) => {
  try {
    // Get product price at the time of order
    const { rows: [product] } = await client.query(/*sql*/`
      SELECT price FROM products WHERE id = $1;
    `, [productId]);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    const price = product.price;
    // Insert order with price
    const { rows: [orderItem] } = await client.query(/*sql*/ `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, [orderId, productId, quantity, price]);
      return orderItem;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw error;
  }

};

const getOrderItems = async (orderId) => {
  try {
    const { rows } = await client.query(/*sql*/ `
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
    `, [orderId]);

    return rows;
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

const calculateOrderTotal = async (orderId) => {
  try {
    const { rows: [result] } = await client.query(/*sql*/`
      SELECT SUM(price * quantity) AS total
      FROM order_items
      WHERE order_id = $1;
    `, [orderId]);
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
  calculateOrderTotal
}

