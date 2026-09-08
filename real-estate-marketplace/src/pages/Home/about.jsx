import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaShieldAlt,
  FaHeadset,
  FaBullseye,
} from "react-icons/fa";
import "../../styles/about.css";

function About() {
  return (
    <div className="about">
      <div className="main-content full-width">
        <Link to="/" className="back-to-home">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>

        <section className="about-hero">
          <div className="hero-content">
            <span className="hero-badge">About NOVA</span>
            <h1>
              More Than Just
              <br />
              <span>Real Estate</span>
            </h1>
            <p>
              We're on a mission to make finding your dream home a simple,
              seamless, and enjoyable experience.
            </p>
          </div>
        </section>

        <div className="about-details-wrapper">
          <div className="our-story-column">
            <h2>Our Story</h2>
            <p>
              NOVA was founded with a simple vision: to create a better way
              to find, buy, and rent properties. We believe that a home is
              more than just a place — it's where your story begins.
            </p>
            <p>
              With a passion for real estate and a commitment to excellence,
              we built NOVA to connect people with the right properties, in
              the right places, at the right time.
            </p>

            <div className="our-story-icons">
              <div className="story-icon-item">
                <FaShieldAlt className="story-icon" />
                <span>Trusted &amp; Secure</span>
              </div>
              <div className="story-icon-item">
                <FaHeadset className="story-icon" />
                <span>Dedicated Support</span>
              </div>
              <div className="story-icon-item">
                <FaBullseye className="story-icon" />
                <span>Your Goals Our Priority</span>
              </div>
            </div>
          </div>

          <div className="our-values-column">
            <div className="our-values-image" />
            <h2>Our Values</h2>
            <ul className="values-list">
              <li>
                <FaCheck className="check-icon" /> Integrity &amp; Transparency
              </li>
              <li>
                <FaCheck className="check-icon" /> Customer Satisfaction
              </li>
              <li>
                <FaCheck className="check-icon" /> Innovation
              </li>
              <li>
                <FaCheck className="check-icon" /> Long-Term Relationships
              </li>
            </ul>
          </div>
        </div>

        <section className="cta-banner">
          <h2>Let's Find Your Next Home</h2>
          <p>
            Whether you're buying, renting, or investing — we're here to help
            you every step of the way.
          </p>
          <Link to="/propertyDetails" className="explore-btn">
            Explore Properties →
          </Link>
        </section>

        <footer className="footer-bottom">
          NOVA | Find Your Dream Home
        </footer>
      </div>
    </div>
  );
}

export default About;