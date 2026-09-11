import { useEffect, useState } from "react";
import "../../styles/Favorites.css";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";
import Swal from "sweetalert2";
function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [clearingFavorites, setClearingFavorites] = useState(false);
  // ================= Get Favorites =================
const getFavorites = async () => {
  try {
    setLoading(true);

    const response = await apiFetch(
      "https://real-estate-market-place-api.vercel.app/api/v1/users/favorites",
      {
        method: "GET",
      }
    );

    const result = await response.json();

    console.log("Favorites:", result);

    if (!response.ok) {
      if (response.status === 401) {
        navigate("/auth/login");
        return;
      }

      throw new Error(
        result.message || "Failed to get favorites"
      );
    }

    setFavorites(result.data.favorites || []);

  } catch (error) {
    console.error("Favorites error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    getFavorites();
  }, []);

const handleClearFavorites = async () => { 
  if (clearingFavorites || favorites.length === 0) return;

const result = await Swal.fire({ title: "Clear all favorites?",
   text: "All your saved properties will be removed.", 
   icon: "warning", showCancelButton: true, confirmButtonText: "Yes, clear all", 
   cancelButtonText: "Cancel", 
   reverseButtons: true, });

if (!result.isConfirmed) return;

try { setClearingFavorites(true);

   const response = await apiFetch( "https://real-estate-market-place-api.vercel.app/api/v1/users/favorites/clear", 
    { method: "DELETE", } );

   const data = await response.json();
    console.log("Clear favorites:", data);

if (!response.ok) {
   if (response.status === 401) {
     navigate("/auth/login"); return;
     } 
     throw new Error( data.message || "Failed to clear favorites" );
     }

//Clear favorites from the UI
 setFavorites([]);
  await Swal.fire({
     title: "Cleared!",
      text: "All favorites have been removed.",
       icon: "success", confirmButtonText: "OK", });

} 
catch (error) 
{ console.error("Clear favorites error:", error);
   Swal.fire({ title: "Something went wrong", text: error.message, icon: "error", confirmButtonText: "OK", });

} finally { setClearingFavorites(false); }
}
  // ================= Loading =================
  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-loading">
          <div className="favorites-spinner"></div>
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  // ================= Error =================
  if (error) {
    return (
      <div className="favorites-page">
        <Link to="/home" className="favorites-back">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Home
        </Link>

        <div className="favorites-error">
          <i className="fa-solid fa-circle-exclamation"></i>

          <h2>Unable to load favorites</h2>

          <p>{error}</p>

          <button onClick={getFavorites}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

          <p>
            Properties you've saved for later.
          </p>

        </div>


        <div className="favorites-counter">

          <span>Favorites</span>

          <strong>
            {favorites.length}
          </strong>
{favorites.length > 0 && ( <button type="button" onClick={handleClearFavorites} 
disabled={clearingFavorites} 
className="clear-favorites-btn" > 
{clearingFavorites ? ( <i className="fa-solid fa-spinner fa-spin"></i> ) : ( <> <i className="fa-solid fa-trash"></i> Clear All </> )}
 </button> )}
        </div>

      </div>


      {/* ================= Empty State ================= */}

      {favorites.length === 0 ? (

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

          <Link
            to="/home"
            className="explore-btn"
          >
            <i className="fa-solid fa-compass"></i>
            Explore Properties
          </Link>

        </div>

      ) : (

        /* ================= Favorites Grid ================= */

        <div className="favorites-grid">

          {favorites.map((favorite) => {

            // Depending on API response structure
            const property =
              favorite?.property ||
              favorite;

            return (
              <div
                className="favorite-card"
                key={
                  property?._id ||
                  property?.id ||
                  favorite?._id
                }
              >

                {/* Property Image */}

                <div className="favorite-image">

                  <img
                    src={
                      property?.images?.[0] ||
                      property?.image ||
                      "/placeholder.jpg"
                    }
                    alt={
                      property?.title ||
                      "Property"
                    }
                  />

                  {/* Favorite Heart */}

                  <button
                    type="button"
                    className="favorite-heart active"
                    aria-label="Remove from favorites"
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>

                </div>


                {/* Property Info */}

                <div className="favorite-info">

                  <h3>
                    {property?.title ||
                      property?.name ||
                      "Property"}
                  </h3>

                  <p className="favorite-location">
                    <i className="fa-solid fa-location-dot"></i>

                    {property?.location ||
                      property?.address ||
                      "Location not available"}
                  </p>


                  <div className="favorite-details">

                    {property?.bedrooms != null && (
                      <span>
                        <i className="fa-solid fa-bed"></i>
                        {property.bedrooms} Beds
                      </span>
                    )}

                    {property?.bathrooms != null && (
                      <span>
                        <i className="fa-solid fa-bath"></i>
                        {property.bathrooms} Baths
                      </span>
                    )}

                    {property?.area != null && (
                      <span>
                        <i className="fa-solid fa-ruler-combined"></i>
                        {property.area} m²
                      </span>
                    )}

                  </div>


                  {property?.price != null && (
                    <div className="favorite-price">
                      {property.price} EGP
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default Favorites;