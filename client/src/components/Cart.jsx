import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscogsImage from './products/DiscogsImage';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/carts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      const formattedItems = data.map(item => ({
        ...item,
        price: parseFloat(item.price) || 0
      }));
      setCartItems(formattedItems);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity, item) => {
    if (newQuantity < 1) {
      const confirmDelete = window.confirm(`Remove "${item.artist}" from cart?`);
      if (!confirmDelete) return;
      return handleRemoveItem(itemId);
    }

    try {
      await fetch(`/api/carts/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      setCartItems(prev =>
        prev.map(it => it.id === itemId ? { ...it, quantity: newQuantity } : it)
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await fetch(`/api/carts/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems,
        cartTotal: calculateTotal(),
        timestamp: Date.now()
      }
    });
  };

  if (isLoading) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <p className="cart-loading">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <h2 className="cart-heading">Shopping cart</h2>
        <div className="full-width-divider" />

        <section className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-image">
                  <DiscogsImage releaseId={item.product_id} />
                </div>
                <div className="item-details">
                  <h3 className="item-title">{item.artist || `Album #${item.product_id}`}</h3>
                  <p>Format: Vinyl</p>
                  <p>Quantity: 
                    <button className="cart_btn cart_btn--minus" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item)}>-</button>
                    <span className="cart_quantity"> {item.quantity} </span>
                    <button className="cart_btn cart_btn--plus" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item)}>+</button>
                  </p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p className="item-subtotal">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
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
