import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentForm from '../../components/paymentForm';

const Checkout = () => {
  const { state } = useLocation();
  const [shippingAddress, setShippingAddress] = useState('');
  
  // If it cant load from cart it loads this as fallback
  const cartItems = state?.cartItems || [
    { product_id: 3711, price: 19.99, quantity: 2 }
  ];


  const email = "admin@admin.com";

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0);
  };

  return (
    <div>
      <h1>Checkout</h1>
      
      <div>
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.product_id} >
            <div >
              <img 
                src={`https://img.discogs.com/${item.product_id}-150.jpg`} 
                alt={`Product ${item.product_id}`}
              />
            </div>
            <div>
              <p><strong>Item #{item.product_id}</strong></p>
              <p>${item.price.toFixed(2)} × {item.quantity}</p>
            </div>
          </div>
        ))}
        <div>
          <h4>Total: ${calculateTotal().toFixed(2)}</h4>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Shipping Information</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            readOnly

          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Shipping Address
          </label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="123 Main St, City, Country"
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