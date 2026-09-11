import { useEffect, useState } from "react";
import userImg from "../../assets/user-img.jpg";
import "../../styles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= Edit Profile State =================
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phoneNumber: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ================= Image Upload State =================

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
// ================= Image Delete State =================
  const [deletingImage, setDeletingImage] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);

  const getProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/profile",
        {
          method: "GET",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/auth/login");
          return;
        }
        throw new Error(result.message || "Failed to get profile");
      }

      console.log("Profile Response:", result);

      setUser(result.data.user);
    } catch (error) {
      console.error("Profile error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // ================= Edit Profile Handlers =================
const handleStartEdit = () => {
  setSaveError("");
  setImageError("");

  setEditForm({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  // Save the original image before editing
  setOriginalImage(user?.userImage || null);

  setIsEditing(true);
};

const handleCancelEdit = () => {
  setIsEditing(false);

  setSaveError("");
  setImageError("");

  // Restore original image
  setUser((prev) => ({
    ...prev,
    userImage: originalImage,
  }));
};

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSaveProfile = async (e) => {
  e.preventDefault();
  setSaveError("");

  if (!editForm.fullName.trim()) {
    setSaveError("Full name is required.");
    return;
  }

  try {
    setSavingProfile(true);

    // ================= Save Profile Data =================

    const response = await apiFetch(
      "https://real-estate-market-place-api.vercel.app/api/v1/users/profile",
      {
        method: "PATCH",
        body: JSON.stringify({
          fullName: editForm.fullName.trim(),
          phoneNumber: editForm.phoneNumber.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        navigate("/auth/login");
        return;
      }

      throw new Error(
        result.message || "Failed to update profile"
      );
    }

    // ================= Check Image =================

    // If the original image existed
    // but the current image was removed
    if (originalImage && !user?.userImage) {
      const deleteResponse = await apiFetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/profile-image",
        {
          method: "DELETE",
        }
      );

      const deleteResult = await deleteResponse.json();

      if (!deleteResponse.ok) {
        throw new Error(
          deleteResult.message || "Failed to delete image"
        );
      }
    }

    // ================= Update User =================

    setUser((prev) => ({
      ...prev,
      fullName: editForm.fullName.trim(),
      phoneNumber: editForm.phoneNumber.trim(),
    }));

    setOriginalImage(user?.userImage || null);

    setIsEditing(false);

  } catch (err) {
    console.error("Update profile error:", err);

    setSaveError(
      err.message || "Something went wrong while saving."
    );
  } finally {
    setSavingProfile(false);
  }
};

  // ================= Image Upload Handler =================
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);


console.log("Selected file:", file);
console.log("FormData image:", formData.get("image"));

    try {
      setUploadingImage(true);

      const response = await apiFetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/profile-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

  console.log("Upload status:", response.status);
  console.log("Upload result:", result);


      if (!response.ok) {
        if (response.status === 401) {
          navigate("/auth/login");
          return;
        }
        throw new Error(result.message || "Failed to upload image");
      }

      console.log("Upload response:", result);
      setUser((prev) => ({ ...prev, userImage: result.data.userImage }));
    } catch (err) {
      console.error("Image upload error:", err);
      setImageError(err.message || "Something went wrong uploading the image.");
    } finally {
      setUploadingImage(false);
    }
  };

// ================= Image Delete Handler =================
const handleDeleteImage = () => {
  setImageError("");

  // Delete only visually for now
  setUser((prev) => ({
    ...prev,
    userImage: null,
  }));
};

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

        <button onClick={getProfile}>Try Again</button>
      </div>
    );
  }

  const requestStatus = user?.request?.status;
  const userRole = localStorage.getItem("userRole");
  const isSeller = userRole === "seller";

  return (
    <div className="profile-page min-h-screen bg-[#111] text-white">

      {/* ================= Profile Header ================= */}
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
          Back to Home
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
            sm:justify-between
          "
        >
          <div
            className="
              left-profile
              flex
              flex-row
              items-center
              gap-3
              sm:gap-[18px]
              w-full
              text-left
            "
          >
<div className="shrink-0">
  <div
    className={`
      profile-pic
      relative
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
      ${isEditing ? "group" : ""}
    `}
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

    {isEditing && (
      <>
        <label
          htmlFor="profileImageInput"
          className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            rounded-full
            bg-black/50
            cursor-pointer
          "
        >
          {uploadingImage ? (
            <i className="fa-solid fa-spinner fa-spin text-white text-lg sm:text-xl   absolute z-10 left-8 top-8"></i>
          ) : (
            <i className="fa-solid fa-camera text-white text-lg sm:text-xl 
  absolute
  z-10
  left-8
  top-8
  cursor-pointer
"></i>
          )}
        </label>

        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploadingImage || deletingImage}
          className="hidden"
        />
      </>
    )}
  </div>

  {imageError && (
    <p className="text-[#e05252] text-[10px] mt-1 max-w-[95px] break-words">
      {imageError}
    </p>
  )}
</div>

            <div className="content min-w-0">
              <h2
                className="
                  m-0
                  mb-1
                  text-white
                  text-base
                  sm:text-[25px]
                  font-bold
                  leading-tight
                  break-words
                "
              >
                {user?.fullName}
              </h2>

              <p
                className="
                  m-0
                  text-[#aaa]
                  text-[11px]
                  sm:text-sm
                  break-all
                "
              >
                {user?.email}
              </p>

              {userRole && (
                <span className={`role-badge ${isSeller ? "role-seller" : "role-buyer"}`}>
                  <i className={`fa-solid ${isSeller ? "fa-store" : "fa-house-user"}`}></i>
                  {isSeller ? "Seller" : "Buyer"}
                </span>
              )}
            </div>
          </div>
<div className="right-profile w-full sm:w-auto">
  {!isEditing ? (
    <button
      type="button"
      onClick={handleStartEdit}
      className="
        editeBtn
        w-full
        sm:w-auto
        justify-center
        px-4
        py-2
        rounded-md
        cursor-pointer
        flex
        items-center
        gap-2
        text-sm
      "
    >
      <i className="fa-solid fa-pen"></i>
      Edit Profile
    </button>
  ) : (
    <button
      type="button"
      onClick={handleDeleteImage}
      disabled={deletingImage || uploadingImage || !user?.userImage}
      className="
        editeBtn
        w-full
        sm:w-auto
        justify-center
        px-4
        py-2
        rounded-md
        cursor-pointer
        flex
        items-center
        gap-2
        text-sm
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {deletingImage ? (
        <>
          <i className="fa-solid fa-spinner fa-spin"></i>
          Removing...
        </>
      ) : (
        <>
          <i className="fa-solid fa-trash"></i>
          Remove Photo
        </>
      )}
    </button>
  )}
</div>

        </div>
      </section>


      {/* ================= Statistics ================= */}
      <section
        className="
          profile-stats
          w-[92%]
          sm:w-[95%]
          lg:w-[97%]
          mx-auto
          py-2
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-0
        "
      >

        <div
          className="
            stat
            text-center
            py-4
            sm:py-[22px]
            px-2
            sm:border-b-0
            sm:border-r
          "
        >
          <h3 className="m-0 mb-1 text-lg sm:text-[25px]">
            {user?.favoritesCount ?? 0}
          </h3>

          <p className="m-0 text-[9px] sm:text-xs text-[#777]">
            Properties Saved
          </p>
        </div>


        <div
          className="
            stat
            text-center
            py-4
            sm:py-[22px]
            px-2
            sm:border-b-0
            sm:border-r
          "
        >
          <h3
            className="
              m-0
              mb-1
              text-white
              text-xl
              sm:text-[25px]
            "
          >
            {user?.viewersCount ?? 0}
          </h3>

          <p className="m-0 text-[11px] sm:text-sm text-[#ddd]">
            Total Views
          </p>
        </div>


        <div
          className="
            stat
            text-center
            py-4
            sm:py-[22px]
            px-2
          "
        >
          <h3
            className={`
              m-0
              mb-1
              text-lg
              sm:text-sm
              font-bold
              ${
                requestStatus === "submitted"
                  ? "text-[#4caf50]"
                  : requestStatus === "pending"
                  ? "text-[#d4af37]"
                  : requestStatus === "rejected"
                  ? "text-[#e05252]"
                  : "text-[#777]"
              }
            `}
          >
            {user?.request ? "Submitted" : "Not Submitted"}
          </h3>

          <p className="m-0 text-[#777] text-[11px] sm:text-xs">
            Seller Request
          </p>
        </div>

      </section>


      {/* ================= Profile Details ================= */}
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
          lg:grid-cols-2
          gap-4
          lg:gap-[25px]
        "
      >

        {/* Personal Information */}
        <div
          className="
            profile-box
            relative
            bg-[#0d0d0d]
            rounded-[10px]
            p-5
            sm:p-[25px]
            min-h-[300px]
            sm:min-h-[330px]
          "
        >

          <h2
            className="
              m-0
              mb-5
              sm:mb-[25px]
              text-[#d4af37]
              text-base
              sm:text-lg
            "
          >
            Personal Information
          </h2>

          {!isEditing ? (
            <>
              <div
                className="
                  info-item
                  flex
                  items-center
                  gap-3
                  sm:gap-[15px]
                  mb-5
                "
              >
                <i className="fa-solid fa-user w-5 text-[#d4af37] text-center text-sm"></i>

                <div className="min-w-0">
                  <span className="block text-[#777] text-[11px] sm:text-xs mb-[3px]">
                    Full Name
                  </span>

                  <p className="m-0 text-[#ddd] text-xs sm:text-sm break-words">
                    {user?.fullName || "Not available"}
                  </p>
                </div>
              </div>


              <div
                className="
                  info-item
                  flex
                  items-center
                  gap-3
                  sm:gap-[15px]
                  mb-5
                "
              >
                <i className="fa-solid fa-envelope w-5 text-[#d4af37] text-center text-sm"></i>

                <div className="min-w-0">
                  <span className="block text-[#777] text-[11px] sm:text-xs mb-[3px]">
                    Email
                  </span>

                  <p className="m-0 text-[#ddd] text-xs sm:text-sm break-all">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>


              <div
                className="
                  info-item
                  flex
                  items-center
                  gap-3
                  sm:gap-[15px]
                  mb-5
                "
              >
                <i className="fa-solid fa-phone w-5 text-[#d4af37] text-center text-sm"></i>

                <div>
                  <span className="block text-[#777] text-[11px] sm:text-xs mb-[3px]">
                    Phone
                  </span>

                  <p className="m-0 text-[#ddd] text-xs sm:text-sm">
                    {user?.phoneNumber || "Not available"}
                  </p>
                </div>
              </div>


              <button className="edit-info-btn" onClick={handleStartEdit}>
                Edit
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveProfile}>

              <div className="mb-4">
                <label className="block text-[#777] text-[11px] sm:text-xs mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditChange}
                  className="
                    w-full
                    rounded-[8px]
                    border
                    border-[#333]
                    bg-[#181818]
                    px-3.5
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    transition
                    duration-300
                    focus:border-[#d4af37]
                  "
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#777] text-[11px] sm:text-xs mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="
                    w-full
                    rounded-[8px]
                    border
                    border-[#292929]
                    bg-[#141414]
                    px-3.5
                    py-2.5
                    text-sm
                    text-[#777]
                    outline-none
                    cursor-not-allowed
                  "
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#777] text-[11px] sm:text-xs mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleEditChange}
                  className="
                    w-full
                    rounded-[8px]
                    border
                    border-[#333]
                    bg-[#181818]
                    px-3.5
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    transition
                    duration-300
                    focus:border-[#d4af37]
                  "
                />
              </div>

              <p className="text-[#777] text-[11px] mb-4">
                Hover over your photo above to change it.
              </p>

              {saveError && (
                <p className="mb-4 text-sm text-[#e05252]">{saveError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="edit-info-btn disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingProfile ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={savingProfile}
                  className="
                    edit-info-btn
                    border-[#555]
                    text-[#aaa]
                    hover:bg-[#292929]
                    hover:text-white
                  "
                >
                  Cancel
                </button>
              </div>

            </form>
          )}

        </div>




{/* ================= Explore & Sell ================= */}

<div
  className="
    profile-box
    explore-sell-box
    relative
    bg-[#0d0d0d]
 
    rounded-[10px]
    p-6
    sm:p-8
    flex
    flex-col
    justify-between
    h-full
  "
>
  {/* Header */}
  <div className="flex items-center gap-4 mb-5">

    <div className="explore-icon shrink-0">
      <i className="fa-solid fa-building"></i>
    </div>

    <div>
      <h2
        className="
          m-0
          text-[#d4af37]
          text-xl
          sm:text-2xl
          font-semibold
        "
      >
        Find Your Next Property
      </h2>

      <p className="m-0 mt-1 text-[#666] text-xs sm:text-sm">
        Your journey to the perfect home starts here.
      </p>
    </div>

  </div>


  {/* Quick Actions */}

  <div className="flex flex-col gap-4 mb-7">

    {/* Explore */}
    <div className="quick-action flex items-center gap-4">
      <div className="quick-action-icon">
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div>
        <h3 className="m-0 text-white text-sm sm:text-base font-medium">
          Explore
        </h3>

        <p className="m-0 mt-1 text-[#777] text-xs sm:text-sm">
          Browse available properties
        </p>
      </div>
    </div>


    {/* Sell */}
    {isSeller && (
      <div className="quick-action flex items-center gap-4">
        <div className="quick-action-icon">
          <i className="fa-solid fa-house"></i>
        </div>

        <div>
          <h3 className="m-0 text-white text-sm sm:text-base font-medium">
            Sell
          </h3>

          <p className="m-0 mt-1 text-[#777] text-xs sm:text-sm">
            List your property with NOVA
          </p>
        </div>
      </div>
    )}

  </div>


  {/* Buttons */}

  <div className="flex flex-col sm:flex-row gap-3">

    {/* Explore Properties */}
    <Link
      to="/home"
      className="
        explore-property-btn
        flex
        items-center
        justify-center
        gap-2
        px-5
        py-3
        rounded-md
        no-underline
        text-sm
        font-medium
        flex-1
      "
    >
      <i className="fa-solid fa-compass"></i>
      Explore Properties
    </Link>


    {/* Sell Your Property */}
    {isSeller && (
      <Link
        to="/sell-property"
        className="
          sell-property-btn
          flex
          items-center
          justify-center
          gap-2
          px-5
          py-3
          rounded-md
          no-underline
          text-sm
          font-medium
          flex-1
        "
      >
        <i className="fa-solid fa-plus"></i>
        Sell Your Property
      </Link>
    )}

  </div>

</div>



      </section>

    </div>
  );
}

export default Profile;