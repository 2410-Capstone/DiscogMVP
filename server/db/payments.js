const client = require("./client");

// Payment Functions
// ---TO DO--- //
const createPayment = async ({
  id,
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
    } = await client.query(
      /*sql*/ `
      INSERT INTO payments(id, order_id, payment_method, payment_status, billing_name, billing_address, payment_date, amount)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [id, order_id, payment_method, payment_status, billing_name, billing_address, payment_date, amount]
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
    } = await client.query(
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

module.exports = {
  createPayment,
  updatePaymentStatus,
};
