import WelcomeHeader from "../components/WelcomeHeader";
import { Link } from "react-router-dom";




const Welcome = () => {
  return (
    <div className="welcome-page">
      <WelcomeHeader />
      
      <div className="continue-button-container">
       <div className= "continue-button" ><Link to="/home">Continue</Link></div>
      </div>
    </div>
  );
};

export default Welcome;

