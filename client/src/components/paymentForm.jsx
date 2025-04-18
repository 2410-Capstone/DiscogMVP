require("dotenv").config({ path: "../../../.env" });
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY); 

function StripeForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    const cardElement = elements.getElement(CardElement);

   
    const { clientSecret } = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000 }) 
    }).then(res => res.json());

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setStatus(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setStatus("Payment successful! 🎉");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
      <p>{status}</p>
    </form>
  );
}

export default function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <StripeForm />
    </Elements>
  );
}
