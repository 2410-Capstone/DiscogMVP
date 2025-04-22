import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div>
        <Link to="/admin/users" className="dashboard-buttons">
          Manage Users
        </Link>
        <Link to="/admin/products" className="dashboard-buttons">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="dashboard-buttons">
          Manage Orders
        </Link>
        <Link to="/admin/inventory" className="dashboard-buttons">
          Inventory Overview
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
