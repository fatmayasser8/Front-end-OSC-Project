import { useEffect, useState } from "react";
import userImg from "../../assets/user-img.jpg";
import "../../styles/Profile.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

function PublicProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPublicProfile = async () => {
    try {
      setLoading(true);
      setError("");

     
      const response = await apiFetch(
        `https://real-estate-market-place-api.vercel.app/api/v1/users/${id}/profile`,
        { method: "GET" }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/auth/login");
          return;
        }
        if (response.status === 404) {
          throw new Error("This user was not found.");
        }
        throw new Error(result.message || "Failed to load this profile");
      }

      console.log("Public Profile Response:", result);


      setUser(result.data?.user ?? result.data);
    } catch (err) {
      console.error("Public profile error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPublicProfile();
    }
  }, [id]);

  // ================= Loading =================
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // ================= Error =================
  if (error) {
    return (
      <div className="profile-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <h2>Unable to load profile</h2>
        <p>{error}</p>

        <button onClick={getPublicProfile}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="profile-page min-h-screen bg-[#111] text-white">

      {/* ================= Header ================= */}
      <section
        className="
          upper-profile
          relative
          min-h-[330px]
          sm:min-h-[300px]
          lg:min-h-[250px]
          bg-cover
          bg-center
          flex
          items-end
          mb-[10px]
        "
      >

        <Link
          to="/home"
          className="
            profile-back
            absolute
            top-4
            left-4
            sm:top-5
            sm:left-6
            lg:left-[30px]
            flex
            items-center
            gap-2
            text-[#aaa]
            no-underline
            text-xs
            sm:text-[13px]
            z-10
            transition
            hover:text-[#d4af37]
          "
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back
        </Link>

        <div
          className="
            wrapper
            w-full
            px-4
            pb-6
            sm:px-6
            sm:pb-7
            lg:px-10
            lg:pb-[25px]
            flex
            flex-col
            items-center
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-start
          "
        >
          <div className="left-profile flex flex-row items-center gap-3 sm:gap-[18px] w-full text-left">

            <div
              className="
                profile-pic
                w-[68px]
                h-[68px]
                sm:w-[95px]
                sm:h-[95px]
                shrink-0
                rounded-full
                overflow-hidden
                border-[2px]
                sm:border-[3px]
                border-[#d4af37]
              "
            >
              <img
                className="w-full h-full object-cover"
                src={user?.userImage || userImg}
                alt={user?.fullName || "User"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = userImg;
                }}
              />
            </div>

            <div className="content min-w-0">
              <h2 className="m-0 mb-1 text-white text-base sm:text-[25px] font-bold leading-tight break-words">
                {user?.fullName}
              </h2>

              {user?.role && (
                <span className={`role-badge ${user.role === "seller" ? "role-seller" : "role-buyer"}`}>
                  <i className={`fa-solid ${user.role === "seller" ? "fa-store" : "fa-house-user"}`}></i>
                  {user.role === "seller" ? "Seller" : "Buyer"}
                </span>
              )}
            </div>

          </div>



        </div>
      </section>


      {/* ================= Public Info ================= */}
      <section
        className="
          profile-details
          w-[92%]
          sm:w-[90%]
          mx-auto
          my-6
          sm:my-[30px]
          pb-6
          grid
          grid-cols-1
          gap-4
        "
      >

        <div
          className="
            profile-box
            relative
            bg-[#0d0d0d]
            rounded-[10px]
            p-5
            sm:p-[25px]
          "
        >

          <h2 className="m-0 mb-5 sm:mb-[25px] text-[#d4af37] text-base sm:text-lg">
            About
          </h2>


          <div className="info-item flex items-center gap-3 sm:gap-[15px] mb-5">
            <i className="fa-solid fa-user w-5 text-[#d4af37] text-center text-sm"></i>
            <div className="min-w-0">
              <span className="block text-[#777] text-[11px] sm:text-xs mb-[3px]">
                Name
              </span>
              <p className="m-0 text-[#ddd] text-xs sm:text-sm break-words">
                {user?.fullName || "Not available"}
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}

export default PublicProfile;