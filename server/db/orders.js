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
    throw error;
  }
};

const getOrderById = async (orderId) => {};

const createOrderItem = async ({ orderId, productId, quantity, price }) => {
  try {
    const {
      rows: [orderItem],
    } = await client.query(
      /*sql*/ `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [orderId, productId, quantity, price]
    );
    return orderItem;
  } catch (error) {
    console.error("Error creating order item:", error);
  }
};

module.exports = {
  createOrder,
  getOrderByUserId,
  getOrderById,
  createOrderItem,
};
