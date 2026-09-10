import { NavLink } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="landing-container">
  <img src={require("../assets/withLogo.png")} alt="Nova Estates" className="landing-bg" />
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