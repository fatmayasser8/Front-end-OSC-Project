import userImg from "../../assets/user-img.jpg";
import "../../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { isAuthenticated } from "../../utils/auth";

function Navbar({ onMenuClick, onMapClick, showMap })  {
const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user") || "{}");
const profileImage = user?.userImage || userImg;

const showLoginPrompt = (action) => {
  Swal.fire({
    title: "Join NOVA",
    text: `You need an account to ${action}.`,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Create Account",
    cancelButtonText: "Maybe Later",
    background: "#111",
    color: "#fff",
    confirmButtonColor: "#d4af37",
    cancelButtonColor: "#333",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/register");
    }
  });
};

const handleProfileClick = () => {
  if (!isAuthenticated()) {
    showLoginPrompt("view your profile");
    return;
  }
  navigate("/profile");
};

  return (
<nav className="fixed left-0 top-0 z-[1050] h-[70px] w-full border-b-2 border-[#d4af37] bg-black lg:relative p-3">
      
  <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:justify-end lg:px-8">

        {/* Mobile Logo + Toggle */}
       <div className="flex items-center gap-4 lg:hidden">

          <button
            type="button"
            onClick={onMenuClick}
            className="text-2xl text-[#d4af37]"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="flex items-center text-2xl font-bold text-[#d4af37]">
            <i className="fa-solid fa-house-chimney mr-2"></i>
            NOVA
          </div>

        </div>

        {/* Navbar Icons */}
<div className="nav-icons flex items-center gap-3 sm:gap-4">

      <button
        type="button"
        onClick={onMapClick}
        className="mapBtn sm:gap-2 sm:px-3 sm:py-2 sm:text-sm md:px-[15px]"
      >
        <i className="fa-regular fa-map text-base sm:text-lg md:text-xl"></i>
        <span>{showMap ? "Hide Map" : "Show Map"}</span>
      </button>

<button
  type="button"
  onClick={handleProfileClick}
  className="h-8 w-8 overflow-hidden btn-pic border-2 border-[#d4af37] sm:h-9 sm:w-9 md:h-10 md:w-10"
>
  <img
    src={profileImage}
    alt="User"
    className="h-full w-full object-cover"
  />
</button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;