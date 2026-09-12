import { useEffect, useState } from "react";
import "../../styles/SellerDashboard.css";
import userImg from "../../assets/user-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";
import Swal from "sweetalert2";
import { useSellerVerification } from "../../utils/useSellerVerification";
import IdentityVerificationModal from "../../components/IdentityVerificationModal/IdentityVerificationModal";

function SellerDashboard() {
  const navigate = useNavigate();

  const API =
    "https://real-estate-market-place-api.vercel.app/api/v1";

  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

const { verification, isApproved, loading: verifyLoading, refetch } = useSellerVerification();
const [showVerificationModal, setShowVerificationModal] = useState(false);
const [clearingAll, setClearingAll] = useState(false);

const handleAddPropertyClick = (e) => {
  e.preventDefault();

  if (verifyLoading) return;

  if (isApproved) {
    navigate("/sell-property");
  } else {
    setShowVerificationModal(true);
  }
};

useEffect(() => {
  if (isApproved && showVerificationModal) {
    setShowVerificationModal(false);
    navigate("/sell-property");
  }
}, [isApproved, showVerificationModal, navigate]);

  // =========================
  // Fetch Dashboard Data
  // =========================

const getDashboardData = async () => {
  try {
    setLoading(true);
    setError("");

    // =========================
    // Get current seller
    // =========================

    const profileResponse = await apiFetch(
      `${API}/users/profile`,
      {
        method: "GET",
      }
    );

    const profileResult = await profileResponse.json();

    if (!profileResponse.ok) {
      if (profileResponse.status === 401) {
        navigate("/auth/login");
        return;
      }

      throw new Error(
        profileResult.message || "Failed to load profile"
      );
    }

    const currentUser = profileResult.data?.user;

    if (!currentUser) {
      throw new Error("User data not found");
    }

    setUser(currentUser);

    // =========================
    // Get seller properties
    // =========================

    const myProperties = Array.isArray(currentUser.listings)
      ? currentUser.listings
      : [];

    setProperties(myProperties);

  } catch (error) {
    console.error("Dashboard error:", error);
    setError(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    getDashboardData();
  }, []);

  // =========================
  // Delete Property
  // =========================

  const handleDelete = async (property) => {
    const result = await Swal.fire({
      title: "Delete property?",
      text: `Are you sure you want to delete "${property.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(property._id);

      const response = await apiFetch(
        `${API}/listings/${property._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/auth/login");
          return;
        }

        if (response.status === 403) {
          throw new Error(
            "Only sellers can delete their properties."
          );
        }

        throw new Error(
          data.message || "Failed to delete property"
        );
      }

      // Remove deleted property from UI
      setProperties((prev) =>
        prev.filter((item) => item._id !== property._id)
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Your property has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Delete error:", error);

      Swal.fire({
        title: "Something went wrong",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDeletingId(null);
    }
  };


const handleClearAll = async () => {
  if (properties.length === 0) return;

  const result = await Swal.fire({
    title: "Clear all properties?",
    text: `This will permanently delete all ${properties.length} of your properties. This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete all",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    setClearingAll(true);

    const deleteResults = await Promise.allSettled(
      properties.map((property) =>
        apiFetch(`${API}/listings/${property._id}`, {
          method: "DELETE",
        })
      )
    );

    const failed = deleteResults.filter(
      (res) => res.status === "rejected" || !res.value?.ok
    );

    if (failed.length > 0) {
      await Swal.fire({
        title: "Some properties couldn't be deleted",
        text: `${properties.length - failed.length} out of ${properties.length} properties were deleted successfully.`,
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      await Swal.fire({
        title: "All properties deleted!",
        text: "Your property list has been cleared successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }

    await getDashboardData();
  } catch (error) {
    console.error("Clear all error:", error);

    Swal.fire({
      title: "Something went wrong",
      text: "Failed to clear properties. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    setClearingAll(false);
  }
};

  
  // =========================
  // Edit Property
  // =========================

  const handleEdit = (property) => {
    navigate(`/edit-property/${property._id}`, {
      state: {
        property,
      },
    });
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fa-solid fa-circle-exclamation"></i>

        <h2>Unable to load dashboard</h2>

        <p>{error}</p>

        <button onClick={getDashboardData}>
          Try Again
        </button>
      </div>
    );
  }

  // =========================
  // Statistics
  // =========================

  const totalProperties = properties.length;

  const totalViews = properties.reduce(
    (total, property) =>
      total + Number(property.viewingCount || 0),
    0
  );

  const totalSales = properties.filter(
    (property) =>
      property.status === "sold" ||
      property.soldAt
  ).length;

  const forSale = properties.filter(
    (property) =>
      property.listingType === "sale" &&
      property.status !== "sold"
  ).length;

  const forRent = properties.filter(
    (property) =>
      property.listingType === "rent" &&
      property.status !== "sold"
  ).length;

  const sold = properties.filter(
    (property) =>
      property.status === "sold" ||
      property.soldAt
  ).length;

  const pending = properties.filter(
    (property) => property.status === "pending"
  ).length;

  const approved = properties.filter(
    (property) => property.status === "approved"
  ).length;

const listingTypeTotal = forSale + forRent;

const forSaleDeg = listingTypeTotal
  ? (forSale / listingTypeTotal) * 360
  : 0;

const forRentDeg = listingTypeTotal
  ? forSaleDeg + (forRent / listingTypeTotal) * 360
  : 0;
  // =========================
  // Date
  // =========================

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // =========================
  // Greeting
  // =========================

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

const filteredProperties = properties.filter((property) => {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return true;

  return (
    property.title?.toLowerCase().includes(term) ||
    property.location?.address?.toLowerCase().includes(term) ||
    property.location?.city?.toLowerCase().includes(term)
  );
});

  return (
    <div className="dashboard-page">

      {/* ================= BACK BUTTON ================= */}

      <Link
        to="/home"
        className="dashboard-back"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back to Home
      </Link>


      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            {greeting},{" "}
            {user?.fullName || "Seller"} 👋
          </h1>

          <p>
            Here's what's happening with your properties today.
          </p>

        </div>

        <div className="dashboard-header-actions">

          <div className="date-btn">
            <i className="fa-regular fa-calendar"></i>

            Today, {today}

          </div>

<button
  type="button"
  onClick={handleAddPropertyClick}
  disabled={verifyLoading}
  className="add-property-btn"
>
  <i className="fa-solid fa-plus"></i>
  {verifyLoading ? "Checking..." : "Add Property"}
</button>

        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <div className="stat-icon">
            <i className="fa-solid fa-house"></i>
          </div>

          <div>
            <span>Total Properties</span>

            <strong>
              {totalProperties}
            </strong>

          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon">
            <i className="fa-solid fa-eye"></i>
          </div>

          <div>
            <span>Total Views</span>

            <strong>
              {totalViews.toLocaleString()}
            </strong>

          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon">
            <i className="fa-solid fa-envelope"></i>
          </div>

          <div>
            <span>For Sale</span>

            <strong>
              {forSale}
            </strong>

          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon">
            <i className="fa-solid fa-chart-column"></i>
          </div>

          <div>
            <span>Total Sales</span>

            <strong>
              {totalSales}
            </strong>

          </div>

        </div>

      </section>


      {/* ================= CHARTS ================= */}

      <section className="dashboard-charts">

        {/* Views Overview */}

        <div className="dashboard-card views-card">

          <div className="card-header">
            <h2>Views Overview</h2>

            <button>
              Last 7 days
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>


          <div className="chart-area">

            <div className="y-axis">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>


            <div className="line-chart">

              <div className="grid-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>


              <svg
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >

                <defs>

                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#d4af37"
                      stopOpacity="0.45"
                    />

                    <stop
                      offset="100%"
                      stopColor="#d4af37"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>


                <path
                  d="M0 170 
                  C35 160, 45 130, 75 145 
                  C105 160, 125 115, 155 135 
                  C185 155, 210 125, 235 135 
                  C265 150, 280 85, 315 105 
                  C350 125, 360 145, 395 110 
                  C430 75, 455 130, 485 100 
                  C515 70, 535 85, 560 45 
                  C575 25, 590 55, 600 35 
                  L600 220 L0 220 Z"
                  fill="url(#chartGradient)"
                />


                <path
                  d="M0 170 
                  C35 160, 45 130, 75 145 
                  C105 160, 125 115, 155 135 
                  C185 155, 210 125, 235 135 
                  C265 150, 280 85, 315 105 
                  C350 125, 360 145, 395 110 
                  C430 75, 455 130, 485 100 
                  C515 70, 535 85, 560 45 
                  C575 25, 590 55, 600 35"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

              </svg>


              <div className="x-axis">
                <span>Sep 1</span>
                <span>Sep 2</span>
                <span>Sep 3</span>
                <span>Sep 4</span>
                <span>Sep 5</span>
                <span>Sep 6</span>
              </div>

            </div>

          </div>

        </div>


        {/* Property Status */}

        <div className="dashboard-card status-card">

          <div className="card-header">
            <h2>Property Status</h2>
          </div>


          <div className="status-content">

<div
  className="donut-chart"
  style={{
    background:
      listingTypeTotal > 0
        ? `conic-gradient(
            #d4af37 0deg ${forSaleDeg}deg,
            #666 ${forSaleDeg}deg ${forRentDeg}deg
          )`
        : "#333",
  }}
>
  <div className="donut-center">
    <strong>{listingTypeTotal}</strong>
    <span>Total</span>
  </div>
</div>
<div className="status-list">
  <div>
    <span className="status-dot sale"></span>
    <p>For Sale</p>
    <strong>{forSale}</strong>
  </div>

  <div>
    <span className="status-dot rent"></span>
    <p>For Rent</p>
    <strong>{forRent}</strong>
  </div>
</div>

          </div>

        </div>

      </section>


      {/* ================= BOTTOM ================= */}

      <section className="dashboard-bottom">


        {/* ================= MY PROPERTIES ================= */}

    <div className="dashboard-card recent-card">

<div className="card-header">
  <div>
    <h2>My Properties</h2>
    <p className="text-warning">Manage your property listings</p>
  </div>

  <input
    type="text"
    className="property-search-input"
    placeholder="Search by title, address, or city..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <div className="my-properties-actions">
    {properties.length > 0 && (
      <button
        type="button"
        className="clear-all-btn"
        onClick={handleClearAll}
        disabled={clearingAll}
      >
        {clearingAll ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            Clearing...
          </>
        ) : (
          <>
            <i className="fa-solid fa-trash-can"></i>
            Clear All
          </>
        )}
      </button>
    )}

  </div>
</div>
  {filteredProperties.length === 0 ? (
    properties.length === 0 ? (
      <div className="dashboard-empty">
        <i className="fa-solid fa-house"></i>
        <h3>No properties yet</h3>
        <p>Add your first property to start managing your listings.</p>
<div className="my-properties-actions">
  <button
    type="button"
    onClick={handleAddPropertyClick}
    disabled={verifyLoading}
    className="view-all"
  >
    <i className="fa-solid fa-plus"></i>
    Add Property
  </button>
</div>
      </div>
    ) : (
      <p className="dashboard-empty-search">No properties match your search.</p>
    )
  ) : (
    <div className="property-list property-list-scroll">
      {filteredProperties.map((property) => (
        <div className="property-row" key={property._id}>
          <img
            src={property.images?.[0] || "/placeholder.jpg"}
            alt={property.title}
          />

          <div className="property-name">
            <strong>{property.title}</strong>
            <span>
              {property.location?.address ||
                property.location?.city ||
                "Location not available"}
            </span>
          </div>

          <span className="property-price">
            EGP {Number(property.price || 0).toLocaleString()}
          </span>

          <span
            className={`property-status ${
              (property.status || "pending") === "pending"
                ? "pending"
                : property.status === "sold"
                ? "sold"
                : property.listingType === "rent"
                ? "for-rent"
                : "for-sale"
            }`}
          >
            {(property.status || "pending") === "pending"
              ? "Pending"
              : property.status === "sold"
              ? "Sold"
              : property.listingType === "rent"
              ? "For Rent"
              : "For Sale"}
          </span>

          <div className="property-actions">
            <button type="button" className="edit-property-btn" onClick={() => handleEdit(property)}>
              <i className="fa-solid fa-pen"></i>
              Edit
            </button>

            <button
              type="button"
              className="delete-property-btn"
              disabled={deletingId === property._id}
              onClick={() => handleDelete(property)}
            >
              {deletingId === property._id ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-trash"></i>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

</div>


        {/* ================= SELLER INFORMATION ================= */}

        <div className="dashboard-card recent-card">

          <div className="card-header">
            <h2>Seller Information</h2>
          </div>


          <div className="seller-dashboard-info">

            <img
              src={
                user?.userImage ||
                userImg
              }
              alt={user?.fullName || "Seller"}
            />


            <div>

              <h3>
                {user?.fullName || "Seller"}
              </h3>

              <p>
                {user?.email || "Email not available"}
              </p>

              <p>
                {user?.phoneNumber ||
                  "Phone number not available"}
              </p>

            </div>

          </div>


          <div className="seller-dashboard-stats">

            <div>
              <span>Approved</span>
              <strong>{approved}</strong>
            </div>

            <div>
              <span>For Rent</span>
              <strong>{forRent}</strong>
            </div>

            <div>
              <span>Views</span>
              <strong>
                {totalViews.toLocaleString()}
              </strong>
            </div>

          </div>

          <Link
            to="/profile"
            className="dashboard-profile-link"
          >
            View Profile
            <i className="fa-solid fa-arrow-right"></i>
          </Link>

        </div>

      </section>
      {showVerificationModal && (
        <IdentityVerificationModal
          verification={verification}
          onClose={() => setShowVerificationModal(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
}

export default SellerDashboard;