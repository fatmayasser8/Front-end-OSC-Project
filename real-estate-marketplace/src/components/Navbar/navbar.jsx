import "../../styles/Navbar.css";
import userImg from "../../assets/user-img.jpg";


function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-icons d-flex align-items-center gap-3">

<button className="mapBtn">
  <i className="fa-regular fa-map"></i>
  Show Map
</button>

          <i className="fa-solid fa-bell"></i>

          <div className="img-outer">
         <img src={userImg} alt="userImg" />
          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;