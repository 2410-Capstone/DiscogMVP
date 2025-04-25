import { NavLink } from "react-router-dom";


const AdminSidebar = ({user}) => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-title">{user?.name || "Admin"}</h2>
      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className="admin-link">Home</NavLink>
        <NavLink to="/admin/orders" className="admin-link">Orders</NavLink>
        <NavLink to="/admin/inventory" className="admin-link">Inventory</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
