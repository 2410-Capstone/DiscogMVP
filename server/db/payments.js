require('dotenv').config({path:'../.env'});
const Stripe = require('stripe');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("./pool");
const { v4: uuidv4 } = require('uuid');

function generateTrackingNumber() {
  return `TRACK${Math.floor(100000 + Math.random() * 900000)}XYZ`;
}

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
async function createStripePaymentIntent(userId, cartItems, shippingInfo, orderId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let resolvedUserId = userId;

    // Auto-create or reuse guest user if no token
    if (!resolvedUserId) {
      // Check if guest already exists
      const { rows } = await client.query(
        `SELECT id FROM users WHERE email = $1 AND user_role = 'guest'`,
        [shippingInfo.email]
      );

      if (rows.length > 0) {
        resolvedUserId = rows[0].id;
      } else {
        const guestRes = await client.query(
          `INSERT INTO users (email, name, address, user_role)
           VALUES ($1, $2, $3, 'guest')
           RETURNING id`,
          [shippingInfo.email, shippingInfo.name, shippingInfo.addressLine1]
        );
        resolvedUserId = guestRes.rows[0].id;
      }
    }

    const amount = cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);

    // Create order
    let finalOrderId = orderId;

    if (!finalOrderId) {
      finalOrderId = uuidv4();
      const trackingNumber = generateTrackingNumber();
      await client.query(
        `INSERT INTO orders (id, user_id, total, shipping_address, tracking_number) 
         VALUES ($1, $2, $3, $4, $5)`,
        [finalOrderId, resolvedUserId, amount, JSON.stringify(shippingInfo), trackingNumber]
      );
    
      for (let item of cartItems) {
        const productId = item.product_id || item.id;
        if (!productId) {
          throw new Error(`Missing product ID for item: ${JSON.stringify(item)}`);
        }
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [finalOrderId, productId, item.quantity, item.price]
        );
      }
    }
    
    
    

    // Create order_items
    if (!orderId) {
      for (let item of cartItems) {
        const productId = item.product_id || item.id;
        if (!productId) {
          throw new Error(`Missing product ID for item: ${JSON.stringify(item)}`);
        }
    
        await client.query(/*sql*/
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [finalOrderId, productId, item.quantity, item.price]
        );
      }
    }
    
    

    // Create PaymentIntent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe wants amounts in cents
      currency: 'usd',
      metadata: {
        orderId,
        ...(userId ? { userId } : { guestEmail: shippingInfo.email }),
      }      
    });

    await client.query('COMMIT');

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: finalOrderId
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
