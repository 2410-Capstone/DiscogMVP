import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentForm from "../../components/paymentForm";
import DiscogsImage from "../../components/products/DiscogsImage";
import { getGuestCart, getCartFromCookies } from "../../utils/cart";
import { AuthContext } from "../../context/AuthContext";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
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

  const isShippingComplete = (
    shippingName.trim() &&
    addressLine1.trim() &&
    city.trim() &&
    shippingState.trim() &&
    zip.trim() &&
    (isGuest ? guestEmail.trim() : true) // If guest, require email. If logged in, ignore
  );
  

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

  if (!isLoading && (!Array.isArray(cartItems) || cartItems.length === 0)) {
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
        
        {/* CONNOR IM SORRY FOR ADDING THIS - SYDNEY */}
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
                  <div className="shipping-fields">
                    <div className="shipping-name">
                      <label htmlFor="shipping-name">Full Name</label>
                      <input
                        id="shipping-name"
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="shipping-address-line1">
                      <label htmlFor="address-line1">Address Line 1</label>
                      <input
                        id="address-line1"
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="1234 Fake St"
                        required
                      />
                    </div>

                    <div className="shipping-address-line2">
                      <label htmlFor="address-line2">Address Line 2 (Optional)</label>
                      <input
                        id="address-line2"
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Apt 101"
                      />
                    </div>

                    <div className="shipping-city">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>

                    <div className="shipping-state">
                      <label htmlFor="state">State</label>
                      <input
                        id="state"
                        type="text"
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>

                    <div className="shipping-zip">
                      <label htmlFor="zip">Zip Code</label>
                      <input
                        id="zip"
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>

                    <div className="shipping-phone">
                      <label htmlFor="phone">Phone Number (Optional)</label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>


                  <button
                    onClick={handleShippingContinue}
                    className='continue-btn'
                    disabled={!isShippingComplete}
                    style={{
                      opacity: isShippingComplete ? 1 : 0.5,
                      cursor: isShippingComplete ? 'pointer' : 'not-allowed'
                    }}
                  >
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
                  shippingInfo={shippingInfo}
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
