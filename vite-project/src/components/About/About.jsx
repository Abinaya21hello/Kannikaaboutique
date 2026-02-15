import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css'
import { FaQuoteRight, FaLeaf, FaHeart, FaStar, FaInstagram, FaFacebookF, FaTwitter, FaPinterestP, FaTruck, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'

function About() {
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
    window.scrollTo(0, 0) // Scroll to top when page loads
  }, [])

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero" data-aos="fade-down">
        <h1 className="about-title">
          <span className="title-highlight">ABOUT</span> KANNIKAA
        </h1>
        <div className="title-decoration">
          <span className="line"></span>
          <FaLeaf className="leaf-icon" />
          <span className="line"></span>
        </div>
        <p className="hero-subtitle">Crafting Elegance Since 2009</p>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* Left Column - Image with Sticky Effect */}
        <div className="about-image-column" data-aos="fade-right">
          <div className="sticky-image-wrapper">
            <div className="image-frame">
              <img 
                src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80" 
                alt="Designer Saree"
                className="main-image"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <FaQuoteRight className="quote-icon" />
                  <p>Where tradition meets elegance</p>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="floating-badge badge-1">
              <FaStar className="badge-icon" />
              <span>Since 2009</span>
            </div>
            <div className="floating-badge badge-2">
              <FaHeart className="badge-icon" />
              <span>5000+ Clients</span>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="about-content-column" data-aos="fade-left">
          {/* Introduction Text */}
          <div className="intro-text">
            <p className="first-para">
              At KANNIKAA, we specialize in designer sarees, custom-made blouses and other costumes, 
              and any sort of ceremonial ensemble for women and kids. At a glance, it is a boutique 
              store with a great collection of designer attire.
            </p>
            
            <p className="second-para">
              The difference is that most of the clothes we make are inspired by our nation's rich 
              heritage of art and craft. We blend these heritage-inspired designs with the finest 
              fabrics (such as Banaras silk and Kanchipuram silk) and shape them according to the 
              customer's needs. Thanks to our exceptional team of designers, embroidery / cutwork 
              specialists and other supporting staff, the KANNIKAA creations have already succeeded in 
              setting a noble trend in the ceremonial.
            </p>
          </div>

          {/* Founder Section */}
          <div className="founder-section">
            <h2 className="section-subtitle">FOUNDER OF KANNIKAA</h2>
            <h3 className="founder-name">Mrs. KANNIKAA PRABHU</h3>
            
            <div className="founder-content">
              <div className="founder-quote-box">
                <p className="founder-quote">
                  "A woman of vision filled with creativity, transforming dreams into exquisite designs."
                </p>
              </div>
              <div className="founder-text">
                <p>
                  Mrs. KANNIKAA PRABHU is a woman of vision filled with creativity. Her ability in 
                  design is inborn in a way that she has the power to imagine art and reciprocate it 
                  into one of a kind design piece. With a passion and an eager to create effortlessly 
                  elegant ethnic clothing and added motivation the journey of KANNIKAA began in the year 2009.
                </p>
                <p>
                  It all started with designing for herself, her daughter and then her family. She has 
                  a unique style of merging vibrant Indian fabrics with intricate vintage embroidery to 
                  retain the beauty of Indian Tradition. Her couture speaks of royalty and class.
                </p>
                <p>
                  Her passion for designing grew in a vast way, the result of which we see at KANNIKAA today. 
                  She has a strong mission to make KANNIKAA a one stop shop for the whole family. Be it a 
                  wedding outfit, ethnic ensemble, accessories, jewelry and shoes for your big day; 
                  KANNIKAA will turn your desires into reality!
                </p>
              </div>
            </div>
          </div>

          {/* Mission/Vision Cards */}
          <div className="mission-cards">
            <div className="mission-card" data-aos="fade-up" data-aos-delay="100">
              <div className="card-icon">🎯</div>
              <h4>Our Mission</h4>
              <p>To preserve and promote India's rich textile heritage through contemporary designs</p>
            </div>
            <div className="mission-card" data-aos="fade-up" data-aos-delay="200">
              <div className="card-icon">👁️</div>
              <h4>Our Vision</h4>
              <p>To be the most trusted destination for authentic designer ethnic wear</p>
            </div>
            <div className="mission-card" data-aos="fade-up" data-aos-delay="300">
              <div className="card-icon">✨</div>
              <h4>Our Values</h4>
              <p>Quality, Authenticity, Customer Satisfaction, Heritage Preservation</p>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="expertise-section">
            <h3 className="expertise-title">Our Expertise</h3>
            <div className="expertise-grid">
              <div className="expertise-item">
                <span className="expertise-icon">👗</span>
                <span>Designer Sarees</span>
              </div>
              <div className="expertise-item">
                <span className="expertise-icon">👚</span>
                <span>Custom Blouses</span>
              </div>
              <div className="expertise-item">
                <span className="expertise-icon">👘</span>
                <span>Ceremonial Wear</span>
              </div>
              <div className="expertise-item">
                <span className="expertise-icon">👑</span>
                <span>Bridal Collection</span>
              </div>
              <div className="expertise-item">
                <span className="expertise-icon">🧒</span>
                <span>Kids Ensemble</span>
              </div>
              <div className="expertise-item">
                <span className="expertise-icon">💍</span>
                <span>Accessories</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="testimonial-section">
            <FaQuoteRight className="testimonial-quote" />
            <p className="testimonial-text">
              "KANNIKAA's creations are simply magical. The attention to detail and quality of 
              work is exceptional. My wedding trousseau was perfect thanks to them!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <h4>Priya Sharma</h4>
                <p>Happy Bride</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Clients</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Designs</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>

          {/* Features */}
          <div className="features-section">
            <div className="feature-item">
              <FaTruck className="feature-icon" />
              <div>
                <h4>Worldwide Shipping</h4>
                <p>Free shipping on orders above ₹5000</p>
              </div>
            </div>
            <div className="feature-item">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>COD Available</h4>
                <p>Cash on delivery available</p>
              </div>
            </div>
            <div className="feature-item">
              <FaShieldAlt className="feature-icon" />
              <div>
                <h4>Secure Payments</h4>
                <p>100% secure transactions</p>
              </div>
            </div>
          </div>

          {/* Social Connect */}
          <div className="social-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaPinterestP /></a>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="back-home">
            <button className="back-home-btn" onClick={() => navigate('/')}>
              ← BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About