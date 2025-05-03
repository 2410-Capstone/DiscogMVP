import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: "cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      setError(err.message || "Error cancelling order");
      toast.error("Failed to cancel order.");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const complete_statuses = ["shipped", "delivered", "cancelled"];
  const incomplete_statuses = ["created", "processing"];
  const order_statuses_map = {
    created: "Created",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const renderTable = (orders) => (
    <table className="user-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
          <th>Tracking #</th>
          <th>Updated</th>
          <th>Payment</th>
          <th>Items</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{formatDate(order.created_at)}</td>
            <td>{order_statuses_map[order.order_status]}</td>
            <td>${Number(order.total).toFixed(2)}</td>
            <td>{order.tracking_number || "N/A"}</td>
            <td>{order.updated_at ? formatDate(order.updated_at) : "N/A"}</td>
            <td className={`payment-status ${order.payment_status}`}>{order.payment_status}</td>
            <td>
              <ul>
                {(order.items || []).map((item, index) => (
                  <li key={index}>
                    {item.artist} — {item.description} (Qty: {item.quantity})
                  </li>
                ))}
              </ul>
            </td>
            <td>
              {(order.order_status === "created" || order.order_status === "processing") && (
                <button onClick={() => handleCancel(order.id)}>Cancel</button>
              )}
              {order.order_status === "delivered" && <button>Return</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>{error}</div>;

  const currentOrders = orders.filter((order) =>
    incomplete_statuses.includes(order.order_status)
  );
  const completedOrders = orders.filter((order) =>
    complete_statuses.includes(order.order_status)
  );

  return (
    <div className="user-orders-container">
      <h2>Current Orders</h2>
      {currentOrders.length > 0 ? (
        renderTable(currentOrders)
      ) : (
        <p>No current orders found</p>
      )}

      <h2>Order History</h2>
      {completedOrders.length > 0 ? (
        renderTable(completedOrders)
      ) : (
        <p>No completed orders found</p>
      )}
    </div>
  );
};

export default UserOrders;
