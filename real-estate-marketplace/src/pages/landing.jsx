import { NavLink } from "react-router-dom";
import "../styles/landing.css";
import logo from "../assets/withLogo.png";
function Landing(){
    return(
        <div className="landing-container">
            <img src={logo} alt="" />
             <h1>NOVA ESTATES</h1>

             <h3>PREMIER LIVING DESTINATIONS</h3>

            <p>Welcome to the Art of Living</p>

            <p>Explore an exclusive portfolio of homes designed for luxury and tranquility.</p>
            <NavLink to="/login">
            <button>EXPLORING NOW</button>
            </NavLink> 

        </div>

    );
}
export default Landing;