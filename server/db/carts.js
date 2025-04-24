const pool = require('./pool');

// Cart Functions
// ---TO DO--- //
const createCart = async ({ user_id, cart_status }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO carts ( user_id, cart_status)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const {
      rows: [cart],
    } = await pool.query(SQL, [user_id, cart_status]);
    return cart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

const getCartByUserId = async ({ user_Id }) => {
  try {
    const SQL = /*sql*/ `
      SELECT * FROM carts
      WHERE user_id = $1;
    `;
    const {
      rows: [cart],
    } = await pool.query(SQL, [user_Id]);
    return cart;
  } catch (error) {
    console.error("Error getting cart by user ID:", error);
    throw error;
  }
};

const getCartItemById = async ({ cart_item_id }) => {
  const SQL = /*sql*/ `
    SELECT * FROM cart_items
    WHERE id = $1;
  `;
  const {
    rows: [cart_item],
  } = await pool.query(SQL, [cart_item_id]);
  return cart_item;
};

const createCartItem = async ({ cart_id, product_id, quantity }) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [cart_id, product_id, quantity]);
    return cart_item;
  } catch (error) {
    console.error("Error creating cart item:", error);
    throw error;
  }
};

const getOrCreateCart = async (userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check for existing active cart
    const { rows } = await client.query(
      `SELECT * FROM carts 
       WHERE user_id = $1 AND cart_status = 'active'
       FOR UPDATE`,
      [userId]
    );

    if (rows.length > 0) {
      await client.query('COMMIT');
      return rows[0];
    }

    // Create new cart if none exists
    const { rows: [newCart] } = await client.query(
      `INSERT INTO carts (user_id, cart_status)
       VALUES ($1, 'active')
       RETURNING *`,
      [userId]
    );

    await client.query('COMMIT');
    return newCart;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error in getOrCreateCart:", err);
    throw err;
  } finally {
    client.release();
  }
};

const addProductToCart = async ({ cart_id, product_id, quantity }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validate product exists
    const productCheck = await client.query(
      'SELECT id FROM products WHERE id = $1',
      [product_id]
    );
    if (productCheck.rows.length === 0) {
      throw new Error('Product not found');
    }

    // Add item to cart
    const { rows: [item] } = await client.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cart_id, product_id, quantity]
    );

    await client.query('COMMIT');
    return item;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error adding to cart:", err);
    throw err;
  } finally {
    client.release();
  }
};

const updateCartItemQuantity = async ({ cart_item_id, quantity }) => {
  try {
    const SQL = /*sql*/ `
      UPDATE cart_items
      SET quantity = $1
      WHERE id = $2
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [quantity, cart_item_id]);
    return cart_item;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

const removeProductFromCart = async ({ cart_item_id }) => {
  try {
    const SQL = /*sql*/ `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [cart_item_id]);
    return cart_item;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
};

const clearCart = async ({ user_id }) => {
  try {
    const SQL = /*sql*/ `
      DELETE FROM cart_items
      WHERE cart_id IN (
        SELECT id FROM carts WHERE user_id = $1
      )
      RETURNING *;
    `;
    const {
      rows: [cart_item],
    } = await pool.query(SQL, [user_id]);
    return cart_item;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
const getCartItems = async (cartId) => {
  const { rows } = await pool.query(
    `SELECT 
       ci.id,
       ci.product_id,
       ci.quantity,
       p.price::float,
       p.artist,
       p.image_url
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = $1`,
    [cartId]
  );
  return rows;
};
module.exports = {
  createCart,
  createCartItem,
  getCartByUserId,
  getCartItemById,
  getOrCreateCart,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearCart,
  getCartItems,
};
