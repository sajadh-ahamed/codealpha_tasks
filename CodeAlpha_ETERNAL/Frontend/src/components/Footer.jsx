import { useState } from 'react'
import { FiMail, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert(`Thank you for subscribing with ${email}!`)
      setEmail('')
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo-wrapper">
              <img src="/assets/logo/logo.png" alt="ETERNAL" className="footer-logo" />
              <h3 className="footer-title eternal-brand">ETERNAL</h3>
            </div>
            <p className="footer-description">
              Your premier destination for exquisite timepieces. Discover elegance, precision, and style.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <FiFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <FiTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <FiInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/?category=Men">Men's Watches</a></li>
              <li><a href="/?category=Women">Women's Watches</a></li>
              <li><a href="/?category=Smart">Smart Watches</a></li>
              <li><a href="/?category=Luxury">Luxury Collection</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-heading">Customer Service</h4>
            <ul className="footer-links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Warranty</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="footer-heading">Newsletter</h4>
            <p className="footer-description">
              Subscribe to get special offers and updates on new arrivals.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="newsletter-input-group">
                <FiMail className="newsletter-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
              </div>
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ETERNAL. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-credit" style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Website built by <strong>Sajadh Ahamed</strong> | 
            <a href="mailto:rafausajadh@gmail.com" style={{ margin: '0 4px' }}>rafausajadh@gmail.com</a> | 
            <a href="tel:0789143352" style={{ margin: '0 4px' }}>0789143352</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
