import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/admin/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        toast.error(err.message || 'Could not fetch admin orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ order_status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      const updated = await res.json();
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, order_status: updated.order_status } : order
        )
      );
      toast.success("Order updated!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.order_status === statusFilter);

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>

      <label>
        Filter by status:{" "}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </label>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        filteredOrders.map(order => (
          <div key={order.order_id} className="order-card">
            <h3>Order #{order.order_id}</h3>
            <p><strong>User:</strong> {order.user_name} ({order.email})</p>
            <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
            <p><strong>Tracking #:</strong> {order.tracking_number || "N/A"}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Payment Status:</strong> {order.payment_status || "Not Set"}</p>

            <label>
              <strong>Status:</strong>{" "}
              <select
                value={order.order_status}
                onChange={e => handleStatusChange(order.order_id, e.target.value)}
              >
                <option value="created">Created</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </label>

            <h4>Items:</h4>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.artist} - {item.description} (${item.price} x {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;

