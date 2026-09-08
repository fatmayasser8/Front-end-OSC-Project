import "../../styles/Sidebar.css";
import { Link } from "react-router-dom";
function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <Link to="/home" className="sidebar-logo">
        <i className="fa-solid fa-house-chimney"></i>
        NOVA
      </Link>

      {/* Navigation */}
      <ul className="sidebar-menu">

        <li>
          <Link to="/home">
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to="/sellerDashboard">
     <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/favorites">
            <i className="fa-regular fa-heart"></i>
            <span>Favorites</span>
          </Link>
        </li>

        <li>
          <Link to="/messages">
            <i className="fa-regular fa-message"></i>
            <span>Messages</span>
          </Link>
        </li>

        <li>
          <Link to="/contact">
            <i className="fa-regular fa-envelope"></i>
            <span>Contact</span>
          </Link>
        </li>

      <li>
          <Link to="/profile">
          <i class="fa-solid fa-circle-user"></i>
            <span>Profile</span>
          </Link>
        </li>


      </ul>



      {/* Logout */}
      <div className="logout">
        <Link to="/login">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Log out</span>
        </Link>
      </div>

    </aside>
  );
}

export default Sidebar;