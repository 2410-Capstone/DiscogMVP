
import { Link, useLocation, useNavigate } from "react-router-dom";
import {  useState, useEffect, useRef } from "react";




function Navbar({ isAuthenticated, setUser, setToken, onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    navigate("/"); 
  };


  const isOnMainPage = location.pathname === "/";
  // const isOnDetailPage = /^\/item\/\d+$/.test(location.pathname); 

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="nav-logo">MVPDiscog</Link>

          </div>

          {!isOnMainPage && (
            <div className="nav-center">
              <Link to="/" className={`nav-button ${isOnMainPage ? "active" : ""}`}>
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
          </div>
        </div>
      </nav>

    </>
  );
}

export default Navbar;
