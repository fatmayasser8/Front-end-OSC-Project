import Navbar from "../../components/Navbar/navbar";
import Sidebar from "../../components/sideBar/sideBar";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import "../../styles/contact.css";

function Contact() {
  return (
    <div className="contact">
      <Sidebar />

      <div className="main-content">
        <Navbar />
        
        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">Get in touch</span>
            <h1>
              We're Here to Help
              <br />
              <span>You</span>
            </h1>
            <p>
              Have questions, feedback, or need assistance?<br />
              Our team is just a message away.
            </p>
          </div>
        </section>

        <div className="contact-details-wrapper">
          <div className="contact-info-column">
            <h2>Contact Information</h2>
            
            <div className="info-item">
              <MdPhone className="info-icon" />
              <div>
                <strong>Phone</strong>
                <p>+20 1116440515 (Sun - Thu, 9AM - 6PM)</p>
              </div>
            </div>

            <div className="info-item">
              <MdEmail className="info-icon" />
              <div>
                <strong>Email</strong>
                <p>support@nova.com (Responds within 24h)</p>
              </div>
            </div>

            <div className="info-item">
              <MdLocationOn className="info-icon" />
              <div>
                <strong>Office Address</strong>
                <p>123 Nile Street, New Cairo, Egypt</p>
              </div>
            </div>

            <div className="follow-us-section">
              <strong>Follow Us</strong>
              <div className="social-icons">
                <a href="#" className="social-icon"><FaFacebookF /></a>
                <a href="#" className="social-icon"><FaTwitter /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
                <a href="#" className="social-icon"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>

          <div className="contact-form-column">
            <h2>Send Us a Message</h2>
            <form className="contact-form">
              <input type="text" placeholder="Full Name" className="form-input" />
              <input type="email" placeholder="Email Address" className="form-input" />
              
              <select className="form-input select-placeholder" defaultValue="">
                <option value="" disabled>Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support</option>
              </select>

              <textarea placeholder="Message" rows="3" className="form-textarea"></textarea>
              <button type="submit" className="submit-btn">
                <FaPaperPlane className="send-icon" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        <footer className="footer-bottom">
          NOVA | Find Your Dream Home
        </footer>
      </div>
    </div>
  );
}

export default Contact;