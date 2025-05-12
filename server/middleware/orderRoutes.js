const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');
const { getOrderByUserId } = require('../db/orders');
const { getOrderById } = require('../db/orders');
const { updateOrder } = require('../db/orders');
const { createOrder } = require('../db/orders');
const { updateOrderItem } = require('../db/orders');
const { createOrderItem } = require('../db/orders');
const { getOrderItems } = require('../db/orders');
const { deleteOrder } = require('../db/orders');
const { deleteOrderItem } = require('../db/orders');
const { calculateOrderTotal } = require('../db/orders');
const isAdmin = require('../middleware/isAdminMiddleware');
const router = express.Router();

// GET /api/orders/guest
router.get('/guest', async (req, res) => {
  const { orderId, email } = req.query;
  try {
    // Get the order and join the user to get the email
    const orderResult = await pool.query(
      `SELECT o.*, u.email, u.name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1 AND u.user_role = 'guest'`,
      [orderId]
    );
    const order = orderResult.rows[0];
    if (!order || typeof order.email !== 'string' || order.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await getOrderItems(orderId);

    let shippingAddress = order.shipping_address;
    try {
      if (typeof shippingAddress === 'string') {
        shippingAddress = JSON.parse(shippingAddress);
      }
    } catch {
      // fallback: leave as string
    }

    res.json({
      orderNumber: order.id,
      email: order.email,
      total: order.total,
      shippingAddress,
      cartItems: items,
    });
  } catch (err) {
    console.error('Error fetching guest order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders/guest
router.post('/guest', async (req, res, next) => {
  const { email, name, address, items } = req.body;
  const order_status = req.body.order_status || 'created';

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }
  for (const item of items) {
    if (!item.product_id || !item.quantity) {
      return res.status(400).json({ error: 'Each item must have a product_id and quantity' });
    }
  }

  try {
    const result = await pool.query(
      /*sql*/ `
      INSERT INTO users (email, name, address, user_role)
      VALUES ($1, $2, $3, 'guest')
      RETURNING id, email, name, address, user_role
    `,
      [email, name, address]
    );

    const guestUserId = result.rows[0].id;

    const newOrder = await createOrder({
      user_id: guestUserId,
      shipping_address: address,
      order_status: order_status,
      tracking_number: null,
      total: 0,
    });

    for (const item of items) {
      await createOrderItem({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    const total = await calculateOrderTotal(newOrder.id);

    await updateOrder({
      order_id: newOrder.id,
      updates: { total },
    });

    res.status(201).json({
      user: result.rows[0],
      orderId: newOrder.id,
    });
  } catch (error) {
    next(error);
  }
});
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const orders = await getOrderByUserId(req.user.id);
    res.json(orders || []);
  } catch (error) {
    next(error);
  }
});

router.get('/user/albums', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      /*sql*/ `
      SELECT 
        pr.id AS product_id,
        pr.description AS title,
        pr.artist,
        pr.image_url,
        pr.genre
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products pr ON oi.product_id = pr.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching purchased albums:', error);
    next(error);
  }
});

// Get all orders for admin
router.get('/admin/all', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await pool.query(/*sql*/ `
      SELECT 
        o.id AS order_id,
        o.total,
        o.order_status,
        o.created_at,
        o.shipping_address,
        o.tracking_number,
        u.name AS user_name,
        u.email,
        p.payment_status,
        json_agg(json_build_object(
          'product_id', oi.product_id,
          'artist', pr.artist,
          'description', pr.description,
          'price', pr.price,
          'quantity', oi.quantity
        )) AS items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN payments p ON p.order_id = o.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products pr ON pr.id = oi.product_id
      GROUP BY o.id, u.name, u.email, p.payment_status, o.tracking_number
      ORDER BY o.created_at DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all admin orders:', error);
    next(error);
  }
});

// order history
router.get('/my', authenticateToken, async (req, res, next) => {
  try {
    const orders = await getOrderByUserId(req.user.id);
    res.json(orders || []);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Join orders + users to get email + name
    const { rows } = await pool.query(/*sql*/`
      SELECT 
        o.*, 
        u.email, 
        u.name 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [orderId]);

    const order = rows[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user_id !== req.user.id && req.user.user_role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get items
    const items = await getOrderItems(orderId);

    // Parse shipping address if it was stored as JSON string
    let shippingAddress = order.shipping_address;
    try {
      if (typeof shippingAddress === 'string') {
        shippingAddress = JSON.parse(shippingAddress);
      }
    } catch {
      // do nothing
    }

    res.json({
      orderNumber: order.id,
      email: order.email,
      name: order.name,
      total: order.total,
      order_status: order.order_status,
      shippingAddress,
      cartItems: items
    });

  } catch (error) {
    next(error);
  }
});


router.get('/:id/items', authenticateToken, async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order items not found' });
    }
    if (order.user_id !== req.user.id && req.user.user_role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const orderItems = await getOrderItems(orderId);
    if (!orderItems || orderItems.length === 0) {
      return res.status(404).json({ error: 'Order items not found' });
    }
    // Map to expected test shape
    const mapped = orderItems.map((item) => ({
      id: item.order_item_id,
      user_id: order.user_id,
      order_id: Number(orderId),
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      artist: item.artist,
      image_url: item.image_url,
      genre: item.genre,
    }));
    res.json(mapped);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authenticateToken, async (req, res, next) => {
  const { order_status, tracking_number, shipping_address } = req.body;
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(403).json({ error: 'Order ID is required' });
  }

  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found failed to update' });
    }
    if (req.user.user_role === 'admin') {
      const updatedOrder = await updateOrder({
        order_id: orderId,
        updates: { order_status, tracking_number, shipping_address },
      });
      return res.json(updatedOrder);
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden from updating order' });
    }
    if (['shipped', 'delivered'].includes(order.order_status)) {
      return res.status(403).json({ error: 'Forbidden from updating order' });
    }
    const updates = {};
    if (order_status === 'cancelled') {
      updates.order_status = 'cancelled';
    }
    if (shipping_address) {
      updates.shipping_address = shipping_address;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(403).json({ error: 'You can only cancel or update shipping address' });
    }
    const updatedOrder = await updateOrder({
      order_id: orderId,
      updates,
    });
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

router.patch('/:orderId/items/:itemId', authenticateToken, async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  try {
    const updatedOrderItem = await updateOrderItem({
      order_item_id: itemId,
      updates: { quantity },
    });

    if (!updatedOrderItem) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    const order = await getOrderById(updatedOrderItem.order_id);
    if (order.user_id !== req.user.id && req.user.user_role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden from updating order item' });
    }
    res.json(updatedOrderItem);
  } catch (error) {
    next(error);
    return;
  }
});

// PATCH /orders/:id/cancel - Admin cancels an order
router.patch('/:id/cancel', authenticateToken, isAdmin, async (req, res) => {
  const orderId = req.params.id;

  try {
    const result = await pool.query(
      /*sql*/
      `UPDATE orders
       SET order_status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order cancelled', order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

router.post('/', authenticateToken, async (req, res, next) => {
  const { shipping_address, items } = req.body;
  let { order_status } = req.body;
  if (!['created', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order_status)) {
    order_status = 'created';
  }
  if (req.user.user_role === 'guest') {
    return res.status(403).json({ error: 'Forbidden from creating order' });
  }
  if (!shipping_address) {
    return res.status(400).json({ error: 'Missing required fields: shipping_address' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }
  for (const item of items) {
    if (!item.product_id || !item.quantity) {
      return res.status(400).json({ error: 'Each item must have a product_id and quantity' });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const newOrder = await createOrder({
      user_id: req.user.id,
      shipping_address,
      order_status: order_status,
      tracking_number: null,
      total: 0,
    });
    console.log('Creating order with:', {
      user_id: req.user.id,
      shipping_address,
      order_status,
      tracking_number: null,
      total: 0,
    });

    for (const item of items) {
      await createOrderItem({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    const total = await calculateOrderTotal(newOrder.id);

    await updateOrder({
      order_id: newOrder.id,
      updates: { total },
    });

    await client.query('COMMIT');
    const orderItems = await getOrderItems(newOrder.id);
    const responseOrder = { ...newOrder, items: orderItems };

    res.status(201).json(responseOrder);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

router.post('/:orderId/items', authenticateToken, async (req, res, next) => {
  const { product_id, quantity } = req.body;
  const orderId = req.params.orderId;

  if (req.user.user_role === 'guest') {
    return res.status(403).json({ error: 'Forbidden from creating order item' });
  }
  if (quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields: quantity' });
  }
  try {
    const newOrderItem = await createOrderItem({
      order_id: orderId,
      product_id,
      quantity,
    });

    if (!newOrderItem) {
      return res.status(400).json({ error: 'Failed to create order item' });
    }
    res.status(201).json(newOrderItem);
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', authenticateToken, async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.user_id !== req.user.id && req.user.user_role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden from deleting order' });
    }
    const deletedOrder = await deleteOrder(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
});
router.delete('/:orderId/items/:itemId', authenticateToken, async (req, res, next) => {
  const { orderId, itemId } = req.params;

  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    const orderItems = await getOrderItems(orderId);
    const item = orderItems.find((i) => String(i.order_item_id) === String(itemId));
    if (!item) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    if (order.user_id !== req.user.id && req.user.user_role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden from deleting order item' });
    }
    const deletedOrderItem = await deleteOrderItem(itemId);
    if (!deletedOrderItem) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
