import React from 'react';
import { Link } from 'react-router-dom';

const actions = [
  { title: 'Manage Users', path: '/admin/users', description: 'View and edit user accounts' },
  { title: 'Manage Products', path: '/admin/products', description: 'Create and update products' },
  { title: 'Manage Orders', path: '/admin/orders', description: 'Track and process orders' },
  { title: 'Inventory Overview', path: '/admin/inventory', description: 'Monitor product stock levels' },
];

const Dashboard = () => {
  return (
    <div className="admin-dashboard">

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
