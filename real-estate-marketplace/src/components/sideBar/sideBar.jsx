import { useState, useEffect, useRef } from "react";
import "../../styles/Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      navigate("/auth/login");
    }
  };

  return (
    <>

{/* Mobile Header */}
{!isOpen && (
  <div className="fixed left-0 top-0 z-[1100] flex h-[70px] w-[190px] items-center border-b-2 border-[#d4af37] bg-black px-4 md:hidden">
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="text-2xl text-[#d4af37]"
    >
      <i className="fa-solid fa-bars"></i>
    </button>

    <Link
      to="/home"
      className="text-warning ml-4 flex items-center text-2xl font-bold text-[#d4af37]"
    >
      <i className="fa-solid fa-house-chimney mr-2"></i>
      NOVA
    </Link>
  </div>
)}

{/* Dark Overlay */}
{isOpen && (
  <div
    onClick={() => setIsOpen(false)}
    className="fixed inset-0 z-[1100] bg-black/60 md:hidden"
  ></div>
)}

{/* Sidebar */}
<aside
  ref={sidebarRef}
  className={`sidebar
    transition-transform duration-300
max-md:!fixed
max-md:!left-0
max-md:!top-0
max-md:!z-[1200]
max-md:!h-screen
max-md:!w-[210px]
    ${
      isOpen
        ? "max-md:translate-x-0"
        : "max-md:-translate-x-full"
    }`}
>
        {/* Logo */}
<div className="flex items-start">
  <Link
    to="/home"
    className="sidebar-logo text-4xl font-bold text-yellow-500"
    onClick={() => setIsOpen(false)}
  >
    <i className="fa-solid fa-house-chimney"></i>
    NOVA
  </Link>

  <button
    type="button"
    onClick={() => setIsOpen(false)}
    className="ml-auto flex shrink-0 items-center mt-1 text-2xl text-[#d4af37] md:hidden"
  >
    <i className="fa-solid fa-xmark"></i>
  </button>
</div>

        {/* Navigation */}
        <ul className="sidebar-menu">
          <li>
            <Link to="/home" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link
              to="/sellerDashboard"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-regular fa-heart"></i>
              <span>Favorites</span>
            </Link>
          </li>

          <li>
            <Link
              to="/messages"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-regular fa-message"></i>
              <span>Messages</span>
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-regular fa-envelope"></i>
              <span>Contact</span>
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
            >
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
    </>
  );
}

export default Sidebar;