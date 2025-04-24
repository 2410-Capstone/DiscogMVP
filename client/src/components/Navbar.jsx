import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import cartImg from "../assets/bag.png";
import defaultProfilePic from "../assets/default-profile.png";

function Navbar({ isAuthenticated, setUser, setToken, onSearch, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileRef = useRef(null);

  const isOnMainPage = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    navigate("/");
  };

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
    setDropdownVisible((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible((prev) => !prev);
  };

  // Close profile dropdown on outside click
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
            <Link to="/" className="nav-logo">DiscogMVP</Link>
          </div>

          {!isOnMainPage && (
            <div className="nav-center">
              <Link to="/home" className="nav-button">Home</Link>
            </div>
          )}

          <div className="nav-right">
            <button className="nav-button" onClick={toggleSearch} aria-label="Toggle Search">
              <Search size={20} />
            </button>

            {isAuthenticated && (
              <Link to="/cart" className="nav-button">
                <img src={cartImg} alt="Cart" className="cart-icon" />
              </Link>
            )}

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
                    <Link to="/order-history" className="dropdown-link">Order History</Link>
                    {user?.user_role === "admin" && (
                      <Link to="/admin/dashboard" className="dropdown-link">Admin Dashboard</Link>
                    )}
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
