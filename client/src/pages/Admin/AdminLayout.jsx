import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = ({ user }) => {
  return (
    <div className="admin-console">
      <AdminSidebar user={user} />
      <div className="admin-content">
        <AdminTopbar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
