import { useTheme } from "../../utils/useTheme";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, Search, User } from "lucide-react";
import defaultProfilePic from "../../assets/default-profile.png";

const AdminTopbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();


  const settingsTimeout = useRef(null);
  const profileTimeout = useRef(null);

  const toggleSettingsDropdown = () => {
    clearTimeout(settingsTimeout.current);
    setSettingsOpen(prev => !prev);
  };

  const toggleProfileDropdown = () => {
    clearTimeout(profileTimeout.current);
    setProfileOpen(prev => !prev);
  };

  const delayedCloseSettings = () => {
    settingsTimeout.current = setTimeout(() => setSettingsOpen(false), 300);
  };

  const delayedCloseProfile = () => {
    profileTimeout.current = setTimeout(() => setProfileOpen(false), 300);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };
  
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

        <div className="admin-search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            className="admin-search"
          />
          <Search size={20} className="admin-search-icon" />
        </div>


        <div 
          className="settings-dropdown" 
          onMouseLeave={delayedCloseSettings}
          onMouseEnter={() => clearTimeout(settingsTimeout.current)}
        >
          <button
            onClick={toggleSettingsDropdown}
            className="settings-icon-link"
            aria-label="Admin Settings"
          >
            <Settings size={20} strokeWidth={1.5} />
          </button>

          {settingsOpen && (
            <div className="settings-dropdown-menu">
              <button onClick={toggleTheme} className="dropdown-item">
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <Link to="/admin/settings" className="dropdown-item">
                Settings
              </Link>
            </div>
          )}
        </div>

   
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
              <Link to="/admin/profile" className="dropdown-item">
                <User size={16} /> Profile
              </Link>
              <button className="dropdown-item" onClick={() => navigate("/home")}>
                Home View
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
