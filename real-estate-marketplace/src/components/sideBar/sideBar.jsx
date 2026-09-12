import "../../styles/Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const response = await fetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Logout Response:", data);
    }
  } catch (error) {
    console.error("Logout Error:", error);
  } finally {
    // Always clear local authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Go to login
    navigate("/auth/login");
  }
};
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

        {/* ده شرط بيخفي الـ Dashboard لو المستخدم buyer أو مش مسجل، ويظهرها للـ admin أو seller */}
{(() => {
  const userRole = localStorage.getItem("role");

  if (!userRole || userRole === "buyer") return null;
   const normalizedRole = userRole ? userRole.toLowerCase().trim() : "";
   console.log("Current userRole from localStorage:", userRole); // ⬅️ زودي دي
   console.log("Chosen dashboardPath:", normalizedRole === "admin" ? "/adminDashboard" : "/sellerDashboard"); // ⬅️ وزودي دي
   const dashboardPath = userRole === "admin" ? "/adminDashboard" : "/sellerDashboard";
   const dashboardName = userRole === "admin" ? "Admin Dashboard" : "Dashboard";

  return (
    <li>
      <Link to={dashboardPath}>
        <i className="fa-solid fa-chart-line"></i>
        <span>{dashboardName}</span>
      </Link>
    </li>
  );
})()}

        <li>
          <Link to="/favorites">
            <i className="fa-regular fa-heart"></i>
            <span>Favorites</span>
          </Link>
        </li>

        <li>
          <Link to="/about">
            <i className="fa-regular fa-message"></i>
            <span>About</span>
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
            <i className="fa-solid fa-circle-user"></i>
            <span>Profile</span>
          </Link>
        </li>

      </ul>

      {/* Logout */}
      <div className="logout">
        <button type="button" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;