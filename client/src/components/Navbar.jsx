import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../utils/useTheme";
import SearchBar from "./SearchBar";
import defaultProfilePic from "../assets/default-profile.png";

function Navbar({ isAuthenticated, onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const isOnMainPage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
    setDropdownVisible((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const content = document.querySelector(".page-content");
    if (content) {
      content.classList.toggle("blurred", isSearchVisible);
      document.body.style.overflow = isSearchVisible ? "hidden" : "auto";
    }
  }, [isSearchVisible]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/home" className="nav-logo">DiscogMVP</Link>
          </div>

          <div className="nav-right">
            <button className="nav-button-search-icon" onClick={toggleSearch} aria-label="Toggle Search">
              <Search size={16} />
            </button>

            <Link to="/cart" className="nav-button" aria-label="Cart">
            <ShoppingBag size={24} strokeWidth={1.5} className="cart-icon" />

            </Link>


            {isAuthenticated ? (
              <div className="account-dropdown" ref={profileRef}>
                <img
                  src={user?.profilePic || defaultProfilePic}
                  alt="Profile"
                  className="account-avatar"
                  onClick={toggleProfileDropdown}
                />
                {profileDropdownVisible && (
                  <div className="account-dropdown-menu">
                    <Link to="/account" className="dropdown-link">Account</Link>
                    <Link to="/profile" className="dropdown-link">Profile</Link>
                    <Link to="/account/orders" className="dropdown-link">Order History</Link>
                    {user?.user_role === "admin" && (
                      <Link to="/admin/dashboard" className="dropdown-link">Admin Dashboard</Link>
                    )}
                    <button onClick={toggleTheme} className="dropdown-link">
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button onClick={handleLogout} className="dropdown-link logout-button">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-button">Login</Link>
                <Link to="/register" className="nav-button">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {isSearchVisible && (
        <div className="dropdown show" onMouseLeave={() => setSearchVisible(false)}>
          <SearchBar onSearch={onSearch} />
          <div className="dropdown-links">
            <Link to="/previously-viewed" className="dropdown-link">Previously Viewed</Link>
            <Link to="/product-search" className="dropdown-link">Product Search</Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
