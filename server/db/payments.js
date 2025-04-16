require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const pool = require("./pool");


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
const createStripePaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),  
      currency,
      payment_method_types: ['card'], // for test, card is fine
    });

    console.log("✅ Payment intent created:", paymentIntent.id);
    return paymentIntent;
  } catch (err) {
    console.error("❌ Error creating payment intent:", err.message);
    throw err;
  }
};


module.exports = {
  createPayment,
  updatePaymentStatus,
  createStripePaymentIntent,
};
