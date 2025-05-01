const express = require("express");
const router = express.Router();
const { createStripePaymentIntent, createPayment } = require("../db/payments");
const { createOrder, createOrderItem } = require("../db/orders");

router.post("/", async (req, res) => {
  const { userId, cartItems, shippingInfo } = req.body;

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
    // 1. Create the Order first
    const shippingAddress = `${shippingInfo.addressLine1}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`;
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = await createOrder({
      user_id: userId,
      shipping_address: shippingAddress,
      order_status: "created",
      tracking_number: null,
      total,
    });

    // 2. Create order_items linked to new order
    for (const item of cartItems) {
      await createOrderItem({
        order_id: newOrder.id,
        product_id: item.id,
        quantity: item.quantity,
      });
    }

    // 3. Pass new order ID to Stripe intent
    const result = await createStripePaymentIntent(userId, cartItems, shippingInfo, newOrder.id);
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
