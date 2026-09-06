import { NavLink } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="landing-container">
      <h1>NOVA ESTATES</h1>

      <h3>PREMIER LIVING DESTINATIONS</h3>

      <p>Welcome to the Art of Living</p>

      <p>
        Explore an exclusive portfolio of homes designed for luxury and tranquility.
      </p>

      <NavLink to="/auth">
        <button>EXPLORING NOW</button>
      </NavLink>
    </div>
  );
}

export default Landing;