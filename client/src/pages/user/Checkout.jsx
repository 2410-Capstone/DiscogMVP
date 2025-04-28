import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentForm from "../../components/paymentForm";
import DiscogsImage from "../../components/products/DiscogsImage";
import { getGuestCart, getCartFromCookies } from "../../utils/cart"; // <-- Make sure these are implemented

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState("shipping");
  const [guestEmail, setGuestEmail] = useState("");

  const isGuest = !localStorage.getItem("token");

  useEffect(() => {
    let items = state?.cartItems;
    if (!items || !Array.isArray(items) || items.length === 0) {
      // Try cookies (for logged-in users)
      items = getCartFromCookies ? getCartFromCookies() : [];
      // If still empty, try guest cart (for guests)
      if (!items || items.length === 0) {
        items = getGuestCart ? getGuestCart() : [];
      }
      // If still empty, redirect
      if (!items || items.length === 0) {
        setError("No cart items found - redirecting to cart");
        navigate("/cart");
        return;
      }
    }
    try {
      setCartItems(items);
      verifyCart(items, state?.cartTotal || calculateTotal(items));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Checkout error:", err);
    }
  }, [state, navigate]);

  const calculateTotal = (items) => {
    return (items || []).reduce((total, item) => total + (Number(item.price) || 0) * (item.quantity || 1), 0);
  };

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
    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address.");
      return;
    }
    setCurrentStep("payment");
  };

  if (error) {
    return (
      <div className='error-message'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading your cart...</div>;
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className='error-message'>
        <h2>No items in cart</h2>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className='checkout-page'>
      <div className='checkout-wrapper'>
        {/* Title */}
        <section className='checkout-section'>
          <h1 className='checkout-title'>Checkout</h1>
        </section>

        <div className='full-width-divider' />

        {/* Order Summary */}
        <section className='checkout-section'>
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.product_id || item.id} className='cart-item'>
              <div className='item-image'>{/* <DiscogsImage releaseId={item.product_id || item.id} /> */}</div>
              <div className='item-details'>
                <p>
                  <strong>Item #{item.product_id || item.id}</strong>
                </p>
                <p>
                  ${Number(item.price || 0).toFixed(2)} × {item.quantity || 1}
                </p>
              </div>
            </div>
          ))}
          <div className='order-total'>
            <h4>Total: ${calculateTotal(cartItems).toFixed(2)}</h4>
          </div>
        </section>

        <div className='full-width-divider' />

        {/* Shipping + Payment Flow */}
        <section className='checkout-section'>
          <div className='shipping-form'>
            {currentStep === "shipping" && (
              <>
                <h3>Shipping Information</h3>
                {isGuest && (
                  <div className='shipping-email'>
                    <label htmlFor='checkout-email'>Email required for guest</label>
                    <input
                      id='checkout-email'
                      type='email'
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder='you@email.com'
                      required
                    />
                  </div>
                )}
                <div className='shipping-address'>
                  <label htmlFor='shipping-address'>Shipping Address</label>
                  <input
                    id='shipping-address'
                    type='text'
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder='1234 Fake Ln'
                    required
                  />
                </div>

                <button onClick={handleShippingContinue} className='continue-btn'>
                  Continue to Payment
                </button>
              </>
            )}

            {currentStep === "payment" && (
              <>
                <h3>Payment Information</h3>
                <div className='payment-form-wrapper'>
                  <PaymentForm
                    cartItems={cartItems}
                    shippingAddress={shippingAddress}
                    email={isGuest ? guestEmail : localStorage.getItem("userEmail") || ""}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
