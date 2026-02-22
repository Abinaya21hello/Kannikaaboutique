import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTimes, 
  FaStar, 
  FaTruck, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaEye
} from "react-icons/fa"
import "./CategoryProducts.css"

function CategoryProducts() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalQty, setModalQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [activeImage, setActiveImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [wishlistItems, setWishlistItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")

  const API_BASE_URL = "http://localhost:5000"

  // Configure axios defaults
  axios.defaults.withCredentials = true

  useEffect(() => {
    fetchProducts()
    fetchUserWishlist()
    fetchUserCart()
  }, [slug])

  // Fetch category products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${API_BASE_URL}/api/products/category/${slug}`
      )
      setProducts(res.data)
    } catch (err) {
      console.log(err)
      showNotificationMessage("Failed to load products", "error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's wishlist
  const fetchUserWishlist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setWishlistItems(res.data.items || [])
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    }
  }

  // Fetch user's cart
  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const cartData = Array.isArray(res.data) ? res.data : res.data.items || []
      setCartItems(cartData)
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  // Show notification message
  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Add to cart function
  const addToCart = async (id, qty = 1, size = "") => {
    try {
      const product = products.find(p => p._id === id)
      if (!product) return

      // Check if size is required but not selected
      if (product.sizes && product.sizes.length > 0 && !size) {
        showNotificationMessage("Please select a size", "error")
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        showNotificationMessage("Please login to add items to cart", "error")
        setTimeout(() => navigate('/login'), 1500)
        return
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/cart`,
        {
          productId: id,
          quantity: qty,
          size: size || (product.sizes?.[0] || "")
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      showNotificationMessage("✅ Added to cart successfully!")
      fetchUserCart()
      
      // Trigger cart update in navbar
      window.dispatchEvent(new Event('cart-updated'))

    } catch (err) {
      console.log(err)
      if (err.response?.status === 401) {
        showNotificationMessage("Please login first", "error")
        setTimeout(() => navigate("/login"), 1500)
      } else {
        showNotificationMessage("Failed to add to cart", "error")
      }
    }
  }

  // Add to wishlist function
  const addToWishlist = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showNotificationMessage("Please login to manage wishlist", "error")
        setTimeout(() => navigate('/login'), 1500)
        return
      }

      // Check if already in wishlist
      const isInWishlist = wishlistItems.some(item => 
        item.product?._id === id || item.product === id
      )

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${API_BASE_URL}/api/wishlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        showNotificationMessage("❤️ Removed from wishlist")
      } else {
        // Add to wishlist
        await axios.post(
          `${API_BASE_URL}/api/wishlist`,
          { productId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        showNotificationMessage("❤️ Added to wishlist")
      }
      
      fetchUserWishlist() // Refresh wishlist data
    } catch (err) {
      console.error("Wishlist error:", err)
      showNotificationMessage("Failed to update wishlist", "error")
    }
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.product?._id === productId || item.product === productId
    )
  }

  // Get cart quantity for product
  const getCartQuantity = (productId, size) => {
    const item = cartItems.find(item => 
      (item.product?._id === productId || item.product === productId) && 
      item.size === size
    )
    return item?.quantity || 0
  }

  // Open quick view modal
  const openQuickView = (product) => {
    setSelectedProduct(product)
    setModalQty(1)
    setSelectedSize(product.sizes?.[0] || "")
    setActiveImage(`${API_BASE_URL}/${product.frontImage}`)
  }

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null)
  }

  // Quantity controls
  const incrementQty = () => setModalQty(prev => prev + 1)
  const decrementQty = () => setModalQty(prev => (prev > 1 ? prev - 1 : 1))

  // Calculate discount percentage
  const calculateDiscount = (price, offerPrice) => {
    if (!offerPrice) return 0
    return Math.round(((price - offerPrice) / price) * 100)
  }

  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="category-products-page">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`notification-toast ${notificationType}`}>
          {notificationMessage}
        </div>
      )}

      <div className="container">
        <h2 className="category-title">
          {slug.toUpperCase()} COLLECTION
        </h2>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((item) => {
              const discount = calculateDiscount(item.price, item.offerPrice)
              const inWishlist = isInWishlist(item._id)
              
              return (
                <div className="product-card" key={item._id}>
                  <div className="card-image-wrapper">
                    <img
                      src={`${API_BASE_URL}/${item.frontImage}`}
                      alt={item.title}
                      className="front-image"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg"
                      }}
                    />
                    <img
                      src={`${API_BASE_URL}/${item.hoverImage}`}
                      alt={item.title}
                      className="hover-image"
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
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
                      <button 
                        className={`icon-btn ${inWishlist ? 'active' : ''}`} 
                        onClick={() => addToWishlist(item._id)}
                      >
                        {inWishlist ? <FaHeart style={{color: '#ff4444'}} /> : <FaHeart />}
                      </button>
                      <button 
                        className="icon-btn" 
                        onClick={() => addToCart(item._id, 1, item.sizes?.[0])}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="product-title">{item.title}</h3>
                    <p className="product-description">{item.description?.substring(0, 50)}...</p>
                    
                    <div className="product-category">
                      {item.category?.name || "Uncategorized"}
                    </div>

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
                        {item.sizes.length > 4 && (
                          <span className="size-chip">+{item.sizes.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className={`stock-status ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </div>
                  </div>
                </div>
              )
            })}
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
                  <img 
                    src={activeImage} 
                    alt={selectedProduct.title}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg"
                    }}
                  />
                  {selectedProduct.offerPrice && (
                    <span className="modal-discount-badge">
                      -{calculateDiscount(selectedProduct.price, selectedProduct.offerPrice)}%
                    </span>
                  )}
                </div>
                
                <div className="thumbnail-container">
                  <img 
                    src={`${API_BASE_URL}/${selectedProduct.frontImage}`}
                    alt="front"
                    className={activeImage === `${API_BASE_URL}/${selectedProduct.frontImage}` ? 'active' : ''}
                    onClick={() => setActiveImage(`${API_BASE_URL}/${selectedProduct.frontImage}`)}
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                  <img 
                    src={`${API_BASE_URL}/${selectedProduct.hoverImage}`}
                    alt="hover"
                    className={activeImage === `${API_BASE_URL}/${selectedProduct.hoverImage}` ? 'active' : ''}
                    onClick={() => setActiveImage(`${API_BASE_URL}/${selectedProduct.hoverImage}`)}
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                  {selectedProduct.galleryImages?.map((img, index) => (
                    <img 
                      key={index}
                      src={`${API_BASE_URL}/${img}`}
                      alt={`gallery ${index + 1}`}
                      className={activeImage === `${API_BASE_URL}/${img}` ? 'active' : ''}
                      onClick={() => setActiveImage(`${API_BASE_URL}/${img}`)}
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="modal-details-section">
                <div className="modal-header">
                  <span className="modal-category">
                    {selectedProduct.category?.name || "Uncategorized"}
                  </span>
                  <span className={`stock-badge ${selectedProduct.stock > 10 ? 'in-stock' : selectedProduct.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                    {selectedProduct.stock > 10 
                      ? 'In Stock' 
                      : selectedProduct.stock > 0 
                        ? `Only ${selectedProduct.stock} left` 
                        : 'Out of Stock'}
                  </span>
                </div>

                <h2 className="modal-product-title">{selectedProduct.title}</h2>

                <div className="modal-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`star ${i < 4 ? 'filled' : ''}`} />
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
                          disabled={selectedProduct.stock === 0}
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
                    <button 
                      onClick={decrementQty} 
                      disabled={modalQty <= 1 || selectedProduct.stock === 0}
                    >
                      −
                    </button>
                    <span className="quantity-value">{modalQty}</span>
                    <button 
                      onClick={incrementQty}
                      disabled={modalQty >= selectedProduct.stock || selectedProduct.stock === 0}
                    >
                      +
                    </button>
                  </div>
                  {selectedProduct.stock > 0 && (
                    <span className="available-stock">{selectedProduct.stock} available</span>
                  )}
                </div>

                <div className="modal-action-buttons">
                  <button 
                    className="add-to-cart-btn" 
                    onClick={() => {
                      addToCart(selectedProduct._id, modalQty, selectedSize)
                      closeModal()
                    }}
                    disabled={selectedProduct.stock === 0}
                  >
                    <FaShoppingCart /> 
                    {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button 
                    className="buy-now-btn"
                    disabled={selectedProduct.stock === 0}
                  >
                    Buy Now
                  </button>
                  <button 
                    className={`wishlist-icon-btn ${isInWishlist(selectedProduct._id) ? 'active' : ''}`} 
                    onClick={() => {
                      addToWishlist(selectedProduct._id)
                    }}
                  >
                    {isInWishlist(selectedProduct._id) ? <FaHeart style={{color: '#ff4444'}} /> : <FaHeart />}
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
                    <span className="info-value">
                      {selectedProduct.category?.name || "Uncategorized"} 
                      {selectedProduct.subCategory && ` / ${selectedProduct.subCategory}`}
                    </span>
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

export default CategoryProducts