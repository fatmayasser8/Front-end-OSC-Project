import "../../styles/PropertyDetails.css";

import villa1 from "../../assets/hero.png";

import userImg from "../../assets/user-img.jpg";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";
import { isAuthenticated } from "../../utils/auth";
import Swal from "sweetalert2";

function PropertyDetails() {

  const { id } = useParams();

const navigate = useNavigate();

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
      navigate("/auth/register");
    }
  });
};


  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [seller, setSeller] = useState(null);
const [currentImage, setCurrentImage] = useState(0);
const [isSaved, setIsSaved] = useState(false);
const [saving, setSaving] = useState(false);
const [errorType, setErrorType] = useState(null);

const images = property?.images || [];

const nextImage = () => {
  if (images.length <= 1) return;

  setCurrentImage((prev) => (prev + 1) % images.length);
};

const prevImage = () => {
  if (images.length <= 1) return;

  setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
};


const handleSave = async () => {
  if (!isAuthenticated()) {
    showLoginPrompt("save properties to your favorites");
    return;
  }

  if (!property?._id || saving) return;

  try {
    setSaving(true);

    const response = await apiFetch(
      `https://real-estate-market-place-api.vercel.app/api/v1/users/favorites/${property._id}`,
      {
        method: "PATCH",
      }
    );

    const result = await response.json();

    console.log("Save response:", result);

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to update favorite"
      );
    }

    setIsSaved((prev) => !prev);
  } catch (error) {
    console.error("Save error:", error);
  } finally {
    setSaving(false);
  }
};

const handleShare = async () => {
  if (!isAuthenticated()) {
    showLoginPrompt("share properties");
    return;
  }

  const propertyUrl = window.location.href;

  try {
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: property.description || property.title,
        url: propertyUrl,
      });
    } else {
      await navigator.clipboard.writeText(propertyUrl);
      alert("Property link copied!");
    }
  } catch (error) {
    console.log("Share cancelled");
  }
};
const handleContactSeller = () => {
  if (!isAuthenticated()) {
    showLoginPrompt("contact the seller");
    return;
  }

  if (!seller?.phoneNumber) {
    alert("Seller phone number is not available");
    return;
  }

  window.location.href = `tel:${seller.phoneNumber}`;
};
const handleDirections = () => {
  if (!latitude || !longitude) {
    alert("Property location is not available");
    return;
  }

  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  window.open(url, "_blank");
};


useEffect(() => {
  const fetchProperty = async () => {
        console.log("DETAIL PAGE ID:", id);
    try {
      
      const response = await apiFetch(
        `https://real-estate-market-place-api.vercel.app/api/v1/listings/${id}`
      );

      console.log("DETAIL STATUS:", response.status);
      const result = await response.json();

      console.log("DETAIL RESPONSE:", result);
      console.log("PROPERTY ID:", id);
      console.log("PROPERTY RESPONSE:", result);
      console.log("STATUS:", response.status);

      if (!response.ok) {
        if (result.message?.toLowerCase().includes("not approved")) {
          setErrorType("not_approved");
        } else if (response.status === 404) {
          setErrorType("not_found");
        } else {
          setErrorType("generic");
        }

        return;
      }

      setProperty(result.data);
    } catch (err) {
      console.error("Property error:", err);
      setErrorType("generic");
    } finally {
      setLoading(false);
    }
  };

  fetchProperty();
}, [id]);
useEffect(() => {
  const checkFavorite = async () => {
    if (!id || !isAuthenticated()) {
      setIsSaved(false);
      return;
    }

    try {
      const response = await apiFetch(
        `https://real-estate-market-place-api.vercel.app/api/v1/users/favorites/${id}`,
        {
          method: "GET",
        }
      );

      if (response.status === 404 || response.status === 401) {
        setIsSaved(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to check favorite");
      }

      setIsSaved(true);
    } catch (error) {
      console.error("Check favorite error:", error);
    }
  };

  checkFavorite();
}, [id]);
useEffect(() => {
  if (!property?.owner) return;

  const fetchSeller = async () => {
    try {
      const response = await apiFetch(
        `https://real-estate-market-place-api.vercel.app/api/v1/users/${property.owner}/profile`,
        {
          method: "GET",
        }
      );

      const result = await response.json();

      console.log("SELLER PROFILE:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to load seller");
      }

      setSeller(result.data?.user ?? result.data);
    } catch (error) {
      console.error("Seller error:", error);
    }
  };

  fetchSeller();
}, [property]);
if (loading) {
  return (
    <div className="property-details-page">
      <div className="property-loading">

        <div className="loading-back"></div>

        <div className="loading-content">

          {/* Gallery Skeleton */}
          <div className="loading-gallery">
            <div className="loading-thumbnails">
              <div></div>
              <div></div>
              <div></div>
            </div>

            <div className="loading-main-image"></div>
          </div>

          {/* Property Info Skeleton */}
          <div className="loading-info">

            <div className="skeleton skeleton-small"></div>

            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-location"></div>
            <div className="skeleton skeleton-price"></div>

            <div className="loading-meta">
              <div></div>
              <div></div>
              <div></div>
            </div>

            <div className="loading-actions">
              <div></div>
              <div></div>
              <div></div>
            </div>

          </div>

        </div>

        {/* Bottom Skeleton */}
        <div className="loading-bottom">
          <div className="skeleton skeleton-heading"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
        </div>

      </div>
    </div>
  );
}

if (errorType) {
  const errorConfig = {
    not_approved: {
      icon: "fa-solid fa-clock",
      title: "This property is pending approval",
      text: "This listing hasn't been approved yet by our team. Please check back later.",
    },
    not_found: {
      icon: "fa-solid fa-house-circle-xmark",
      title: "Property not found",
      text: "The property you're looking for doesn't exist or may have been removed.",
    },
    generic: {
      icon: "fa-solid fa-triangle-exclamation",
      title: "Something went wrong",
      text: "We couldn't load this property right now. Please try again.",
    },
  };

  const { icon, title, text } = errorConfig[errorType] || errorConfig.generic;

  return (
    <div className="property-details-page">
      <div className={`property-error-state ${errorType}`}>
        <div className="error-icon">
          <i className={icon}></i>
        </div>
        <h2>{title}</h2>
        <p>{text}</p>
        <Link to="/home" className="error-back-btn">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Listings
        </Link>
      </div>
    </div>
  );
}

if (!property) {
  return (
    <div className="property-details-page">
      <div className="property-error-state not_found">
        <div className="error-icon">
          <i className="fa-solid fa-house-circle-xmark"></i>
        </div>
        <h2>Property not found</h2>
        <Link to="/home" className="error-back-btn">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Listings
        </Link>
      </div>
    </div>
  );
}
const longitude = property.location?.coordinates?.[0];
const latitude = property.location?.coordinates?.[1];
  return (
    <div className="property-details-page">

      {/* ================= BACK ================= */}
      <Link to="/home" className="back-link">
        <i className="fa-solid fa-arrow-left"></i>
        Back to Listings
      </Link>


      {/* ================= TOP ================= */}
      <section className="property-top">

        {/* ================= GALLERY ================= */}
<div className="gallery">

  <div className="thumbnails">
    {images.map((image, index) => (
<img
  key={index}
  src={image}
  alt={`${property.title} ${index + 1}`}
  className={currentImage === index ? "active-thumbnail" : ""}
  onClick={() => setCurrentImage(index)}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = villa1;
  }}
/>
    ))}
  </div>

  <div className="main-image">

<img
  src={images[currentImage] || villa1}
  alt={property.title}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = villa1;
  }}
/>
    <span className="image-count">
      {images.length ? currentImage + 1 : 1} / {images.length || 1}
    </span>

    <button
      className="image-arrow left"
      onClick={prevImage}
      type="button"
    >
      <i className="fa-solid fa-chevron-left"></i>
    </button>

    <button
      className="image-arrow right"
      onClick={nextImage}
      type="button"
    >
      <i className="fa-solid fa-chevron-right"></i>
    </button>

  </div>

</div>


        {/* ================= PROPERTY INFO ================= */}
        <div className="property-info">
<span className="purpose">
  {property.listingType === "rent" ? "For Rent" : "For Sale"}
</span>

<h1>
  {property.title}
</h1>

<div className="property-location">
  <i className="fa-solid fa-location-dot"></i>

  <span>
    {property.location?.address
      ? `${property.location.address}, `
      : ""}
    {property.location?.city || "Unknown Location"}
  </span>
</div>

<div className="property-price">
  EGP {property.price?.toLocaleString()}
</div>


          {/* Property Meta */}
          <div className="property-meta">

<div>
  <i className="fa-solid fa-bed"></i>
  <span>{property.bedrooms ?? 0} Beds</span>
</div>

<div>
  <i className="fa-solid fa-bath"></i>
  <span>{property.bathrooms ?? 0} Baths</span>
</div>

<div>
  <i className="fa-solid fa-maximize"></i>
  <span>{property.areaSqMeters ?? 0} sqm</span>
</div>

          </div>


          {/* Actions */}
          <div className="property-actions">

     <button onClick={handleSave} disabled={saving}>
  <i
    className={
      isSaved
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart"
    }
  ></i>

  {saving ? "Saving..." : isSaved ? "Saved" : "Save"}
</button>
 <button onClick={handleShare}>
  <i className="fa-solid fa-share-nodes"></i>
  Share
</button>

         <button
  className="contact-btn"
  onClick={handleContactSeller}
>
  <i className="fa-solid fa-phone"></i>
  Contact Seller
</button>

          </div>

        </div>


        {/* ================= RIGHT COLUMN ================= */}
        <div className="right-column">

          {/* ================= SELLER ================= */}
          <div className="seller-card">

            <div className="seller-info">

              <div className="seller-image">
              <img
  src={seller?.userImage || userImg}
  alt={seller?.fullName || "Seller"}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = userImg;
  }}
/>
              </div>

              <div>

             <h3>{seller?.fullName || "Property Owner"}</h3>

                <span className="verified">
                  <i className="fa-solid fa-circle-check"></i>
                  Verified Seller
                </span>

                <div className="rating">
                  ★★★★★
                  <span>
                    (12 reviews)
                  </span>
                </div>

              </div>

            </div>


            {/* Seller Contact */}
<div className="seller-contact">

  <p>
    <i className="fa-solid fa-phone"></i>
    {seller?.phoneNumber || "Phone not available"}
  </p>

    <p>
    <i className="fa-solid fa-envelope"></i>
    {seller?.email || "Email not available"}
  </p>

</div>


            <button className="message-btn">

              <i className="fa-regular fa-message"></i>

              Message Seller

            </button>

          </div>


          {/* ================= FEATURES ================= */}
          <div className="property-box features-box">

            <h2>
              <i className="fa-solid fa-star"></i>
              Features
            </h2>

<ul>
  {property.amenities?.map((amenity, index) => (
    <li key={index}>
      <i className="fa-solid fa-check"></i>
      {amenity}
    </li>
  ))}
</ul>

          </div>

        </div>


        {/* ================= PROPERTY OVERVIEW ================= */}
        <div className="property-box overview-box">

          <h2>
            <i className="fa-solid fa-house"></i>
            Property Overview
          </h2>
<p>
  {property.description || "No description available."}
</p>


          {/* Overview Images */}
<div className="overview-images">
  {property.images?.slice(0, 4).map((image, index) => (
    <img
      key={index}
      src={image}
      alt={`${property.title} ${index + 1}`}
    />
  ))}
</div>

        </div>

      </section>


      {/* ================= MAP ================= */}
      <section className="map-section">

        <h2>
          <i className="fa-solid fa-location-dot"></i>
          Location on Map
        </h2>


        <div className="map-container">

  <iframe
  title="Property Location"
  src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed`}
  loading="lazy"
></iframe>

        </div>


<button
  className="directions-btn"
  onClick={handleDirections}
  type="button"
>
  <i className="fa-solid fa-location-arrow"></i>
  Get Directions
</button>

      </section>

    </div>
  );
}

export default PropertyDetails;