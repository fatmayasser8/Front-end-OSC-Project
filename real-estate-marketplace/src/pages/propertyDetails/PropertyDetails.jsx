import "../../styles/PropertyDetails.css";

import villa1 from "../../assets/hero.png";
// import villa2 from "../../assets/villa2.jpg";
// import villa3 from "../../assets/villa3.jpg";
// import villa4 from "../../assets/villa4.jpg";
import userImg from "../../assets/user-img.jpg";
import { Link } from "react-router-dom";

function PropertyDetails() {
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
            <img src={villa1} alt="Villa" />
            <img src={villa1} alt="Villa" />
            <img src={villa1} alt="Villa" />
            <img src={villa1} alt="Villa" />
          </div>

          <div className="main-image">

            <img src={villa1} alt="Luxury Villa" />

            <span className="image-count">
              1 / 10
            </span>

            <button className="image-arrow left">
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <button className="image-arrow right">
              <i className="fa-solid fa-chevron-right"></i>
            </button>

          </div>

        </div>


        {/* ================= PROPERTY INFO ================= */}
        <div className="property-info">

          <span className="purpose">
            For Sale
          </span>

          <h1>
            Luxury Villa
          </h1>

          <div className="property-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>
              New Cairo, Cairo, Egypt
            </span>
          </div>

          <div className="property-price">
            EGP 8,500,000
          </div>


          {/* Property Meta */}
          <div className="property-meta">

            <div>
              <i className="fa-solid fa-bed"></i>
              <span>5 Beds</span>
            </div>

            <div>
              <i className="fa-solid fa-bath"></i>
              <span>3 Baths</span>
            </div>

            <div>
              <i className="fa-solid fa-maximize"></i>
              <span>160 sqm</span>
            </div>

          </div>


          {/* Actions */}
          <div className="property-actions">

            <button>
              <i className="fa-regular fa-heart"></i>
              Save
            </button>

            <button>
              <i className="fa-solid fa-share-nodes"></i>
              Share
            </button>

            <button className="contact-btn">
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
                  src={userImg}
                  alt="Seller"
                />
              </div>

              <div>

                <h3>
                  Malak Mohamed
                </h3>

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
                +20 123 456 7890
              </p>

              <p>
                <i className="fa-solid fa-envelope"></i>
                malak@example.com
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

              <li>
                <i className="fa-solid fa-check"></i>
                Private Garden
              </li>

              <li>
                <i className="fa-solid fa-check"></i>
                Swimming Pool
              </li>

              <li>
                <i className="fa-solid fa-check"></i>
                Modern Design
              </li>

              <li>
                <i className="fa-solid fa-check"></i>
                24/7 Security
              </li>

              <li>
                <i className="fa-solid fa-check"></i>
                Parking Space
              </li>

              <li>
                <i className="fa-solid fa-check"></i>
                Central Air Conditioning
              </li>

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
            A luxurious villa with modern design, spacious interiors,
            and a private garden. Located in a premium compound in
            New Cairo, close to all essential services and facilities.
            The villa offers comfort, privacy, and elegance, making it
            the perfect choice for families looking for a high-end lifestyle.
          </p>


          {/* Overview Images */}
          <div className="overview-images">

            <img
              src={villa1}
              alt="Interior"
            />

            <img
              src={villa1}
              alt="Interior"
            />

            <img
              src={villa1}
              alt="Interior"
            />

            <img
              src={villa1}
              alt="Villa"
            />

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
            src="https://www.google.com/maps?q=New+Cairo,+Cairo,+Egypt&output=embed"
            loading="lazy"
          ></iframe>

        </div>


        <button className="directions-btn">

          <i className="fa-solid fa-location-arrow"></i>

          Get Directions

        </button>

      </section>

    </div>
  );
}

export default PropertyDetails;