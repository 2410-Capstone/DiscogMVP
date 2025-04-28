import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const actions = [
  { title: 'Manage Users', path: '/admin/users', description: 'View and edit user accounts' },
  // { title: 'Manage Products', path: '/admin/products', description: 'Create and update products' },
  { title: 'Manage Orders', path: '/admin/orders', description: 'Track and process orders' },
  { title: 'Inventory Management', path: '/admin/inventory', description: 'Monitor product stock levels, create and update products' },
];


const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!res.ok) throw new Error('Failed to fetch admin metrics');
  
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };
  
    fetchMetrics();
  }, []);


  return (
    <div className="admin-dashboard">
    {metrics ? (
        <div className="metrics-table-wrapper">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Users</td>
                <td>{metrics.totalUsers}</td>
              </tr>
              <tr>
                <td>Total Products</td>
                <td>{metrics.totalProducts}</td>
              </tr>
              <tr>
                <td>Total Orders</td>
                <td>{metrics.totalOrders}</td>
              </tr>
              <tr>
                <td>Total Revenue</td>
                <td>${metrics.totalRevenue.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="loading-metrics">Loading metrics...</div>
      )}

      <div className="dashboard-grid">
        {actions.map((action) => (
          <Link to={action.path} className="dashboard-card" key={action.title}>
            <h2>{action.title}</h2>
            <p>{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
