import React from 'react';
import { useNavigate } from 'react-router-dom';
import DiscogsImage from './products/DiscogsImage';

const Cart = () => {
  const navigate = useNavigate();
  
  // Mock cart data for now, discogsImage works!
  const cartItems = [
    { product_id: 1, price: 19.99, quantity: 2 },
    { product_id: 61, price: 15.99, quantity: 3 },
    { product_id: 48, price: 24.99, quantity: 1 }
  ];


  //once working cartItems should be passed to paymentForm 
  const handleCheckout = () => {
    navigate('/checkout', { 
      state: { cartItems } 
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0);
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.map((item) => (
        <div key={item.product_id}>
          <div >
            <DiscogsImage releaseId={item.product_id} />
          </div>
          <div>
            <p>Product ID: {item.product_id}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}
      <div>
        <strong>Total: ${calculateTotal().toFixed(2)}</strong>
      </div>
      <button 
        onClick={handleCheckout}

      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;