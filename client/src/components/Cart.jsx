import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import DiscogsImage from './products/DiscogsImage'; // Uncomment when using

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

  /*
  this was never used but maybe will be needed?
  const handleAddToCart = async (productId) => {
    try {
      await fetch('/api/carts/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });
      await fetchCart();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  }; */

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

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems,
        cartTotal: calculateTotal()
      }
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0; 
      return total + (price * item.quantity);
    }, 0);
  };

  if (isLoading) return <div className="cart_loading">Loading cart...</div>;

  return (
    <div className="cart">
      <h1 className="cart_title">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="cart_empty">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart_item" key={item.id}>
              <div className="cart_image">
                {/* <DiscogsImage releaseId={item.product_id} /> */}
              </div>
              <div className="cart_details">
                <p className="cart_product-name">Product: {item.artist}</p>
                <p className="cart_price">Price: ${item.price.toFixed(2)}</p>
                <div className="cart_controls">
                  <button 
                    className="cart_btn cart_btn--minus"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item)}
                  >
                    -
                  </button>
                  <span className="cart_quantity">{item.quantity}</span>
                  <button 
                    className="cart_btn cart_btn--plus"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item)}
                  >
                    +
                  </button>
                  <button 
                    className="cart_btn cart_btn--remove"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart_total">
            <strong>Total: ${calculateTotal().toFixed(2)}</strong>
          </div>
          <button className="cart_checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
