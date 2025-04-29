const express = require("express");
const router = express.Router();
const { createStripePaymentIntent } = require("../db/payments");

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

module.exports = router;
