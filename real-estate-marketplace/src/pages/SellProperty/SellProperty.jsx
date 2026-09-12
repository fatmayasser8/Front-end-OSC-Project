import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Swal from "sweetalert2";

import "../../styles/SellProperty.css";
import { apiFetch } from "../../utils/apiFetch";
import { useSellerVerification } from "../../utils/useSellerVerification";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ======================================================
// Custom Font Awesome Marker
// ======================================================

const redMarkerIcon = L.divIcon({
  className: "custom-map-marker",

  html: `
    <i class="fa-solid fa-location-dot"></i>
  `,

  iconSize: [40, 40],

  iconAnchor: [20, 40],

  popupAnchor: [0, -40],
});

// ======================================================
// Location Picker
// ======================================================

function LocationPicker({ position, onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      onSelect(lat, lng);
    },
  });

  if (!position) {
    return null;
  }

  return (
    <Marker
      position={position}
      icon={redMarkerIcon}
    />
  );
}

// ======================================================
// Map Search
// ======================================================

function MapSearch({ onSelect }) {
  const map = useMap();

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async () => {
    const query = searchValue.trim();

    if (!query) {
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      if (!data.length) {
        Swal.fire({
          icon: "warning",
          title: "Location not found",
          text: "Try searching for another location.",
        });

        return;
      }

      const result = data[0];

      const lat = Number(result.lat);
      const lng = Number(result.lon);

      // Move map to searched location
      map.flyTo(
        [lat, lng],
        15,
        {
          duration: 1.5,
        }
      );

      // Save coordinates
      onSelect(lat, lng);

    } catch (error) {
      console.error(
        "Map search error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Search failed",
        text: "Could not search for this location.",
      });
    }
  };

  return (
    <div className="map-search-box">

      <i className="fa-solid fa-magnifying-glass"></i>

      <input
        type="text"
        name="mapSearch"
        value={searchValue}
        onChange={(e) =>
          setSearchValue(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
        placeholder="Search for a location..."
      />

      <button
        type="button"
        onClick={handleSearch}
      >
        Search
      </button>

    </div>
  );
}

// ======================================================
// Map Component
// ======================================================
// MapSearch is placed INSIDE MapContainer here.
// This fixes the useMap() error.
// ======================================================

function PropertyMap({
  latitude,
  longitude,
  onSelect,
}) {
  const hasPosition =
    latitude !== "" &&
    longitude !== "" &&
    latitude !== null &&
    longitude !== null;

  const position = hasPosition
    ? [
        Number(latitude),
        Number(longitude),
      ]
    : null;

  return (
    <div className="map-container-wrapper">

      <MapContainer
        center={
          position || [
            30.0444,
            31.2357,
          ]
        }
        zoom={
          position
            ? 14
            : 11
        }
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "10px",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Search MUST be inside MapContainer */}
        <MapSearch
          onSelect={onSelect}
        />

        {/* Location Marker */}
        <LocationPicker
          position={position}
          onSelect={onSelect}
        />

      </MapContainer>

    </div>
  );
}
// =========================
// Sell Property
// =========================

function SellProperty() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

const [selectedAddress, setSelectedAddress] = useState("");


  const API =
    "https://real-estate-market-place-api.vercel.app/api/v1";

  const isEditMode = Boolean(id);

  // Property passed from SellerDashboard
  const propertyToEdit = location.state?.property;

  

const { isApproved, loading: verifyLoading } = useSellerVerification();


useEffect(() => {
  if (!verifyLoading && !isApproved) {
    Swal.fire({
      icon: "warning",
      title: "Identity verification required",
      text: "Please verify your identity before listing a property.",
    }).then(() => navigate("/sellerDashBoard"));
  }
}, [verifyLoading, isApproved, navigate]);


  // =========================
  // Form Data
  // =========================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    listingType: "sale",
    propertyType: "apartment",
    areaSqMeters: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    longitude: "",
    latitude: "",
  });

  const [amenities, setAmenities] = useState([]);

  // New images
  const [images, setImages] = useState([]);

  // Existing images from API
  const [existingImages, setExistingImages] =
    useState([]);

  // Images user wants to remove
  const [removedImages, setRemovedImages] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingProperty, setLoadingProperty] =
    useState(false);

  // =========================
  // Fill form in Edit mode
  // =========================

  useEffect(() => {
    if (!isEditMode) return;

    if (!propertyToEdit) {
      Swal.fire({
        icon: "error",
        title: "Property data not found",
        text: "Please open the property from your dashboard.",
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        navigate("/sellerDashBoard");
      });

      return;
    }

    const property = propertyToEdit;

    setFormData({
      title: property.title || "",

      description:
        property.description || "",

      price:
        property.price ?? "",

      listingType:
        property.listingType || "sale",

      propertyType:
        property.propertyType || "apartment",

      areaSqMeters:
        property.areaSqMeters ?? "",

      bedrooms:
        property.bedrooms ?? "",

      bathrooms:
        property.bathrooms ?? "",

      address:
        property.location?.address || "",

      longitude:
        property.location?.coordinates?.[0] ?? "",

      latitude:
        property.location?.coordinates?.[1] ?? "",
    });

    setSelectedAddress(
  property.location?.address || ""
);

    setAmenities(
      Array.isArray(property.amenities)
        ? property.amenities
        : []
    );

    setExistingImages(
      Array.isArray(property.images)
        ? property.images
        : []
    );
  }, [
    isEditMode,
    propertyToEdit,
    navigate,
  ]);

  // =========================
  // Handle inputs
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Handle amenities
  // =========================

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setAmenities((prev) => {
        if (prev.includes(value)) {
          return prev;
        }

        return [...prev, value];
      });
    } else {
      setAmenities((prev) =>
        prev.filter((item) => item !== value)
      );
    }
  };

  // =========================
  // Handle new images
  // =========================

  const handleImagesChange = (e) => {
    const selectedImages = Array.from(
      e.target.files || []
    );

    if (selectedImages.length === 0) return;

    const totalImages =
      existingImages.length +
      images.length +
      selectedImages.length;

    if (totalImages > 10) {
      const remainingSlots =
        10 -
        existingImages.length -
        images.length;

      Swal.fire({
        icon: "warning",
        title: "Too many images",
        text:
          remainingSlots > 0
            ? `You can select only ${remainingSlots} more image${
                remainingSlots > 1
                  ? "s"
                  : ""
              }.`
            : "You already have 10 images.",
      });

      e.target.value = "";

      return;
    }

    setImages((prev) => [
      ...prev,
      ...selectedImages,
    ]);

    e.target.value = "";
  };

  // =========================
  // Remove new image
  // =========================

  const handleRemoveNewImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // Remove existing image
  // =========================

  const handleRemoveExistingImage = (image) => {
    setExistingImages((prev) =>
      prev.filter((item) => item !== image)
    );

    setRemovedImages((prev) => {
      if (prev.includes(image)) {
        return prev;
      }

      return [...prev, image];
    });
  };

  // =========================
  // Map Location Select
  // =========================

const handleMapSelect = async (lat, lng) => {
  setFormData((prev) => ({
    ...prev,
    latitude: lat,
    longitude: lng,
  }));

  setSelectedAddress("Getting location address...");

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to get location address"
      );
    }

    const data = await response.json();

    const address =
      data.display_name ||
      "Address not available";

    // Show selected address
    setSelectedAddress(address);

    // Put it inside Address input automatically
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address,
    }));

  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error
    );

    setSelectedAddress(
      "Could not determine the address"
    );
  }
};

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();


if (!isApproved) {
  Swal.fire({
    icon: "warning",
    title: "Identity verification required",
    text: "Please verify your identity before listing a property.",
  });
  return;
}
    // =========================
    // Validation
    // =========================

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.areaSqMeters ||
      !formData.address ||
      !formData.longitude ||
      !formData.latitude
    ) {
      Swal.fire({
        icon: "warning",

        title: "Missing information",

        text:
          "Please fill in all required fields and select the property location on the map.",
      });

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // =========================
      // Basic Information
      // =========================

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "price",
        Number(formData.price)
      );

      data.append(
        "listingType",
        formData.listingType
      );

      data.append(
        "propertyType",
        formData.propertyType
      );

      data.append(
        "areaSqMeters",
        Number(formData.areaSqMeters)
      );

      data.append(
        "bedrooms",
        Number(formData.bedrooms || 0)
      );

      data.append(
        "bathrooms",
        Number(formData.bathrooms || 0)
      );

      // =========================
      // Location
      // =========================

      data.append(
        "address",
        formData.address
      );


      data.append(
        "coordinates",
        JSON.stringify([
          Number(formData.longitude),
          Number(formData.latitude),
        ])
      );

      // =========================
      // Amenities
      // =========================

      data.append(
        "amenities",
        JSON.stringify(amenities)
      );

      // =========================
      // Removed Images
      // =========================

      if (
        isEditMode &&
        removedImages.length > 0
      ) {
        data.append(
          "removedImages",
          JSON.stringify(removedImages)
        );
      }

      // =========================
      // New Images
      // =========================

      images.forEach((image) => {
        data.append(
          "images",
          image
        );
      });

      // =========================
      // API Request
      // =========================

      const url = isEditMode
        ? `${API}/listings/${id}`
        : `${API}/listings`;

      const response = await apiFetch(
        url,
        {
          method: isEditMode
            ? "PATCH"
            : "POST",

          body: data,
        }
      );

      const result =
        await response.json();

      console.log(
        isEditMode
          ? "Update listing response:"
          : "Create listing response:",
        result
      );

      // =========================
      // Unauthorized
      // =========================

      if (response.status === 401) {
        navigate("/auth/login");

        return;
      }

      // =========================
      // Seller only
      // =========================

      if (response.status === 403) {
        Swal.fire({
          icon: "error",

          title: "Access denied",

          text: isEditMode
            ? "Only sellers can update their properties."
            : "Only sellers can create property listings.",
        });

        return;
      }

      // =========================
      // Not found
      // =========================

      if (response.status === 404) {
        Swal.fire({
          icon: "error",

          title: "Property not found",

          text:
            "This property may have been removed or is no longer available.",
        });

        navigate("/sellerDashBoard");

        return;
      }

      // =========================
      // Other errors
      // =========================

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${
              isEditMode
                ? "update"
                : "create"
            } property.`
        );
      }

      // =========================
      // Success
      // =========================

      await Swal.fire({
        icon: "success",

        title: isEditMode
          ? "Property updated!"
          : "Property submitted!",

        text: isEditMode
          ? "Your property has been updated successfully."
          : "Your property has been submitted and is waiting for approval.",

        confirmButtonText:
          "Back to Dashboard",
      });

      navigate("/sellerDashBoard");

    } catch (error) {
      console.error(
        isEditMode
          ? "Update listing error:"
          : "Create listing error:",
        error
      );

      Swal.fire({
        icon: "error",

        title: "Something went wrong",

        text:
          error.message ||
          "Something went wrong.",
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Loading property
  // =========================

if (verifyLoading) {
  return (
    <div className="sell-property-page">
      <div className="sell-property-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Checking your verification status...</p>
      </div>
    </div>
  );
}

if (!isApproved) return null; 


  if (loadingProperty) {
    return (
      <div className="sell-property-page">

        <div className="sell-property-loading">

          <i className="fa-solid fa-spinner fa-spin"></i>

          <p>
            Loading property...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="sell-property-page">

      <div className="sell-property-container">

        {/* ================= BACK ================= */}

        <button
          type="button"
          className="back-profile-btn"
          onClick={() =>
            navigate("/sellerDashBoard")
          }
        >

          <i className="fa-solid fa-arrow-left"></i>

          Back to Dashboard

        </button>

        {/* ================= HEADER ================= */}

        <div className="sell-property-header">

          <h1>

            {isEditMode
              ? "Edit Your Property"
              : "Sell Your Property"}

          </h1>

          <p>

            {isEditMode
              ? "Update your property details and save your changes."
              : "Add your property details and submit your listing for approval."}

          </p>

        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          {/* =========================
              Basic Information
          ========================= */}

          <div className="form-section">

            <h2>
              Property Information
            </h2>

            <div className="form-group">

              <label>
                Property Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern 3-Bedroom Apartment"
              />

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="5"
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2500000"
                />

              </div>

              <div className="form-group">

                <label>
                  Listing Type
                </label>

                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                >

                  <option value="sale">
                    Sale
                  </option>

                  <option value="rent">
                    Rent
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Property Type
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >

                  <option value="apartment">
                    Apartment
                  </option>

                  <option value="villa">
                    Villa
                  </option>

                  <option value="studio">
                    Studio
                  </option>

                  <option value="commercial">
                    Commercial
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* =========================
              Property Details
          ========================= */}

          <div className="form-section">

            <h2>
              Property Details
            </h2>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Area (m²)
                </label>

                <input
                  type="number"
                  name="areaSqMeters"
                  value={formData.areaSqMeters}
                  onChange={handleChange}
                  placeholder="150"
                />

              </div>

              <div className="form-group">

                <label>
                  Bedrooms
                </label>

                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                />

              </div>

              <div className="form-group">

                <label>
                  Bathrooms
                </label>

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                />

              </div>

            </div>

          </div>

   

{/* =========================
    Location
========================= */}

<div className="form-section">

  <h2>
    Location
  </h2>

  <div className="form-group">

    <label>
      Address
    </label>

    <input
      type="text"
      name="address"
      value={formData.address}
      onChange={handleChange}
      placeholder="Search on the map or enter address manually"
    />

  </div>

  <div className="form-group">

    <label>
      Pin the property location on the map
    </label>

    <PropertyMap
      latitude={formData.latitude}
      longitude={formData.longitude}
      onSelect={handleMapSelect}
    />

    {selectedAddress && (
      <div className="selected-location-box">

        <div className="selected-location-title">

          <i className="fa-solid fa-location-dot"></i>

          <span>
            Selected Location
          </span>

        </div>

        <p>
          {selectedAddress}
        </p>

      </div>
    )}

    {formData.latitude &&
    formData.longitude ? (

      <p className="map-selected-coords">

        Coordinates:{" "}

        {Number(
          formData.latitude
        ).toFixed(5)}

        {" , "}

        {Number(
          formData.longitude
        ).toFixed(5)}

      </p>

    ) : (

      <p className="map-hint">

        Search for a location or click
        on the map to select the property's
        exact location.

      </p>

    )}

  </div>

</div>

          {/* =========================
              Amenities
          ========================= */}

          <div className="form-section">

            <h2>
              Amenities
            </h2>

            <div className="amenities-grid">

              {[
                "Parking",
                "Swimming Pool",
                "Security",
                "Garden",
                "Elevator",
                "Balcony",
                "Gym",
                "Air Conditioning",
              ].map((amenity) => (

                <label
                  key={amenity}
                  className="amenity-item"
                >

                  <input
                    type="checkbox"
                    value={amenity}
                    checked={amenities.includes(
                      amenity
                    )}
                    onChange={
                      handleAmenityChange
                    }
                  />

                  <span>
                    {amenity}
                  </span>

                </label>

              ))}

            </div>

          </div>

          {/* =========================
              Images
          ========================= */}

          <div className="form-section">

            <h2>
              Property Images
            </h2>

            <p className="image-hint">
              You can have up to 10 images.
            </p>

            {/* Existing Images */}

            {isEditMode &&
            existingImages.length > 0 && (

              <div className="image-group">

                <h3>
                  Current Images
                </h3>

                <div className="selected-images">

                  {existingImages.map(
                    (image, index) => (

                      <div
                        key={`${image}-${index}`}
                        className="selected-image existing-image"
                      >

                        <img
                          src={image}
                          alt={`Current property ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            handleRemoveExistingImage(
                              image
                            )
                          }
                        >

                          <i className="fa-solid fa-xmark"></i>

                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* File Input */}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImagesChange
              }
            />

            {/* New Images */}

            {images.length > 0 && (

              <div className="image-group">

                <h3>
                  New Images
                </h3>

                <div className="selected-images">

                  {images.map(
                    (image, index) => (

                      <div
                        key={`${image.name}-${index}`}
                        className="selected-image"
                      >

                        <img
                          src={URL.createObjectURL(
                            image
                          )}
                          alt={`New property ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            handleRemoveNewImage(
                              index
                            )
                          }
                        >

                          <i className="fa-solid fa-xmark"></i>

                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

          {/* =========================
              Submit
          ========================= */}

<button
  type="submit"
  disabled={loading}
  className="submit-property-btn"
>

            {loading ? (

              <>

                <i className="fa-solid fa-spinner fa-spin"></i>

                {isEditMode
                  ? "Updating..."
                  : "Submitting..."}

              </>

            ) : (

              <>

                <i
                  className={`fa-solid ${
                    isEditMode
                      ? "fa-pen"
                      : "fa-house"
                  }`}
                ></i>

                {isEditMode
                  ? "Update Property"
                  : "Submit Property"}

              </>

            )}

          </button>

        </form>

      </div>

    </div>
  );
}

export default SellProperty;