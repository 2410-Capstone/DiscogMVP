const pool = require('./pool');

// Order Functions

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
    console.error('Error creating order:', error);
    throw error;
  }
};

const getOrderByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(/*sql*/ `
      SELECT 
        o.id AS order_id,
        o.total,
        o.order_status,
        o.created_at,
        o.updated_at,
        o.shipping_address,
        o.tracking_number,
        p.payment_status,
        json_agg(
          json_build_object(
            'product_id', pr.id,
            'artist', pr.artist,
            'description', pr.description,
            'quantity', oi.quantity,
            'price', oi.price,
            'image_url', pr.image_url
          )
        ) AS items
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products pr ON pr.id = oi.product_id
      WHERE o.user_id = $1
      GROUP BY o.id, p.payment_status
      ORDER BY o.created_at DESC
    `, [userId]);

    return rows;
  } catch (err) {
    console.error("Error fetching user orders:", err);
    throw err;
  }
};


const getOrderById = async (orderId) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error('Error in getOrderById:', error.message);
    throw error;
  }
};

const updateOrder = async ({ order_id, updates }) => {
  try {
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    if (setClauses.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(order_id);

    const SQL = `
      UPDATE orders
      SET ${setClauses.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const { rows } = await pool.query(SQL, values);
    return rows[0];
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

const updateOrderItem = async ({ order_item_id, updates }) => {
  try {
    const { quantity } = updates;
    const { rows } = await pool.query(
      /*sql*/ `
      UPDATE order_items
      SET quantity = $1
      WHERE id = $2
      RETURNING *;
    `,
      [quantity, order_item_id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error updating order item:', error);
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
    console.error('Error creating order item:', error);
    throw error;
  }
};

const getOrderItems = async (order_id) => {
  try {
    const { rows } = await pool.query(
      /*sql*/ `
      SELECT 
        oi.id AS order_item_id,
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.artist,
        p.description,
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
    console.error('Error fetching order items:', error);
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
    console.error('Error calculating order total:', error);
    throw error;
  }
};

const deleteOrder = async (order_id) => {
  try {
    const { rows } = await pool.query(
      /*sql*/ `
      DELETE FROM orders WHERE id = $1 RETURNING *;
    `,
      [order_id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

const deleteOrderItem = async (order_item_id) => {
  try {
    const { rows } = await pool.query(
      /*sql*/ `
      DELETE FROM order_items WHERE id = $1 RETURNING *;
    `,
      [order_item_id]
    );
    return rows[0];
  } catch (error) {
    console.error('Error deleting order item:', error);
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
  updateOrderItem,
  deleteOrder,
  deleteOrderItem,
  calculateOrderTotal,
};
