const express = require("express");
const router = express.Router();
const { createStripePaymentIntent, createPayment } = require("../db/payments");

router.post("/", async (req, res) => {
  const { userId, cartItems, shippingInfo } = req.body;

  // Helper: check for empty string or missing
  const isEmpty = (val) => typeof val !== "string" || val.trim() === "";

  const requiredFields = ["email", "addressLine1", "city", "state", "zip"];
  const missingField = requiredFields.find((field) => isEmpty(shippingInfo?.[field]));

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  if (!shippingInfo || missingField) {
    return res
      .status(400)
      .json({ error: `Missing required field: ${missingField || "shippingInfo"}` });
  }

  try {
    const result = await createStripePaymentIntent(userId, cartItems, shippingInfo);
    res.json(result);
  } catch (err) {
    console.error("Error in /payment route:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/confirm", async (req, res) => {
  const {
    order_id,
    amount,
    billing_name,
    billing_address,
    payment_method = "credit_card",
    payment_status = "paid",
  } = req.body;

  if (!order_id || !amount || !billing_name || !billing_address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payment = await createPayment({
      order_id,
      payment_method,
      payment_status,
      billing_name,
      billing_address,
      payment_date: new Date(),
      amount,
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error("Failed to save payment:", err.stack || err.message || err);

    res.status(500).json({ error: "Failed to save payment" });
  }
});

module.exports = router;
