import { NavLink } from "react-router-dom";


const AdminSidebar = ({user}) => {
  return (
    <aside className="admin-sidebar">
        <header className="admin-header">
        DiscogMVP </header>
    
      <h2 className="admin-title">{user?.name || "Admin"}</h2>
      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className="admin-link">Home</NavLink>
        <NavLink to="/admin/orders" className="admin-link">Orders</NavLink>
        <NavLink to="/admin/inventory" className="admin-link">Inventory</NavLink>
        <NavLink to="/admin/users" className="admin-link">Users</NavLink>
        {/* <NavLink to="/admin/products" className="admin-link">Products</NavLink> */}

      </nav>
    </aside>
  );
};

export default AdminSidebar;
