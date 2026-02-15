import { useEffect, useState } from "react";
import "./Hero.css";
import AOS from "aos";
import "aos/dist/aos.css";
import heroImg from "../../assets/hero.jpg";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";

const Hero = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchCarouselData();
  }, []);

  // Fetch carousel data from API
  const fetchCarouselData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/carousel");
      console.log("Carousel data:", response.data);
      setCarouselItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching carousel data:", error);
      setLoading(false);
    }
  };

  // Auto-play functionality - 3 seconds
  useEffect(() => {
    let interval;
    if (isAutoPlaying && carouselItems.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselItems.length]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      goToNext();
    }
    if (touchStart - touchEnd < -100) {
      goToPrev();
    }
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Handle image error
  const handleImageError = (itemId, imageUrl) => {
    console.log("Image failed to load:", imageUrl);
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // Fix image URL - properly encode and format
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    console.log("Original image path:", imagePath);
    
    try {
      // Extract just the filename from the Windows path
      // The path comes as: "uploads\carousel\filename.jpeg"
      const filename = imagePath.split('\\').pop();
      
      if (!filename) return null;
      
      // Properly encode the filename for URLs (handles spaces, special characters)
      const encodedFilename = encodeURIComponent(filename);
      
      // Create the correct URL
      const fullUrl = `http://localhost:5000/uploads/carousel/${encodedFilename}`;
      console.log("Constructed URL:", fullUrl);
      
      return fullUrl;
    } catch (error) {
      console.error("Error constructing image URL:", error);
      return null;
    }
  };

  // Get current item
  const currentItem = carouselItems[currentIndex] || {};

  return (
    <section 
      className="hero-carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <div className="carousel-slides">
        {carouselItems.length > 0 ? (
          carouselItems.map((item, index) => {
            const imageUrl = getImageUrl(item.image);
            const hasImageError = imageErrors[item._id];
            const isActive = index === currentIndex;
            
            // Log the image URL for debugging
            if (imageUrl) {
              console.log(`Slide ${index} image URL:`, imageUrl);
            }
            
            return (
              <div
                key={item._id}
                className={`carousel-slide ${isActive ? 'active' : ''}`}
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(${hasImageError || !imageUrl ? heroImg : imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Hidden image for preloading */}
                {!hasImageError && imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt=""
                    style={{ display: 'none' }}
                    onError={(e) => {
                      console.error("Image failed to load:", imageUrl);
                      handleImageError(item._id, imageUrl);
                    }}
                    onLoad={() => console.log("Image loaded successfully:", imageUrl)}
                  />
                )}

                {/* Text Overlay */}
                <div className="slide-content">
                  <div className="container">
                    <span className="slide-tagline">EXCLUSIVE OFFER</span>
                    <h1 className="slide-title">{item.title?.toUpperCase() || 'SPECIAL COLLECTION'}</h1>
                    <div className="slide-offer">
                      <span className="offer-badge">{item.description || 'SPECIAL OFFER'}</span>
                    </div>
                    <p className="slide-description">
                      Experience the art of traditional craftsmanship blended with contemporary sophistication. 
                      Each piece tells a story of heritage and modern grace.
                    </p>
                    <button className="slide-btn">SHOP NOW</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Fallback slide if no API data
          <div
            className="carousel-slide active"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(${heroImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="slide-content">
              <div className="container">
                <span className="slide-tagline">WELCOME TO</span>
                <h1 className="slide-title">KANNIKAA BOUTIQUE</h1>
                <div className="slide-offer">
                  <span className="offer-badge">CRAFTING ELEGANCE</span>
                </div>
                <p className="slide-description">
                  Specializing in designer sarees, custom-made blouses, and ceremonial ensembles 
                  for women and kids. Where tradition meets contemporary elegance.
                </p>
                <button className="slide-btn">DISCOVER NOW</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {carouselItems.length > 1 && (
        <>
          <button className="carousel-arrow prev" onClick={goToPrev}>
            <FaChevronLeft />
          </button>
          <button className="carousel-arrow next" onClick={goToNext}>
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Auto-play Toggle */}
      {carouselItems.length > 1 && (
        <button className="carousel-play-pause" onClick={toggleAutoPlay}>
          {isAutoPlaying ? <FaPause /> : <FaPlay />}
        </button>
      )}

      {/* Slide Indicators */}
      {carouselItems.length > 1 && (
        <div className="carousel-indicators">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {carouselItems.length > 1 && (
        <div className="slide-counter">
          <span className="current">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="separator">/</span>
          <span className="total">{String(carouselItems.length).padStart(2, '0')}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="hero-loading">
          <div className="loader"></div>
        </div>
      )}
    </section>
  );
};

export default Hero;