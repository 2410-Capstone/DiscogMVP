import React, { useEffect, useState } from "react";
// import "../styles/scss/components/UserOrders.module.scss";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>{error}</div>;
  if (orders.length === 0) {
    return (
      <div className="user-orders-container">
        <h2>Order History</h2>
        <p>You haven’t placed any orders yet.</p>
      </div>
    );
  }

  const complete_statuses = ["shipped", "delivered", "cancelled"];
  const incomplete_statuses = ["created", "processing"];
  const order_statuses_map = {
    created: "Created",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const currentOrders = orders.filter((order) => incomplete_statuses.includes(order.order_status));
  const completedOrders = orders.filter((order) => complete_statuses.includes(order.order_status));
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ order_status: "cancelled" }),
      });

      if (!res.ok) throw new Error("Failed to cancel order");
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, order_status: "cancelled" } : order))
      );
    } catch (err) {
      setError(err.message || "Error cancelling order");
    }
  };

  const renderOrder = (order) => (
    <div key={order.id} className="order-card">
      <div className="order-header">
        <p>Order Placed: {formatDate(order.created_at)}</p>
        <p>Total: ${Number(order.total).toFixed(2)}</p>
        <p>Tracking #: {order.tracking_number || "N/A"}</p>
      </div>
  
      <div className="order-summary">
        <p>Status: {order_statuses_map[order.order_status]}</p>
        <p>Updated: {order.updated_at ? formatDate(order.updated_at) : "N/A"}</p>
        <p className={`payment-status ${order.payment_status}`}>
          Payment: {order.payment_status}
        </p>
      </div>
  
      <div className="order-items">
        {order.items?.map((item, index) => (
          <div key={index} className="order-item">
            <img src={item.image_url} alt={item.description} className="item-image" />
            <div className="item-details">
              <p>{item.artist} — {item.description}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
  
      <div className="order-actions">
        {order.order_status === "delivered" && <button>Return Item</button>}
        {(order.order_status === "created" || order.order_status === "processing") && (
          <button onClick={() => handleCancel(order.id)}>Cancel Order</button>
        )}
      </div>
    </div>
  );
  

  return (
    <div className="user-orders-container">
      <h2>Current Orders</h2>
      {currentOrders.length > 0 ? (
        <ul className="user-orders-list">
          {currentOrders.map(renderOrder)}
        </ul>
      ) : (
        <p>No current orders found</p>
      )}

      <h2>Order History</h2>
      {completedOrders.length > 0 ? (
        <ul className="user-orders-history">
          {completedOrders.map(renderOrder)}
        </ul>
      ) : (
        <p>No completed orders found</p>
      )}
    </div>
  );
};

export default UserOrders;
