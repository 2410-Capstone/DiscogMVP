import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


function StripeForm({ userId, email, cartItems, shippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");
  const [emailInput, setEmailInput] = useState(email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setStatus("Processing...");

    try {
      
      const res = await fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: emailInput,
          cartItems,
          shippingAddress,
        }),
      });

      const { clientSecret } = await res.json();

      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: emailInput,
          },
        },
      });

      if (error) {
        setStatus(`Payment failed: ${error.message}`);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setStatus("Payment successful! 🎉");
  
      }
    } catch (err) {
      console.error("Payment error:", err);
      setStatus("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <input
        type="email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        placeholder="Email"
        required
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />

      <button
        type="submit"
        disabled={!stripe}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Pay Now
      </button>

      <p>{status}</p>
    </form>
  );
}

export default function PaymentForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <StripeForm {...props} />
    </Elements>
  );
}
