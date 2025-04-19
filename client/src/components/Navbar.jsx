import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import cartImg from "../assets/bag.png";

function Navbar({ isAuthenticated, setUser, setToken, onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    navigate("/");
  };

  const isOnMainPage = location.pathname === "/";

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
    setDropdownVisible((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="nav-logo">DiscogMVP</Link>
          </div>

          {!isOnMainPage && (
            <div className="nav-center">
              <Link to="./home" className="nav-button">
                Home
              </Link>
            </div>
          )}

          <div className="nav-right">
            {isAuthenticated ? (
              <>
                <button className="nav-button" onClick={handleLogout}>
                  Logout
                </button>
                <Link to="/account">
                  {/* <img src={profilePic} alt="Profile" className="profile-pic" /> */}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button">Login</Link>
                <Link to="/register" className="nav-button">Register</Link>

                {/* Search Button Positioned Between Login/Register and Cart */}
                <button
                  className="nav-button"
                  onClick={handleSearchClick}
                  aria-label="Toggle Search"
                >
                  <Search size={20} />
                </button>

                <Link to="/cart" className="nav-button">
                  <img src={cartImg} alt="Cart" className="cart-icon" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Dropdown Menu with Search Bar inside */}
      <div
        className={`dropdown ${isDropdownVisible ? 'show' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        {isDropdownVisible && (
          <>
            <SearchBar onSearch={onSearch} />
            <div className="dropdown-links">
              <Link to="/previously-viewed" className="dropdown-link">Previously Viewed</Link>
              <Link to="/order-history" className="dropdown-link">Order History</Link>
              <Link to="/profile" className="dropdown-link">Profile</Link>
              <Link to="/product-search" className="dropdown-link">Product Search</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;
