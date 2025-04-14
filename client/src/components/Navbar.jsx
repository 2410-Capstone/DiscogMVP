import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../utils/useTheme";

function Navbar({ isAuthenticated, setUser, setToken, onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
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
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">DiscogMVP</Link>
        </div>

        {!isOnMainPage && (
          <div className="nav-center">
            <Link to="/" className="nav-button">
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
            </>
          )}

          {/* <button className="nav-button" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
