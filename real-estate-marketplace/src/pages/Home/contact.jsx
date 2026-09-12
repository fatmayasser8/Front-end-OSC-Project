import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowLeft, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import "../../styles/contact.css";
 
function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneNumber = "201116440515"; 

    
    const text = `*New Message from Contact Form*\n\n` +
                 `*Name:* ${formData.fullName}\n` +
                 `*Email:* ${formData.email}\n` +
                 `*Subject:* ${formData.subject}\n` +
                 `*Message:* ${formData.message}`;

  
    const encodedText = encodeURIComponent(text);

  
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');

    setFormData({ fullName: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact">
      <div className="main-content full-width">
        <Link to="/home" className="back-to-home">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>
 
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
                <p>fatma3p0@gmail.com</p>
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
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="fullName"
                placeholder="Full Name" 
                className="form-input" 
                value={formData.fullName}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
 
              <select 
                name="subject"
                className="form-input select-placeholder" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Support">Support</option>
              </select>
 
              <textarea 
                name="message"
                placeholder="Message" 
                rows="3" 
                className="form-textarea"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" className="submit-btn">
                <FaPaperPlane className="send-icon" />
                <span>Send message</span>
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