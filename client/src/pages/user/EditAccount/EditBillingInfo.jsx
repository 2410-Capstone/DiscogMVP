import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditBillingInfo = ({ billingName: initialName = "", billingAddress: initialAddress = "", billingPhone: initialPhone = "", onBillingUpdate }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        phone: billingPhone,
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

    toast.success("Billing information updated!");
    if (onBillingUpdate) onBillingUpdate(paymentMethod.id);
    setSaving(false);
  };

  return (
    <form className='edit-billing-info-form' onSubmit={handleSubmit}>
      <h3>Billing Information</h3>
      <div>
        <label>Name on Card:</label>
        <input
          type='text'
          value={billingName}
          onChange={(e) => setBillingName(e.target.value)}
        />
      </div>
      <div>
        <label>Billing Address:</label>
        <input
          type='text'
          value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type='tel'
          value={billingPhone}
          onChange={(e) => setBillingPhone(e.target.value)}
        />
      </div>
      <div>
        <label>Card Details:</label>
        <CardElement />
      </div>
      {error && <div className='error'>{error}</div>}
      {success && <div className='success'>Billing info updated!</div>}
      <button type='submit' disabled={saving || !stripe}>
        {saving ? "Saving..." : "Update Billing Info"}
      </button>
    </form>
  );
};

export default EditBillingInfo;
