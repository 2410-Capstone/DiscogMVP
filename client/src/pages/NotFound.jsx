import React from "react";
import { Link } from "react-router-dom";


const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="error-code">404</h1>
      <p className="error-message">The page you are looking for does not exist.</p>
      <Link to="/" className="home-link">Return Home</Link>
    </div>
  );
};

export default NotFound;
