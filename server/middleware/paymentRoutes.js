const express = require('express');
const router = express.Router();
const { createStripePaymentIntent } = require('../db/payments');

router.post('/', async (req, res) => {
  console.log('Received cartItems:', req.body.cartItems); 
  const { userId, cartItems, shippingAddress } = req.body;

  try {
    const result = await createStripePaymentIntent(userId, cartItems, shippingAddress);
    res.json(result);
  } catch (err) {
    console.error("Full error object:", err); 
    res.status(500).json({ 
      error: err.message,
      detail: err.detail 
    });
  }
});

module.exports = router;