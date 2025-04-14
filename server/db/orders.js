const client = require('./client');

// Order Functions
 // ---TO DO--- //
const createOrder = async (userId, shippingAddress) => {}

const getOrderByUserId = async (orderId) => {}

const getOrderById = async (orderId) => {

}

const createOrderItem = async (orderId, productId, quantity) => {
  try {
    const { rows: [orderItem] } = await client.query(/*sql*/ `
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
      `, [orderId, productId, quantity]);
      return orderItem;
  } catch (error) {
    console.error("Error creating order item:", error);
  }
}


module.exports = {
  createOrder,
  getOrderByUserId,
  getOrderById,
  createOrderItem,
}