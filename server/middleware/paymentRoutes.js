const express = require("express");
const router = express.Router();
const { createStripePaymentIntent } = require("../db/payments");

router.post("/guest", async (req, res) => {
  const { email, cartItems, shippingAddress } = req.body;
  try {
    const result = await createStripePaymentIntent(null, cartItems, shippingAddress, email);
    res.json(result);
  } catch (err) {
    console.error("Error in /payment/guest route:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
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
