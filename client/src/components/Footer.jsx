import React from "react";
import { Link } from "react-router-dom"; 
import { useTheme } from "../utils/useTheme";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  const setTheme = (mode) => {
    if (mode !== theme) toggleTheme();
  };

  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Shop and Learn</h4>
          <div className="footer-links">
            <Link to="/home">All Products</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <div className="footer-links">
            <Link to="/account">Manage Account</Link>
            <Link to="/account/orders">Order History</Link>
            <Link to="/account/saved">Saved Albums</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <div className="footer-links">
            <Link to="/contact">Contact Us</Link>
            {/* <Link to="/faq">FAQ</Link>  Maybe? */}
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <div className="footer-links">  
            {/* <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link> */}
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>

  
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DiscogMVP. All rights reserved.</p>
{/* 
        <div className="theme-toggle-links">
          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <span className="separator">|</span>
          <button
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
