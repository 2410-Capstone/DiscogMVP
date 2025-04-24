import React from 'react';
import { useNavigate } from 'react-router-dom';
import DiscogsImage from './products/DiscogsImage';

const Cart = () => {
  const navigate = useNavigate();

  const cartItems = [
    { product_id: 1, price: 19.87, quantity: 2 },
    { product_id: 61, price: 18.02, quantity: 3 },
    { product_id: 48, price: 34.95, quantity: 1 }
  ];

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems: [...cartItems],
        cartTotal: calculateTotal(),
        timestamp: Date.now()
      }
    });
  };

  return (
    <main className="cart-page">
      <div className="cart-container">

       
        <section className="cart-items">
          <h2 className="cart-heading">Shopping cart</h2>

          {cartItems.map((item) => (
            <div className="cart-item" key={item.product_id}>
              <div className="item-image">
                <DiscogsImage releaseId={item.product_id} />
              </div>
              <div className="item-details">
                <h3 className="item-title">Album #{item.product_id}</h3>
                <p>Format: Vinyl</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p className="item-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button className="remove-btn">Remove</button>
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <div className="summary-box">
            <h3 className="summary-heading">Order Summary</h3>

            <div className="summary-line">
              <span>Item(s) Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
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
              <span>Total</span>
              <strong>${calculateTotal().toFixed(2)}</strong>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </aside>

      </div>
    </main>
  );
};

export default Cart;
