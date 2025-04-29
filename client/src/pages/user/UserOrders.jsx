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
  if (orders.length === 0) return <div>No orders found</div>;

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

  return (
    <div className='user-orders-container'>
      <h2>Current Orders</h2>
      {currentOrders.length > 0 ? (
        <ul className='user-orders-list'>
          {currentOrders.map((order) => (
            <li key={order.id}>
              <h3>Order ID: {order.id}</h3>
              <p>Status: {order_statuses_map[order.order_status]}</p>
              <p>Total: ${Number(order.total).toFixed(2)}</p>
              <p
                style={{
                  color:
                    order.payment_status === "failed"
                      ? "red"
                      : order.payment_status === "paid"
                      ? "green"
                      : "inherit",
                }}
              >
                Payment: {order.payment_status}
              </p>
              {(order.order_status === "created" || order.order_status === "processing") && (
                <button onClick={() => handleCancel(order.id)}>Cancel Order</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No current orders found</p>
      )}

      <h2>Order History</h2>
      {completedOrders.length > 0 ? (
        <ul>
          {completedOrders.map((order) => (
          
            <li key={order.id}>
              <h3>Order ID: {order.id}</h3>
              <p>Status: {order_statuses_map[order.order_status]}</p>
              <p>Total: ${Number(order.total).toFixed(2)}</p>
              <p
                style={{
                  color:
                    order.payment_status === "failed"
                      ? "red"
                      : order.payment_status === "paid"
                      ? "green"
                      : "inherit",
                }}
              >
                Payment: {order.payment_status}
              </p>
              <p>
                Placed: {new Date(order.created_at).toLocaleDateString()} - Shipped:{" "}
                {order.tracking_number ? new Date(order.updated_at).toLocaleDateString() : "Not shipped yet"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed orders found</p>
      )}
    </div>
  );
};

export default UserOrders;
