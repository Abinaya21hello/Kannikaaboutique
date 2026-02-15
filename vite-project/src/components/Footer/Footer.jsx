import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaPinterestP,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaHeart,
  FaWhatsapp
} from 'react-icons/fa'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

function Footer() {
  const currentYear = new Date().getFullYear()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [messageTimeout, setMessageTimeout] = useState(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    })
  }, [])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      if (messageTimeout) clearTimeout(messageTimeout)
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)
      setMessageTimeout(timeout)
    }
    return () => {
      if (messageTimeout) clearTimeout(messageTimeout)
    }
  }, [message])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    // Validate phone number
    if (!phoneNumber) {
      setMessage({ type: 'error', text: 'Phone number required' })
      return
    }
    
    // Basic Indian phone number validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phoneNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit Indian mobile number' })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      // Format phone number with country code
      const formattedPhone = `+91${phoneNumber}`
      
      console.log('Sending subscription request:', { 
        phone: formattedPhone
      });

      const response = await axios.post('http://localhost:5000/api/contact/subscribe', {
        phone: formattedPhone  // Changed to 'phone' with country code
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Subscription response:', response.data)
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Successfully subscribed to WhatsApp updates!' 
      })
      setPhoneNumber('') // Clear input on success
      
    } catch (error) {
      console.error('Subscription error:', error)
      
      let errorMessage = 'Failed to subscribe. Please try again.'
      
      if (error.response) {
        console.log('Error response data:', error.response.data)
        console.log('Error response status:', error.response.status)
        
        if (error.response.status === 400) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message
          } else if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error
          } else {
            errorMessage = 'Invalid phone number format'
          }
        } else if (error.response.status === 409) {
          errorMessage = 'This number is already subscribed'
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.'
      }
      
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '')
    // Limit to 10 digits
    if (value.length <= 10) {
      setPhoneNumber(value)
    }
  }

  return (
    <footer className="footer">
      {/* Decorative Top Border with AOS */}
      <div className="footer-top-border" data-aos="fade-down">
        <div className="border-line"></div>
        <span className="border-icon">👑</span>
        <div className="border-line"></div>
      </div>

      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Column 1 - Brand Info */}
          <div className="footer-col brand-col" data-aos="fade-right" data-aos-delay="100">
            <h2 className="footer-brand">
              <span className="brand-name">Kannikaa Boutique</span>
            </h2>
            <p className="footer-tagline">Crafting elegance since 2009</p>
            <p className="footer-description">
              Specializing in designer sarees, custom-made blouses, and ceremonial ensembles 
              for women and kids. Where tradition meets contemporary elegance.
            </p>
            
            {/* Social Links */}
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Pinterest">
                <FaPinterestP />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer-col" data-aos="fade-up" data-aos-delay="200">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/new-arrivals">New Arrivals</Link></li>
              <li><Link to="/sarees">Sarees</Link></li>
              <li><Link to="/blouses">Custom Blouses</Link></li>
              <li><Link to="/bridal">Bridal Collection</Link></li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div className="footer-col" data-aos="fade-up" data-aos-delay="300">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="footer-col" data-aos="fade-left" data-aos-delay="400">
            <h3 className="footer-title">Get In Touch</h3>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Boutique Lane, Fashion District, Mumbai - 400001</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@kannikaaboutique.com</span>
              </li>
            </ul>

            {/* WhatsApp Subscription Form */}
            <div className="newsletter">
              <h4 className="newsletter-title">
                <FaWhatsapp className="whatsapp-icon" /> WhatsApp Daily Style Updates
              </h4>
              
              {/* Message Display */}
              {message.text && (
                <div className={`subscription-message ${message.type}`}>
                  {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
              )}
              
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    className="newsletter-input"
                    maxLength="10"
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit" 
                  className={`newsletter-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              <p className="newsletter-note">
                Get daily updates on new arrivals and exclusive offers
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section - Features with AOS */}
        <div className="footer-features">
          <div className="feature-item" data-aos="zoom-in" data-aos-delay="100">
            <span className="feature-icon">🚚</span>
            <div className="feature-text">
              <h4>Free Shipping</h4>
              <p>On orders above ₹5000</p>
            </div>
          </div>
          <div className="feature-item" data-aos="zoom-in" data-aos-delay="200">
            <span className="feature-icon">✓</span>
            <div className="feature-text">
              <h4>COD Available</h4>
              <p>Cash on delivery</p>
            </div>
          </div>
          <div className="feature-item" data-aos="zoom-in" data-aos-delay="300">
            <span className="feature-icon">↩️</span>
            <div className="feature-text">
              <h4>Easy Returns</h4>
              <p>7-day return policy</p>
            </div>
          </div>
          <div className="feature-item" data-aos="zoom-in" data-aos-delay="400">
            <span className="feature-icon">🔒</span>
            <div className="feature-text">
              <h4>Secure Payment</h4>
              <p>100% secure transactions</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom" data-aos="fade-up">
          <div className="payment-methods">
            <span className="payment-label">We Accept:</span>
            <div className="payment-icons">
              <FaCcVisa className="payment-icon" />
              <FaCcMastercard className="payment-icon" />
              <FaCcPaypal className="payment-icon" />
              <FaCcAmex className="payment-icon" />
              <span className="payment-icon-text">UPI</span>
              <span className="payment-icon-text">COD</span>
            </div>
          </div>

          <div className="copyright">
            <p>
              © {currentYear} Kannikaa Boutique. All Rights Reserved. 
              Made with <FaHeart className="heart-icon" /> in India
            </p>
          </div>

          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/terms">Terms of Use</Link>
            <span className="separator">|</span>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Background Decoration with AOS - Using Yellow & Green */}
      <div className="footer-bg">
        <div className="bg-circle circle-1" data-aos="fade-right" data-aos-duration="1500"></div>
        <div className="bg-circle circle-2" data-aos="fade-left" data-aos-duration="1500"></div>
        <div className="bg-circle circle-3" data-aos="fade-up" data-aos-duration="1500"></div>
        <div className="bg-circle circle-4" data-aos="fade-down" data-aos-duration="1500"></div>
        <div className="bg-line line-1" data-aos="slide-right" data-aos-duration="2000"></div>
        <div className="bg-line line-2" data-aos="slide-left" data-aos-duration="2000"></div>
        <div className="bg-dot dot-1" data-aos="zoom-in" data-aos-duration="1000"></div>
        <div className="bg-dot dot-2" data-aos="zoom-in" data-aos-duration="1000"></div>
        <div className="bg-dot dot-3" data-aos="zoom-in" data-aos-duration="1000"></div>
        <div className="bg-dot dot-4" data-aos="zoom-in" data-aos-duration="1000"></div>
      </div>
    </footer>
  )
}

export default Footer