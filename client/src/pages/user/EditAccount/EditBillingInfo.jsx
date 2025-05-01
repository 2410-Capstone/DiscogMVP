import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const EditBillingInfo = ({ onBillingUpdate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingPhone, setBillingPhone] = useState(""); // 1. Add state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    if (!stripe || !elements) {
      setError("Stripe is not loaded.");
      setSaving(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: billingName,
        phone: billingPhone, // 3. Add phone here
        address: {
          line1: billingAddress,
        },
      },
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    if (onBillingUpdate) onBillingUpdate(paymentMethod.id);
  };

  return (
    <div>
      <h2>Edit Billing Information</h2>
      <form className='edit-billing-info-form' onSubmit={handleSubmit}>
        <div>
          <label>Name on Card:</label>
          <input type='text' value={billingName} onChange={(e) => setBillingName(e.target.value)} required />
        </div>
        <div>
          <label>Billing Address:</label>
          <input type='text' value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type='tel' value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} />
        </div>
        <div>
          <label>Card Details:</label>
          <CardElement />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>Billing info updated!</div>}
        <button type='submit' disabled={saving || !stripe}>
          {saving ? "Saving..." : "Update Billing Info"}
        </button>
      </form>
    </div>
  );
};

export default EditBillingInfo;
