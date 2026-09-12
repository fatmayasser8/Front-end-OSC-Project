
import "../../styles/propertyCard.css";
import HomeImg from "../../assets/Villa.jpg";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import Swal from "sweetalert2";

function getTimeAgo(date) {
  if (!date) return "Recently";

  const now = new Date();
  const created = new Date(date);
  const diffInSeconds = Math.floor((now - created) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${
      diffInMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} ${
      diffInHours === 1 ? "hour" : "hours"
    } ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} ${
      diffInDays === 1 ? "day" : "days"
    } ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${
      diffInWeeks === 1 ? "week" : "weeks"
    } ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  return `${diffInMonths} ${
    diffInMonths === 1 ? "month" : "months"
  } ago`;
}

function Card({
  property,
  isFavorite: initialIsFavorite,
  onFavoriteChange,
}) {
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(
    initialIsFavorite
  );

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleFavorite = async (e) => {
    e.stopPropagation();

    // ==========================================
    // GUEST PROTECTION
    // ==========================================

if (!isAuthenticated()) {
   Swal.fire({ title: "Join NOVA",
     text: "You need an account to add properties to your favorites.", 
     icon: "info", showCancelButton: true, confirmButtonText: "Create Account", 
     cancelButtonText: "Maybe Later", background: "#111", 
     color: "#fff", 
     confirmButtonColor: "#d4af37", cancelButtonColor: "#333", }).then((result) => {
       if (result.isConfirmed) { 
        navigate("/auth/register");
       } });
        return; }

    // ==========================================
    // PREVENT DOUBLE CLICK
    // ==========================================

    if (favoriteLoading || !property?._id) return;

    try {
      setFavoriteLoading(true);

      const response = await apiFetch(
        `https://real-estate-market-place-api.vercel.app/api/v1/users/favorites/${property._id}`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      console.log(
        "FAVORITE STATUS:",
        response.status
      );

      console.log(
        "FAVORITE RESPONSE:",
        result
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/auth/login");
          return;
        }

        throw new Error(
          result.message ||
            "Failed to update favorite"
        );
      }

      // Toggle favorite state
      const newStatus = !isFavorite;

      setIsFavorite(newStatus);

      // Tell parent component about the change
      onFavoriteChange?.(
        property._id,
        newStatus
      );
    } catch (error) {
      console.error(
        "Favorite error:",
        error
      );

      alert(
        error.message ||
          "Failed to update favorite. Please try again."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCardClick = () => {
    if (property?._id) {
      navigate(`/property/${property._id}`);
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-3">
      <div
        className="card-property"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCardClick();
          }
        }}
      >
        {/* =========================
            CARD IMAGE
        ========================= */}

        <div className="upper-part">
          <div className="on-miniCards">
            <div className="left">
              <span>
                {property?.listingType === "rent"
                  ? "For Rent"
                  : "For Sale"}
              </span>
            </div>
          </div>

          {/* =========================
              FAVORITE BUTTON
          ========================= */}

          <button
            type="button"
            onClick={handleFavorite}
            disabled={favoriteLoading}
            className="favorite-btn"
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {favoriteLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i
                className={
                  isFavorite
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart"
                }
              ></i>
            )}
          </button>

          <div className="img-outer">
            <img
              src={
                property?.images?.[0] ||
                HomeImg
              }
              alt={
                property?.title ||
                "estate"
              }
            />
          </div>
        </div>

        {/* =========================
            PROPERTY INFO
        ========================= */}

        <div className="middle-part">
          <div className="location">
            <i className="fa-solid fa-location-dot"></i>

            <h3>
              {property?.location?.city ||
                "Unknown Location"}
            </h3>
          </div>

          <div>
            <p>
              {property?.title ||
                "Property"}
            </p>

            <p className="price">
              EGP{" "}
              {property?.price
                ? property.price.toLocaleString()
                : "0"}
            </p>
          </div>
        </div>

        {/* =========================
            PROPERTY DETAILS
        ========================= */}

        <div className="lower-part">
          <div className="left">
            <div className="bedRooms">
              <i className="fa-solid fa-bed"></i>

              {property?.bedrooms ?? 0}
            </div>

            <div className="bathRooms">
              <i className="fa-solid fa-bath"></i>

              {property?.bathrooms ?? 0}
            </div>

            <div className="area">
              {property?.areaSqMeters ?? 0} sqm
            </div>
          </div>

          <div className="right">
            <div className="time">
              {getTimeAgo(
                property?.createdAt
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

