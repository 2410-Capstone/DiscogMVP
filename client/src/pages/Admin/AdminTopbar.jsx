import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/default-profile.png";

const AdminTopbar = () => {
  const navigate = useNavigate();

  return (
    <header className="admin-topbar">
      <h1 className="admin-header-title">Dashboard</h1>
      <div className="admin-header-tools">
        <button
          className="back-to-user-btn"
          onClick={() => navigate("/home")}
        >
          ← Back to User View
        </button>
        <input type="text" placeholder="Search..." className="admin-search" />
        <img src={defaultProfilePic} alt="Admin" className="admin-avatar" />
      </div>
    </header>
  );
};

export default AdminTopbar;
