import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../../components/paymentForm';
import { getGuestCart, getCartFromCookies } from '../../utils/cart';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('shipping');
  const [guestEmail, setGuestEmail] = useState('');
  const [shippingName, setShippingName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const isGuest = !localStorage.getItem('token');

  useEffect(() => {
    const fetchCartItems = async () => {
      let items = state?.cartItems;
      if (!items || !Array.isArray(items) || items.length === 0) {
        if (!isGuest) {
          try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/carts`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            });
            const data = await res.json();
            setCartItems(Array.isArray(data) ? data : []);
            setIsLoading(false);
          } catch (err) {
            setError('Could not load cart from server.');
            setIsLoading(false);
          }
        }
        items = getCartFromCookies() ? getCartFromCookies() : [];
        if (!items || items.length === 0) {
          items = getGuestCart ? getGuestCart() : [];
        }
        if (!items || items.length === 0) {
          setError('No cart items found - redirecting to cart');
          navigate('/cart');
          return;
        }
      }
      try {
        setCartItems(items);
        verifyCart(items, state?.cartTotal || calculateTotal(items));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        console.error('Checkout error:', err);
      }
    };

    fetchCartItems();
  }, [state, navigate, isGuest]);

  const calculateTotal = (items) =>
    (items || []).reduce((total, item) => total + (Number(item.price) || 0) * (item.quantity || 1), 0);

  const verifyCart = (items, expectedTotal) => {
    const actualTotal = calculateTotal(items);
    if (expectedTotal !== undefined && Math.abs(actualTotal - expectedTotal) > 0.01) {
      console.warn(`Cart total mismatch! Expected: ${expectedTotal}, Actual: ${actualTotal}`);
    }
  };

  const handleShippingContinue = () => {
    if (isGuest && !guestEmail.trim()) {
      alert('Please enter your email address.');
      return;
    }
    if (!shippingName.trim() || !addressLine1.trim() || !city.trim() || !shippingState.trim() || !zip.trim()) {
      alert('Please complete all required shipping fields.');
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError('Zip Code must be a 5-digit number.');
      return;
    }
    if (phone && !/^\d{10,15}$/.test(phone)) {
      setError('Phone number must be 10-15 digits (numbers only).');
      return;
    }
    setCurrentStep('payment');
  };

  const shippingInfo = {
    name: shippingName,
    addressLine1,
    addressLine2,
    city,
    state: shippingState,
    zip,
    phone,
    email: isGuest ? guestEmail : localStorage.getItem('userEmail') || '',
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
      <div className='error-message'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/cart')}>Back to Cart</button>
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
        <button onClick={() => navigate('/cart')}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className='checkout-page'>
      <div className='checkout-container'>
        <div className='checkout-header'>
          <h1 className='checkout-title'>Checkout</h1>

          <button className='order-summary-toggle' onClick={() => setShowSummary(true)}>
            Show Order Summary: ${calculateTotal(cartItems).toFixed(2)}
          </button>
        </div>
        <div className='full-width-divider' />

        <h2 className='checkout-subtitle'>Where are we sending your order?</h2>
        {showSummary && (
          <div className='summary-overlay' onClick={() => setShowSummary(false)}>
            <div className='order-summary-panel' onClick={(e) => e.stopPropagation()}>
              <div className='summary-box'>
                <div className='summary-header'>
                  <h4 className='summary-title'>Your Order Total</h4>
                  <div className='summary-items-row'>
                    <span className='summary-items'>{cartItems.length} item(s)</span>
                    <a href='/cart' className='edit-link'>
                      Edit bag
                    </a>
                  </div>
                </div>

                <div className='summary-divider' />
                <div className='summary-line'>
                  <span>Items Subtotal</span>
                  <span>${calculateTotal(cartItems).toFixed(2)}</span>
                </div>
                <div className='summary-line muted'>
                  <span>Shipping</span>
                  <span>TBD</span>
                </div>
                <div className='summary-line muted'>
                  <span>Tax</span>
                  <span>TBD</span>
                </div>
                <div className='summary-total'>
                  <span>Order total</span>
                  <strong>${calculateTotal(cartItems).toFixed(2)}</strong>
                </div>
              </div>
              <button className='close-summary' onClick={() => setShowSummary(false)}>
                ✕
              </button>
            </div>
          </div>
        )}

        <div className='checkout-content'>
          {currentStep === 'shipping' && (
            <div className='form-wrapper'>
              <section className='shipping-address'>
                <h3>Enter your name and address:</h3>

                <div className='edit-user-form-group'>
                  <label>Full Name</label>
                  <input type='text' value={shippingName} onChange={(e) => setShippingName(e.target.value)} />
                </div>

                <div className='form-group'>
                  <label>Street Address</label>
                  <input type='text' value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                </div>

                <div className='form-group'>
                  <label>Apt, Suite, Building (Optional)</label>
                  <input type='text' value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                </div>

                <div className='form-inline'>
                  <div className='form-group'>
                    <label>Zip Code</label>
                    <input
                      type='text'
                      value={zip}
                      maxLength={5}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div className='form-group'>
                    <label>City</label>
                    <input type='text' value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className='form-group'>
                    <label>State</label>
                    <input type='text' value={shippingState} onChange={(e) => setShippingState(e.target.value)} />
                  </div>
                </div>

                {isGuest && (
                  <>
                    <h2 className='checkout-subtitle-2'>How should we contact you?</h2>
                    <div className='form-group'>
                      <label htmlFor='guestEmail'>Email Address</label>
                      <input
                        id='guestEmail'
                        type='email'
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>

                    <div className='form-group'>
                      <label>Phone Number (optional)</label>
                      <input
                        type='tel'
                        value={phone}
                        maxLength={15}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </>
                )}
              </section>

              <div className='full-width-divider-2' />

              <button className='continue-btn' onClick={handleShippingContinue} disabled={!isShippingComplete}>
                Continue to Payment
              </button>
            </div>
          )}
          {currentStep === 'payment' && (
            <section className='payment-info'>
              <h3>How do you want to pay?</h3>
              <div className='payment-options'>
                <div className='payment-card selected'>
                  <div className='label'>Credit or Debit Card</div>
                  <div className='details'>
                    Secure checkout powered by Stripe.
                    <br />
                    Supports Visa, Mastercard, AMEX, and more.
                  </div>
                </div>
                <div className='payment-form-wrapper'>
                  <PaymentForm cartItems={cartItems} shippingInfo={shippingInfo} />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
