require('dotenv').config({path:'../.env'});
const Stripe = require('stripe');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("./pool");
const { v4: uuidv4 } = require('uuid');



const createPayment = async ({
  order_id,
  payment_method,
  payment_status = "pending",
  billing_name,
  billing_address,
  payment_date = null,
  amount,
}) => {
  try {
    const {
      rows: [payment],
    } = await pool.query(
      /*sql*/ `
      INSERT INTO payments(order_id, payment_method, payment_status, billing_name, billing_address, payment_date, amount)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [order_id, payment_method, payment_status, billing_name, billing_address, payment_date, amount]
    );
    return payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

const updatePaymentStatus = async ({ paymentId, status }) => {
  try {
    const {
      rows: [payment],
    } = await pool.query(
      /*sql*/ `
      UPDATE payments
      SET payment_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `,
      [status, paymentId]
    );
    return payment;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};


/**
 * Creates a Stripe Payment Intent for test payments
 * @param {number} amount - Amount in USD (e.g. 29.99)
 * @param {string} currency - e.g. 'usd'
 * @returns {Promise<object>} PaymentIntent object
 */
async function createStripePaymentIntent(userId, cartItems, shippingAddress) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const amount = cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);

    // Create order
    const orderId = uuidv4();
    await client.query(
      `INSERT INTO orders (id, user_id, total, shipping_address) 
       VALUES ($1, $2, $3, $4)`,
      [orderId, userId, amount, shippingAddress]
    );

    // Create order_items
    for (let item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Create PaymentIntent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe wants amounts in cents
      currency: 'usd',
      metadata: { orderId, userId }
    });

    await client.query('COMMIT');

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: orderId
    };

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error creating payment intent + order:", err);
    throw err;
  } finally {
    client.release();
  }
}


module.exports = {
  createPayment,
  updatePaymentStatus,
  createStripePaymentIntent,
};
