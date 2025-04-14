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

const getOrderByUserId = async (orderId) => {};

const getOrderById = async (orderId) => {};

const createOrderItem = async (orderId, productId, quantity) => {
  try {
    const {
      rows: [orderItem],
    } = await client.query(
      /*sql*/ `
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [orderId, productId, quantity]
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
