import { NavLink } from "react-router-dom";
import "../styles/landing.css";
import bgImage from "../assets/withLogo.png";

function Landing() {
  return (
    <div className="landing-container" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.23), rgba(0, 0, 0, 0.23)), url(${bgImage})` }}>
      <div className="landing-overlay">
        <h1>NOVA ESTATES</h1>
        <h3>PREMIER LIVING DESTINATIONS</h3>
        <p>Welcome to the Art of Living</p>
        <p>Explore an exclusive portfolio of homes designed for luxury and tranquility.</p>
        <NavLink to="/auth">
          <button>EXPLORING NOW</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Landing;