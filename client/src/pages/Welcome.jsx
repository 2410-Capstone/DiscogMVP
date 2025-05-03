import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WelcomeHeader from "../components/WelcomeHeader";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        navigate("/home");
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [navigate]);

  return (
    <div className="welcome-page">
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
