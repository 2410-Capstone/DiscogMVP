import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PropTypes from 'prop-types';
import styles from "../styles/scss/components/_payment_form.module.scss";



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function StripeForm({ userId, email, cartItems, shippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("default");
  const [emailInput, setEmailInput] = useState(email || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    //REMOVE WHEN AUTH IS WORKING
    const tempUserId ="cdae52c6-4613-4887-af5c-ca88d880c10a"; //TESTING USE, since we dont have login working yet youll need to put a userID for a user from your DB in here. 


    setErrorMessage("");
    
    //all of the error handlers for missing fields
    if (!stripe || !elements) {
      setErrorMessage("Stripe not initialized");
      return;
    }

    if (!cardComplete) {
      setErrorMessage("Please complete your card details");
      return;
    }

    if (!emailInput || !shippingAddress) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty");
      return;
    }

    setStatus("processing");

//Send payment details to tbe backend. If successful we should get an order ID
    try {
      const res = await fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId : tempUserId, //since we dont have logins working yet
          email: emailInput,
          cartItems,
          shippingAddress,
        }),
      });

      const { clientSecret, error: backendError } = await res.json();
      
     
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: emailInput,
            address: {
              line1: shippingAddress,
            },
          },
        },
        receipt_email: emailInput,
      });

      if (error) {
        throw error;
      }

      if (paymentIntent.status === "succeeded") {
        setStatus("succeeded");
        //console.log("✅ Order successfully placed! Order ID:", orderId);
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Payment failed. Please try again.");
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setErrorMessage(event.error?.message || "");
  };

  if (!stripe || !elements) {
    return <div className={styles.loadingMessage}>Loading payment system...</div>;
  }

  return (
    <div className={styles.container}>
      {status === "succeeded" ? (
        <div className={styles.successMessage}>
          Payment successful! 🎉
          <p>redirect to the order confirmation page here</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              disabled={status === "processing"}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Card Details</label>
            <div className="stripe-element-container">
              <CardElement className="stripe-element-card"
                onChange={handleCardChange}
              />
            </div>
          </div>

          {errorMessage && (
            <div className={styles.error}>{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={!stripe || status === "processing" || !cardComplete}
            className={styles.button}
          >
            {status === "processing" ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}
    </div>
  );
}

StripeForm.propTypes = {
  userId: PropTypes.string,
  email: PropTypes.string.isRequired,
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  shippingAddress: PropTypes.string.isRequired,
};

export default function PaymentForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <StripeForm {...props} />
    </Elements>
  );
}