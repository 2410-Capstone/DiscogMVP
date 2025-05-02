const express = require("express");
const router = express.Router();
const { createStripePaymentIntent, createPayment } = require("../db/payments");
const pool = require("../db/pool");
const authenticateToken = require("../middleware/authMiddleware");


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

router.get("/latest", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(/*sql*/
      `SELECT billing_name, billing_address
       FROM payments
       WHERE order_id IN (
         SELECT id FROM orders WHERE user_id = $1
       )
       ORDER BY payment_date DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No billing info found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching billing info:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
