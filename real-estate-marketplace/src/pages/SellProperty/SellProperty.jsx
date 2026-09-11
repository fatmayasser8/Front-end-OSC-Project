import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/SellProperty.css";
import { apiFetch } from "../../utils/apiFetch";


function SellProperty() {
  const navigate = useNavigate();

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
    city: "",
    longitude: "",
    latitude: "",
  });

  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setAmenities((prev) => [...prev, value]);
    } else {
      setAmenities((prev) => prev.filter((item) => item !== value));
    }
  };

  // =========================
  // Handle images
  // =========================
  const handleImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    if (selectedImages.length > 10) {
      Swal.fire({
        icon: "warning",
        title: "Too many images",
        text: "You can upload up to 10 images only.",
      });

      return;
    }

    setImages(selectedImages);
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.areaSqMeters ||
      !formData.bedrooms ||
      !formData.bathrooms ||
      !formData.address ||
      !formData.city ||
      !formData.longitude ||
      !formData.latitude
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill in all required fields.",
      });

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // =========================
      // Basic property data
      // =========================
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("listingType", formData.listingType);
      data.append("propertyType", formData.propertyType);
      data.append("areaSqMeters", Number(formData.areaSqMeters));
      data.append("bedrooms", Number(formData.bedrooms));
      data.append("bathrooms", Number(formData.bathrooms));

      // =========================
      // Location
      // =========================
      data.append("address", formData.address);
      data.append("city", formData.city);

      // API expects [longitude, latitude]
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
      data.append("amenities", JSON.stringify(amenities));

      // =========================
      // Images
      // =========================
      images.forEach((image) => {
        data.append("images", image);
      });

      // =========================
      // API request
      // =========================
      const response = await apiFetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/listings",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      console.log("Create listing response:", result);

      // =========================
      // Unauthorized
      // =========================
      if (response.status === 401) {
        navigate("/auth/login");
        return;
      }

      // =========================
      // Not seller
      // =========================
      if (response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Access denied",
          text: "Only sellers can create property listings.",
        });

        return;
      }

      // =========================
      // Other errors
      // =========================
      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create property listing."
        );
      }

      // =========================
      // Success
      // =========================
      await Swal.fire({
        icon: "success",
        title: "Property submitted!",
        text: "Your property has been submitted and is waiting for approval.",
        confirmButtonText: "Back to Profile",
      });

      navigate("/profile");
    } catch (error) {
      console.error("Create listing error:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message || "Failed to submit your property.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-property-page">

      <div className="sell-property-container">
<button
  type="button"
  className="back-profile-btn"
  onClick={() => navigate("/profile")}
>
  <i className="fa-solid fa-arrow-left"></i>
  Back to Profile
</button>
        <div className="sell-property-header">
          <h1>Sell Your Property</h1>
          <p>
            Add your property details and submit your listing for approval.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* =========================
              Basic Information
          ========================= */}

          <div className="form-section">
            <h2>Property Information</h2>

            <div className="form-group">
              <label>Property Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern 3-Bedroom Apartment"
              />
            </div>

            <div className="form-group">
              <label>Description</label>

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
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2500000"
                />
              </div>

              <div className="form-group">
                <label>Listing Type</label>

                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>

              <div className="form-group">
                <label>Property Type</label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                </select>
              </div>

            </div>
          </div>


          {/* =========================
              Property Details
          ========================= */}

          <div className="form-section">

            <h2>Property Details</h2>

            <div className="form-row">

              <div className="form-group">
                <label>Area (m²)</label>

                <input
                  type="number"
                  name="areaSqMeters"
                  value={formData.areaSqMeters}
                  onChange={handleChange}
                  placeholder="150"
                />
              </div>

              <div className="form-group">
                <label>Bedrooms</label>

                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>

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

            <h2>Location</h2>

            <div className="form-group">
              <label>Address</label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="15 El Tahrir Street"
              />
            </div>

            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Cairo"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Longitude</label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="31.2357"
                />
              </div>

              <div className="form-group">
                <label>Latitude</label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="30.0444"
                />
              </div>

            </div>

          </div>


          {/* =========================
              Amenities
          ========================= */}

          <div className="form-section">

            <h2>Amenities</h2>

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
                <label key={amenity} className="amenity-item">

                  <input
                    type="checkbox"
                    value={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                  />

                  <span>{amenity}</span>

                </label>
              ))}

            </div>

          </div>


          {/* =========================
              Images
          ========================= */}

          <div className="form-section">

            <h2>Property Images</h2>

            <p className="image-hint">
              You can upload up to 10 images.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />

            {images.length > 0 && (
              <div className="selected-images">

                {images.map((image, index) => (
                  <div key={index} className="selected-image">

                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property ${index + 1}`}
                    />

                  </div>
                ))}

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
                Submitting...
              </>
            ) : (
              <>
                <i className="fa-solid fa-house"></i>
                Submit Property
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}

export default SellProperty;