import React, { useState } from "react";

const GuestOrderLookup = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/guest?orderId=${orderId}&email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Order not found or email does not match.");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message || "Error fetching order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='guest-order-lookup'>
      <h2>Find Your Order</h2>
      <form onSubmit={handleLookup}>
        <input
          type='text'
          placeholder='Order ID'
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email used at checkout'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit' disabled={loading}>
          {loading ? "Looking up..." : "Find Order"}
        </button>
      </form>
      {error && <div className='error'>{error}</div>}
      {order && (
        <div className='order-details'>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.order_status}</p>
          <p>Total: ${order.total}</p>
        </div>
      )}
    </div>
  );
};

export default GuestOrderLookup;
