import "../../styles/propertyCard.css";
import HomeImg from "../../assets/Villa.jpg";
import { useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

function Card({ property }) {

const [isFavorite, setIsFavorite] = useState(
  Boolean(property?.isFavorite)
);
console.log("PROPERTY:", property);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleFavorite = async () => {
    if (favoriteLoading || !property?._id) return;

    try {
      setFavoriteLoading(true);
 console.log("Property ID:", property._id);
      const response = await apiFetch(
        `https://real-estate-market-place-api.vercel.app/api/v1/users/favorites/${property._id}`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

console.log("Status:", response.status); 
console.log("Favorite response:", result);

      if (!response.ok) {
        if (response.status === 401) {
            console.log("User is not authenticated");
          return;
        }

        throw new Error(
          result.message || "Failed to update favorite"
        );
      }

setIsFavorite((prev) => !prev);

    } catch (error) {
      console.error("Favorite error:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-3">

      <div className="card-property">

        <div className="upper-part">

          <div className="on-miniCards">

            <div className="left">
              <span>
                for Rent
              </span>
            </div>

            {/* ================= Favorite ================= */}

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
              <i
                className={
                  isFavorite
                    ? "fa-solid fa-heart"
                    : "fa-regular fa-heart"
                }
              ></i>
            </button>

          </div>

          <div className="img-outer">
            <img
              src={property?.images?.[0] || HomeImg}
              alt={property?.title || "estateImg"}
            />
          </div>

        </div>

        <div className="middle-part">

          {/* Location */}

          <div className="location">
            <i className="fa-solid fa-location-dot"></i>

            <h3>
              {property?.location || "New Cairo"}
            </h3>
          </div>

          {/* Details */}

          <div>
            <p>
              {property?.title || "Luxury Villa"}
            </p>

            <p className="price">
              EGP {property?.price || "8,500,000"}
            </p>
          </div>

        </div>

        <div className="lower-part">

          <div className="left">

            {/* Bedrooms */}

            <div className="bedRooms">
              <i className="fa-solid fa-bed"></i>
              {property?.bedrooms ?? 5}
            </div>

            {/* Bathrooms */}

            <div className="bathRooms">
              <i className="fa-solid fa-bath"></i>
              {property?.bathrooms ?? 3}
            </div>

            {/* Area */}

            <div className="area">
              {property?.area ?? 160} sqm
            </div>

          </div>

          {/* Time */}

          <div className="right">
            <div className="time">
              2 days ago
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Card;