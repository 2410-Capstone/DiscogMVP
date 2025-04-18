import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useTheme } from "../utils/useTheme";
import cartImg from "../assets/bag.png";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar"; // ✅ Make sure this path is correct

function Navbar({ isAuthenticated, setUser, setToken, onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  // const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    navigate("/");
  };

  const isOnMainPage = location.pathname === "/";

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
                <button
              className="nav-button"
              onClick={() => setShowSearch((prev) => !prev)}
              aria-label="Toggle Search"
            >
              <Search size={20} />
            </button>
                <Link to="/login" className="nav-button">Login</Link>
                <Link to="/register" className="nav-button">Register</Link>
                <Link to="/cart" className="nav-button">
                  <img src={cartImg} alt="Cart" className="cart-icon" />
                </Link>
              </>
            )}

      

            {/* <button className="nav-button" onClick={toggleTheme}>
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </button> */}
          </div>
        </div>
      </nav>

      {showSearch && (
        <div className="search-overlay" ref={searchRef}>
          <SearchBar onSearch={onSearch} />
          <button className="close-search" onClick={() => setShowSearch(false)}>✕</button>
        </div>
      )}
    </>
  );
}

export default Navbar;
