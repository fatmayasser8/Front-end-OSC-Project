import "../../styles/Favorites.css";
import { Link } from "react-router-dom";
function Favorites() {
  return (
    <div className="favorites-page">

      {/* ================= Back Button ================= */}
      <Link to="/home" className="favorites-back">
        <i className="fa-solid fa-arrow-left"></i>
        Back to Home
      </Link>


      {/* ================= Header ================= */}
<div className="favorites-header">

  <div>
<div className="d-flex align-items-center gap-2">
  <i className="fa-solid fa-heart fs-3 text-warning"></i>
    <h1>My Favorites</h1>
</div>
    <p>Properties you've saved for later.</p>
  </div>

  <div className="favorites-counter">
    <span>Favorites</span>
    <strong>0</strong>
  </div>

</div>

      {/* ================= Empty State ================= */}
      <div className="favorites-empty">

        <div className="empty-icon">
          <i className="fa-regular fa-heart"></i>
        </div>

        <h2>No Favorites Yet</h2>

        <p>
          You haven't saved any properties yet.
          <br />
          Start exploring and save properties you love
          to find them here.
        </p>

        <Link to="/home" className="explore-btn">
          <i className="fa-solid fa-compass"></i>
          Explore Properties
        </Link>

      </div>

    </div>
  );
}

export default Favorites;