import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/admin/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
        setFilteredItems(data);
      } catch (err) {
        toast.error(err.message || 'Could not fetch admin orders');
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = orders.filter(order =>
      order.user_name?.toLowerCase().includes(term) ||
      order.email?.toLowerCase().includes(term)
    );
    setFilteredItems(results);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
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
      setFilteredItems(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, order_status: updated.order_status } : order
        )
      );
      toast.success("Order status updated!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel order');

      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, order_status: 'cancelled' } : order
        )
      );
      setFilteredItems(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, order_status: 'cancelled' } : order
        )
      );
      toast.success("Order cancelled!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const statusFilteredOrders =
    statusFilter === 'all'
      ? filteredItems
      : filteredItems.filter(order => order.order_status === statusFilter);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="admin-inventory">
      <div className="table-wrapper">
        <div className="table-header">
          <h2>Orders</h2>
        </div>

        <div className="table-controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            ref={searchRef}
            className="admin-search"
            style={{ marginRight: '1rem' }}
          />
        </div>

        <div className="admin-filter">
          <label>
            Filter by status:{' '}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="created">Created</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>User</th>
              <th>Email</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Shipping</th>
              <th>Tracking #</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {statusFilteredOrders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_name}</td>
                <td>{order.email}</td>
                <td>${Number(order.total || 0).toFixed(2)}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                  >
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {(order.order_status === 'created' || order.order_status === 'processing') && (
                    <button
                      onClick={() => cancelOrder(order.order_id)}
                      className="user-delete-btn"
                      style={{ marginTop: '6px' }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
                <td>{order.payment_status || 'N/A'}</td>
                <td>
                  {(() => {
                    try {
                      const addr = JSON.parse(order.shipping_address);
                      return `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.zip}`;
                    } catch {
                      return order.shipping_address;
                    }
                  })()}
                </td>
                <td>{order.tracking_number || 'N/A'}</td>
                <td>
                  <ul>
                    {(order.items || []).map((item, i) => (
                      <li key={i}>
                        {item.artist} - {item.description} (${item.price} × {item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
