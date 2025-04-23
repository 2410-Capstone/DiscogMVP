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
      toast.success("Order status updated!");
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
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>User</th>
              <th>Email</th>
              <th>Total</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Tracking #</th>
              <th>Shipping Address</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_name}</td>
                <td>{order.email}</td>
                <td>${Number(order.total || 0).toFixed(2)}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{order.payment_status || "N/A"}</td>
                <td>
                  <select
                    value={order.order_status}
                    onChange={e => handleStatusChange(order.order_id, e.target.value)}
                  >
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td>{order.tracking_number || "N/A"}</td>
                <td>{order.shipping_address}</td>
                <td>
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.artist} - {item.description} (${item.price} x {item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
