import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import "./NewArrivals.css"
import { FaHeart, FaShoppingCart, FaTimes, FaStar, FaTruck, FaShieldAlt, FaCheckCircle, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa"

function NewArrivals() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalQty, setModalQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [activeImage, setActiveImage] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const itemsPerPage = 3

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products?isNewCollection=true"
      )
      setProducts(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const addToCart = async (id, qty = 1, size = "") => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: id, quantity: qty, size },
        { withCredentials: true }
      )
      alert("Added to cart successfully!")
    } catch (err) {
      alert("Login required")
    }
  }

  const addToWishlist = async (id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/wishlist",
        { productId: id },
        { withCredentials: true }
      )
      alert("Added to wishlist")
    } catch (err) {
      alert("Login required")
    }
  }

  const openQuickView = (product) => {
    setSelectedProduct(product)
    setModalQty(1)
    setSelectedSize(product.sizes?.[0] || "")
    setActiveImage(`http://localhost:5000/${product.frontImage}`)
  }

  const closeModal = () => {
    setSelectedProduct(null)
  }

  const incrementQty = () => setModalQty(prev => prev + 1)
  const decrementQty = () => setModalQty(prev => (prev > 1 ? prev - 1 : 1))

  const calculateDiscount = (price, offerPrice) => {
    if (!offerPrice) return 0
    return Math.round(((price - offerPrice) / price) * 100)
  }

  // Carousel navigation
  const nextSlide = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(prev => prev + itemsPerPage)
    }
  }

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(prev => prev - itemsPerPage)
    }
  }

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextSlide()
    }
    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevSlide()
    }
  }

  // Get current products to display
  const currentProducts = products.slice(currentIndex, currentIndex + itemsPerPage)
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1

  return (
    <div className="new-arrivals">
      <div className="container">
        <h2 className="section-title">
          <span className="title-highlight">NEW</span> ARRIVALS
        </h2>

        <div className="carousel-container">
          {products.length > itemsPerPage && (
            <button 
              className={`carousel-btn prev-btn ${currentIndex === 0 ? 'disabled' : ''}`} 
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <FaChevronLeft />
            </button>
          )}

          <div 
            className="products-carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentProducts.map((item) => {
              const discount = calculateDiscount(item.price, item.offerPrice)
              
              return (
                <div className="product-card" key={item._id}>
                  <div className="card-image-wrapper">
                    <img
                      src={`http://localhost:5000/${item.frontImage}`}
                      alt={item.title}
                      className="front-image"
                    />
                    <img
                      src={`http://localhost:5000/${item.hoverImage}`}
                      alt={item.title}
                      className="hover-image"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="discount-badge">
                        SAVE {discount}%
                      </div>
                    )}

                    {/* Quick View Button */}
                    <button className="quick-view-btn" onClick={() => openQuickView(item)}>
                      <FaEye /> QUICK VIEW
                    </button>

                    {/* Action Icons */}
                    <div className="action-icons">
                      <button className="icon-btn" onClick={() => addToWishlist(item._id)}>
                        <FaHeart />
                      </button>
                      <button className="icon-btn" onClick={() => addToCart(item._id)}>
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="product-title">{item.title}</h3>
                    <p className="product-description">{item.description?.substring(0, 50)}...</p>
                    
                    <div className="product-category">{item.category}</div>

                    <div className="product-pricing">
                      {item.offerPrice ? (
                        <>
                          <span className="current-price">₹{item.offerPrice}</span>
                          <span className="original-price">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="current-price">₹{item.price}</span>
                      )}
                    </div>

                    {item.sizes && item.sizes.length > 0 && (
                      <div className="size-indicators">
                        {item.sizes.slice(0, 4).map(size => (
                          <span key={size} className="size-chip">{size}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {products.length > itemsPerPage && (
            <button 
              className={`carousel-btn next-btn ${currentIndex + itemsPerPage >= products.length ? 'disabled' : ''}`} 
              onClick={nextSlide}
              disabled={currentIndex + itemsPerPage >= products.length}
            >
              <FaChevronRight />
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="carousel-pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <FaTimes />
            </button>

            <div className="modal-layout">
              {/* Image Section */}
              <div className="modal-image-section">
                <div className="main-image-container">
                  <img src={activeImage} alt={selectedProduct.title} />
                  {selectedProduct.offerPrice && (
                    <span className="modal-discount-badge">
                      -{calculateDiscount(selectedProduct.price, selectedProduct.offerPrice)}%
                    </span>
                  )}
                </div>
                
                <div className="thumbnail-container">
                  <img 
                    src={`http://localhost:5000/${selectedProduct.frontImage}`}
                    alt="front"
                    className={activeImage === `http://localhost:5000/${selectedProduct.frontImage}` ? 'active' : ''}
                    onClick={() => setActiveImage(`http://localhost:5000/${selectedProduct.frontImage}`)}
                  />
                  <img 
                    src={`http://localhost:5000/${selectedProduct.hoverImage}`}
                    alt="hover"
                    className={activeImage === `http://localhost:5000/${selectedProduct.hoverImage}` ? 'active' : ''}
                    onClick={() => setActiveImage(`http://localhost:5000/${selectedProduct.hoverImage}`)}
                  />
                  {selectedProduct.galleryImages?.map((img, index) => (
                    <img 
                      key={index}
                      src={`http://localhost:5000/${img}`}
                      alt={`gallery ${index + 1}`}
                      className={activeImage === `http://localhost:5000/${img}` ? 'active' : ''}
                      onClick={() => setActiveImage(`http://localhost:5000/${img}`)}
                    />
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="modal-details-section">
                <div className="modal-header">
                  <span className="modal-category">{selectedProduct.category}</span>
                  <span className={`stock-badge ${selectedProduct.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                    {selectedProduct.stock > 10 ? 'In Stock' : `Only ${selectedProduct.stock} left`}
                  </span>
                </div>

                <h2 className="modal-product-title">{selectedProduct.title}</h2>

                <div className="modal-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="star filled" />
                  ))}
                  <span className="review-count">(24 reviews)</span>
                </div>

                <div className="modal-price-wrapper">
                  {selectedProduct.offerPrice ? (
                    <>
                      <span className="modal-price">₹{selectedProduct.offerPrice}</span>
                      <span className="modal-old-price">₹{selectedProduct.price}</span>
                      <span className="modal-save-badge">
                        Save {calculateDiscount(selectedProduct.price, selectedProduct.offerPrice)}%
                      </span>
                    </>
                  ) : (
                    <span className="modal-price">₹{selectedProduct.price}</span>
                  )}
                </div>

                <p className="modal-description">{selectedProduct.description}</p>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="modal-size-section">
                    <div className="size-header">
                      <span className="size-title">Select Size</span>
                      <span className="size-guide-link">Size Guide</span>
                    </div>
                    <div className="size-buttons">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-quantity-section">
                  <span className="quantity-title">Quantity</span>
                  <div className="quantity-controls">
                    <button onClick={decrementQty} disabled={modalQty <= 1}>−</button>
                    <span className="quantity-value">{modalQty}</span>
                    <button onClick={incrementQty}>+</button>
                  </div>
                </div>

                <div className="modal-action-buttons">
                  <button className="add-to-cart-btn" onClick={() => {
                    addToCart(selectedProduct._id, modalQty, selectedSize)
                    closeModal()
                  }}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button className="buy-now-btn">Buy Now</button>
                  <button className="wishlist-icon-btn" onClick={() => addToWishlist(selectedProduct._id)}>
                    <FaHeart />
                  </button>
                </div>

                <div className="modal-features">
                  <div className="feature-item">
                    <FaTruck />
                    <span>Free Shipping</span>
                  </div>
                  <div className="feature-item">
                    <FaCheckCircle />
                    <span>COD Available</span>
                  </div>
                  <div className="feature-item">
                    <FaShieldAlt />
                    <span>Secure Payment</span>
                  </div>
                </div>

                <div className="modal-footer-info">
                  <div className="info-row">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{selectedProduct.category} / {selectedProduct.subCategory}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">SKU:</span>
                    <span className="info-value">#{selectedProduct._id.slice(-6)}</span>
                  </div>
                </div>

                <div className="payment-info">
                  <span>All payment modes available</span>
                  <span className="razorpay-text">Secured by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewArrivals