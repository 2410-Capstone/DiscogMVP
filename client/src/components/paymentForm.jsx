import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import styles from "../styles/scss/payment_components/_payment_form.module.scss";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function StripeForm({ email, cartItems, shippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [status, setStatus] = useState("default");
  const [emailInput, setEmailInput] = useState(email || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [token, setToken] = useState(null);

  const [userId, setUserId] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      //console.warn("⚠️ No token found in localStorage");
      setIsLoadingUser(false);
      return;
    }

    const payload = parseJwt(storedToken);
    console.log("✅ Decoded JWT payload:", payload);

    const extractedId = payload?.id || payload?.userId;

    if (!extractedId) {
      //console.error("❌ User ID not found in token payload:", payload);
      setErrorMessage("User ID missing in token");
    } else {
      setUserId(extractedId);
      setToken(storedToken);
    }

    setIsLoadingUser(false);
  }, []);

  //had trouble reading the cookie so we are splitting it up and reading it
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("❌ Failed to parse JWT:", err);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    //console.log("📦 Token state:", token);
    console.log("👤 User ID state:", userId);

    e.preventDefault();
    //console.warn("⚠️ handleSubmit ran with missing userId");

    if (!userId) {
      setErrorMessage("User authentication required");
      return;
    }

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

    try {
      const res = await fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          email: emailInput,
          cartItems,
          shippingAddress,
        }),
      });

      const { clientSecret, error: backendError, orderId } = await res.json();

      if (backendError) {
        throw new Error(backendError);
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
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
        }
      );

      if (error) {
        throw error;
      }

      if (paymentIntent.status === "succeeded") {
        setStatus("succeeded");
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/carts/clear`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          });
          //Delete items from local cart after successful checkout. I was clearing it in the backend but not here as well.
          localStorage.removeItem("cart");

          navigate("/order-confirmation", {
            state: {
              orderDetails: {
                cartItems: cartItems,
                shippingAddress: shippingAddress,
                orderNumber: orderId,
                total: cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ),
                email: emailInput,
              },
            },
          });
        } catch (clearErr) {
          console.error("⚠️ Cart clear failed:", clearErr);
        }
        // Rediredt to order conf page goes here
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
    return (
      <div className={styles.loadingMessage}>Loading payment system...</div>
    );
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
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
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
              <CardElement
                className="stripe-element-card"
                onChange={handleCardChange}
              />
            </div>
          </div>

          {errorMessage && <div className={styles.error}>{errorMessage}</div>}

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
  email: PropTypes.string.isRequired,
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
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
