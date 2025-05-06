import { useTheme } from "../../utils/useTheme";
import { useState, useRef, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu } from "lucide-react";
import defaultProfilePic from "../../assets/default-profile.png";

const AdminTopbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const profileTimeout = useRef(null);

  const toggleProfileDropdown = () => {
    clearTimeout(profileTimeout.current);
    setProfileOpen(prev => !prev);
  };

  const delayedCloseProfile = () => {
    profileTimeout.current = setTimeout(() => setProfileOpen(false), 300);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMobileLinkClick = () => setMobileNavOpen(false);

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={() => setMobileNavOpen(prev => !prev)}>
          <Menu size={24} />
        </button>
        <h1 className="admin-header-title">Dashboard</h1>
      </div>

      <div className="admin-header-tools">
        <button className="back-to-user-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>

        <button
          className="theme-toggle-button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? "☀︎" : "☾"}
        </button>

        <div 
          className="profile-dropdown" 
          onMouseLeave={delayedCloseProfile}
          onMouseEnter={() => clearTimeout(profileTimeout.current)}
        >
          <img
            src={defaultProfilePic}
            alt="Admin"
            className="admin-avatar"
            onClick={toggleProfileDropdown}
          />

          {profileOpen && (
            <div className="profile-dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate("/home")}>
                Home
              </button>
              <button onClick={handleLogout} className="dropdown-item"> 
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="admin-mobile-nav">
          <NavLink to="/admin/dashboard" className="admin-link" onClick={handleMobileLinkClick}>Home</NavLink>
          <NavLink to="/admin/inventory" className="admin-link" onClick={handleMobileLinkClick}>Inventory</NavLink>
          <NavLink to="/admin/orders" className="admin-link" onClick={handleMobileLinkClick}>Orders</NavLink>
          <NavLink to="/admin/users" className="admin-link" onClick={handleMobileLinkClick}>Users</NavLink>
        </div>
      )}
    </header>
  );
};

export default AdminTopbar;
