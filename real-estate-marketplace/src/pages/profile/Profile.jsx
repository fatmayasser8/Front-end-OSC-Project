import userImg from "../../assets/user-img.jpg";
import "../../styles/Profile.css";
import { Link } from "react-router-dom";
function Profile() {
  return (
    <div className="profile-page">

      {/* ================= Profile Header ================= */}
      <section className="upper-profile">

        {/* Back Button */}
        <Link to="/home" className="profile-back">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Home
        </Link>

        <div className="wrapper">

          <div className="left-profile">

            <div className="profile-pic">
              <img src={userImg} alt="userImg" />
            </div>

            <div className="content">
              <h2>Malak Mohamed</h2>
              <p>Malak@example.com</p>
            </div>

          </div>

          <div className="right-profile">
            <button className="editeBtn">
              <i className="fa-solid fa-pen"></i>
              Edit Profile
            </button>
          </div>

        </div>
      </section>


      {/* ================= Statistics ================= */}
      <section className="profile-stats">

        <div className="stat">
          <h3>5</h3>
          <p>Properties Saved</p>
        </div>

        <div className="stat">
          <h3>3</h3>
          <p>Properties Listed</p>
        </div>

        <div className="stat">
          <h3>12</h3>
          <p>Total Views</p>
        </div>

      </section>



      {/* ================= Profile Details ================= */}

      <section className="profile-details">

        {/* Personal Information */}
        <div className="profile-box">

          <h2>Personal Information</h2>

          <div className="info-item">
            <i className="fa-solid fa-user"></i>
            <div>
              <span>Full Name</span>
              <p>Malak Mohamed</p>
            </div>
          </div>

          <div className="info-item">
            <i className="fa-solid fa-envelope"></i>
            <div>
              <span>Email</span>
              <p>Malak@example.com</p>
            </div>
          </div>

          <div className="info-item">
            <i className="fa-solid fa-phone"></i>
            <div>
              <span>Phone</span>
              <p>+20 123 456 7890</p>
            </div>
          </div>

          <div className="info-item">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <span>Location</span>
              <p>Cairo, Egypt</p>
            </div>
          </div>

          <button className="edit-info-btn">
            Edit
          </button>

        </div>


        {/* Recent Activity */}
        <div className="profile-box activity-box">

          <h2>Recent Activity</h2>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fa-regular fa-heart"></i>
            </div>

            <div className="activity-content">
              <p>Saved a property</p>
              <span>Luxury Villa in New Cairo</span>
              <small>2 hours ago</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fa-solid fa-house"></i>
            </div>

            <div className="activity-content">
              <p>Listed a new property</p>
              <span>Modern Villa in New Cairo</span>
              <small>Yesterday</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fa-regular fa-eye"></i>
            </div>

            <div className="activity-content">
              <p>Your property received 8 views</p>
              <span>Luxury Villa</span>
              <small>2 days ago</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fa-regular fa-message"></i>
            </div>

            <div className="activity-content">
              <p>New message received</p>
              <span>From Ahmed Mohamed</span>
              <small>3 days ago</small>
            </div>
          </div>

        </div>

      </section>


    </div>
  );
}

export default Profile;