import "../../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <a href="/home" className="sidebar-logo">
        <i className="fa-solid fa-house-chimney"></i>
        NOVA
      </a>

      {/* Navigation */}
      <ul className="sidebar-menu">

        <li>
          <a href="/home">
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </a>
        </li>

        <li>
          <a href="/properties">
            <i className="fa-solid fa-building"></i>
            <span>Properties</span>
          </a>
        </li>

        <li>
          <a href="/favorites">
            <i className="fa-regular fa-heart"></i>
            <span>Favorites</span>
          </a>
        </li>

        <li>
          <a href="/messages">
            <i className="fa-regular fa-message"></i>
            <span>Messages</span>
          </a>
        </li>

        <li>
          <a href="/contact">
            <i className="fa-regular fa-envelope"></i>
            <span>Contact</span>
          </a>
        </li>

      </ul>



      {/* Logout */}
      <div className="logout">
        <a href="/login">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Log out</span>
        </a>
      </div>

    </aside>
  );
}

export default Sidebar;