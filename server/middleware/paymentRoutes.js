const express = require('express');
const router = express.Router();
const { createStripePaymentIntent } = require('../db/payments');

router.post('/', async (req, res) => {
  const { userId, cartItems, shippingAddress } = req.body;

  try {
    const result = await createStripePaymentIntent(userId, cartItems, shippingAddress);
    res.json(result);
  } catch (err) {
    console.error("Error in /payment route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;