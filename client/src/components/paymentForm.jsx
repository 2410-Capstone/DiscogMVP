import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe with publishable key (not secret key!)
const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY);

function StripeForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState(""); // Added email field for better receipts

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setStatus("Processing...");

    try {
      // 1. Create payment intent on your backend
      const { clientSecret } = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: 2000, // $20.00 in cents
          currency: "usd",
          receipt_email: email // Optional but recommended
        })
      }).then(res => res.json());

      // 2. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email
          }
        }
      });

      if (error) {
        setStatus(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        setStatus("Payment successful! 🎉");
        // You might want to redirect or clear the form here
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <CardElement 
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button 
        type="submit" 
        disabled={!stripe}
        style={{ marginTop: '16px' }}
      >
        Pay $20.00
      </button>
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