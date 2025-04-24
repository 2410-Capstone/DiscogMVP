import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../../components/paymentForm';
import DiscogsImage from '../../components/products/DiscogsImage';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state?.cartItems) {
      setError('No cart items found - redirecting to cart');
      navigate('/cart');
      return;
    }

    try {
      setCartItems(state?.cartItems || getCartFromCookies());
      verifyCart(state.cartItems, state.cartTotal);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      console.error('Checkout error:', err);
    }
  }, [state, navigate]);

  const calculateTotal = (items) => {
    return items.reduce((total, item) => 
      total + (item.price * item.quantity), 0);
  };

  const verifyCart = (items, expectedTotal) => {
    const actualTotal = calculateTotal(items);
    if (Math.abs(actualTotal - expectedTotal) > 0.01) { 
      console.warn(`Cart total mismatch! Expected: ${expectedTotal}, Actual: ${actualTotal}`);
      
    }
  };

  const email = "admin@admin.com";

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/cart')}>Back to Cart</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading your cart...</div>;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.product_id} className="cart-item">
            <div className="item-image">
            {/* <DiscogsImage releaseId={item.product_id} /> */}
            </div>
            <div className="item-details">
              <p><strong>Item #{item.product_id}</strong></p>
              <p>${item.price.toFixed(2)} × {item.quantity}</p>
            </div>
          </div>
        ))}
        <div className="order-total">
          <h4>Total: ${calculateTotal(cartItems).toFixed(2)}</h4>
        </div>
      </div>

      <div >
        <h3>Shipping Information</h3>

        <div>
          <label>
            Shipping Address
          </label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="1234 Fake Ln"
            required

          />
        </div>
      </div>

      <PaymentForm
        cartItems={cartItems}
        shippingAddress={shippingAddress}
        email={email}
      />
    </div>
  );
};

export default Checkout;