import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WelcomeHeader from "../components/WelcomeHeader";

const Welcome = () => {
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        navigate("/home");
      }
    };

    window.addEventListener("keydown", handleEnter);
    const timer = setTimeout(() => setAnimateIn(false), 800); // match animation duration

    return () => {
      window.removeEventListener("keydown", handleEnter);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className={`welcome-page ${animateIn ? "disney-animate-in" : ""}`}>
      <WelcomeHeader />
      <div className="continue-button-container">
        <div className="continue-button">
          <Link to="/home">Continue</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
