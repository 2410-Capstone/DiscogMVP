const pool = require('./pool');

const getAllUsers = async () => {
  try {
    const { rows } = await pool.query(/*sql*/ `
      SELECT id, email, name, address, user_role, created_at
      FROM users
      WHERE user_role IN ('customer', 'admin')
      ORDER BY created_at DESC;
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const deleteUser = async ({ userId }) => {
  try {
    const {
      rows: [user],
    } = await pool.query(
      /*sql*/ `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
    `,
      [userId]
    );
    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const { rows } = await pool.query(/*sql*/ `
      SELECT 
        o.id AS order_id,
        o.user_id,
        u.email,
        o.order_status,
        o.created_at,
        o.updated_at,
        u.address AS shipping_address,
        (
          SELECT json_agg(
            json_build_object(
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price
            )
          )
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS order_items,
        (
          SELECT json_agg(
            json_build_object(
              'payment_method', p.payment_method,
              'billing_name', p.billing_name,
              'billing_address', p.billing_address,
              'amount', p.amount,
              'payment_status', p.payment_status
            )
          )
          FROM payments p
          WHERE p.order_id = o.id
        ) AS payments
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC;
    `);

    return rows;
  } catch (error) {
    console.log('Error fetching orders:', error);
    throw error;
  }
};

const updateOrderStatus = async ({ orderId, status }) => {
  try {
    const {
      rows: [order],
    } = await pool.query(
      /*sql*/ `
      UPDATE orders
      SET order_status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `,
      [status, orderId]
    );
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const { rows } = await pool.query(/*sql*/ `
      SELECT * FROM products;
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const updateProduct = async ({ id, fields }) => {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const setString = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
  try {
    const {
      rows: [product],
    } = await pool.query(
      /*sql*/ `
      UPDATE products
      SET ${setString}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `,
      [...Object.values(fields), id]
    );
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

const deleteProduct = async ({ id }) => {
  try {
    const {
      rows: [product],
    } = await pool.query(
      /*sql*/ `
      DELETE FROM products
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );
    return product;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
