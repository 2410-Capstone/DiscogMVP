import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentForm from "../../components/paymentForm";
import DiscogsImage from "../../components/products/DiscogsImage";
import { getGuestCart, getCartFromCookies } from "../../utils/cart";
import { AuthContext } from "../../context/AuthContext";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState("shipping");

  const [guestEmail, setGuestEmail] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const [showRegisterPrompt, setShowRegisterPrompt] = useState(true);
  const [wantsToRegister, setWantsToRegister] = useState(null);

  const { user } = useContext(AuthContext);
  const isGuest = !user;

  useEffect(() => {
    if (wantsToRegister) {
      navigate("/register?from=checkout");
    }
  }, [wantsToRegister, navigate]);

  useEffect(() => {
    let items = null;

    const passedCart = state?.cartItems;
    if (Array.isArray(passedCart) && passedCart.length > 0) {
      items = passedCart;
    } else {
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            items = parsed.map(item => ({
              ...item,
              quantity: item.quantity || 1,
            }));
            console.log("Loaded cart from localStorage:", items);
          }
        } catch (err) {
          console.warn("Failed to parse stored cart:", err);
        }
      }
    }

    if (!items || items.length === 0) {
      items = getCartFromCookies?.() || getGuestCart?.() || [];
    }

    if (!items || items.length === 0) {
      setError("No cart items found - redirecting to cart");
      navigate("/cart");
      return;
    }

    setCartItems(items);
    verifyCart(items, state?.cartTotal || calculateTotal(items));
    setIsLoading(false);
  }, [state, navigate]);

  const calculateTotal = (items) =>
    (items || []).reduce(
      (total, item) => total + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );

  const verifyCart = (items, expectedTotal) => {
    const actualTotal = calculateTotal(items);
    if (expectedTotal !== undefined && Math.abs(actualTotal - expectedTotal) > 0.01) {
      console.warn(`Cart total mismatch! Expected: ${expectedTotal}, Actual: ${actualTotal}`);
    }
  };

  const handleShippingContinue = () => {
    if (isGuest && !guestEmail.trim()) {
      alert("Please enter your email address.");
      return;
    }
    if (!shippingName.trim() || !addressLine1.trim() || !city.trim() || !shippingState.trim() || !zip.trim()) {
      alert("Please complete all required shipping fields.");
      return;
    }
    setCurrentStep("payment");
  };

  const shippingInfo = {
    name: shippingName,
    addressLine1,
    addressLine2,
    city,
    state: shippingState,
    zip,
    phone,
    email: isGuest ? guestEmail : localStorage.getItem("userEmail") || "",
  };

  const isShippingComplete =
    shippingName.trim() &&
    addressLine1.trim() &&
    city.trim() &&
    shippingState.trim() &&
    zip.trim() &&
    (isGuest ? guestEmail.trim() : true);

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading your cart...</div>;
  }

  if (!isLoading && (!Array.isArray(cartItems) || cartItems.length === 0)) {
    return (
      <div className="error-message">
        <h2>No items in cart</h2>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        {!isLoading && isGuest && showRegisterPrompt && wantsToRegister === null && cartItems.length > 0 && (
          <div>
            <p>Would you like to create an account?</p>
            <button
              onClick={() => {
                if (cartItems.length > 0) {
                  localStorage.setItem("cartBeforeRegister", JSON.stringify(cartItems));
                  localStorage.setItem("redirectAfterRegister", "checkout");
                  setWantsToRegister(true);
                } else {
                  alert("Cart is empty — cannot continue to registration.");
                }
              }}
            >
              Yes, sign me up
            </button>
            <button onClick={() => setShowRegisterPrompt(false)}>Continue as guest</button>
          </div>
        )}

        <div className="checkout-container">
          <div className="checkout-header">
            <h1 className="checkout-title">Checkout</h1>
            <button className="order-summary-toggle" onClick={() => setShowSummary(true)}>
              Show Order Summary: ${calculateTotal(cartItems).toFixed(2)}
            </button>
          </div>

          <div className="full-width-divider" />
          <h2 className="checkout-subtitle">Where are we sending your order?</h2>

          {showSummary && (
            <div className="summary-overlay" onClick={() => setShowSummary(false)}>
              <div className="order-summary-panel" onClick={(e) => e.stopPropagation()}>
                <div className="summary-box">
                  <div className="summary-header">
                    <h4 className="summary-title">Your Order Total</h4>
                    <div className="summary-items-row">
                      <span className="summary-items">{cartItems.length} item(s)</span>
                      <a href="/cart" className="edit-link">Edit bag</a>
                    </div>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-line">
                    <span>Items Subtotal</span>
                    <span>${calculateTotal(cartItems).toFixed(2)}</span>
                  </div>
                  <div className="summary-line muted">
                    <span>Shipping</span>
                    <span>TBD</span>
                  </div>
                  <div className="summary-line muted">
                    <span>Tax</span>
                    <span>TBD</span>
                  </div>
                  <div className="summary-total">
                    <span>Order total</span>
                    <strong>${calculateTotal(cartItems).toFixed(2)}</strong>
                  </div>
                </div>
                <button className="close-summary" onClick={() => setShowSummary(false)}>✕</button>
              </div>
            </div>
          )}

          <div className="checkout-content">
            {currentStep === "shipping" && (
              <div className="form-wrapper">
                <section className="shipping-address">
                  <h3>Enter your name and address:</h3>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={shippingName} onChange={(e) => setShippingName(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Street Address</label>
                    <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Apt, Suite, Building (Optional)</label>
                    <input type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                  </div>

                  <div className="form-inline">
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" value={shippingState} onChange={(e) => setShippingState(e.target.value)} />
                    </div>
                  </div>

                  {isGuest && (
                    <>
                      <h2 className="checkout-subtitle-2">How should we contact you?</h2>
                      <div className="form-group">
                        <label htmlFor="guestEmail">Email Address</label>
                        <input
                          id="guestEmail"
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number (optional)</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </>
                  )}
                </section>

                <div className="full-width-divider-2" />

                <button
                  className="continue-btn"
                  onClick={handleShippingContinue}
                  disabled={!isShippingComplete}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {currentStep === "payment" && (
              <section className="payment-info">
                <h3>How do you want to pay?</h3>
                <div className="payment-options">
                  <div className="payment-card selected">
                    <div className="label">Credit or Debit Card</div>
                    <div className="details">
                      Secure checkout powered by Stripe.<br />
                      Supports Visa, Mastercard, AMEX, and more.
                    </div>
                  </div>
                  <div className="payment-form-wrapper">
                    <PaymentForm cartItems={cartItems} shippingInfo={shippingInfo} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

