import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import logo from "../../assets/logo.jpeg";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import {
  FaUser,
  FaSearch,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const navigate = useNavigate();

  // AOS
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  // close mobile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && !e.target.closest(".nav-links") && !e.target.closest(".menu-toggle")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  // prevent scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [open]);

  // 🔥 fetch cart
  const fetchCart = async () => {
    try {
      setCartLoading(true);

      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });

      setCartItems(res.data || []);
    } catch (err) {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 remove item
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        withCredentials: true,
      });
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 update qty
  const updateQty = async (id, type) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { type },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const cartCount = cartItems.length;

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar" data-aos="fade-down">
        WORLD WIDE SHIPPING AVAILABLE
      </div>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          {/* LOGO */}
          <div className="logo" data-aos="fade-right" onClick={() => handleNavigation("/")}>
            <img src={logo} alt="Kannikaa Boutique" />
          </div>

          {/* MENU */}
          <nav className={`nav-links ${open ? "active" : ""}`}>
            <Link to="/" onClick={() => setOpen(false)}>NEW ARRIVALS</Link>
            <Link to="/about" onClick={() => setOpen(false)}>ABOUT</Link>
            <Link to="/sarees" onClick={() => setOpen(false)}>SAREES</Link>
            <Link to="/fabric" onClick={() => setOpen(false)}>FABRIC</Link>
            <Link to="/salwars" onClick={() => setOpen(false)}>SALWAR</Link>
            <Link to="/dupattas" onClick={() => setOpen(false)}>DUPATTA</Link>
            <Link to="/women" onClick={() => setOpen(false)}>WOMEN</Link>
          </nav>

          {/* ICONS */}
          <div className="nav-icons" data-aos="fade-left">
            <FaUser onClick={() => handleNavigation("/login")} />
            <FaSearch />

            {/* 🔥 CART ICON */}
            <div className="cart-icon-container">
              <FaShoppingBag
                className="cart-icon"
                onClick={() => {
                  setCartOpen(!cartOpen);
                  fetchCart();
                }}
              />

              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
          </div>

          {/* HAMBURGER */}
          <div className="menu-toggle" onClick={() => setOpen(!open)} data-aos="fade-left">
            {open ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* 🔥 CART DROPDOWN */}
        {cartOpen && (
          <div className="cart-dropdown">

            <div className="cart-dropdown-header">
              <h3>Your Cart ({cartItems.length})</h3>
              <button className="close-cart" onClick={() => setCartOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="cart-dropdown-body">
              {cartLoading ? (
                <div className="cart-loading">Loading...</div>
              ) : cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <div className="cart-item-image">
                      <img src={`http://localhost:5000/${item.product?.frontImage}`} />
                    </div>

                    <div className="cart-item-details">
                      <p className="cart-item-title">{item.product?.title}</p>
                      <span className="cart-item-size">Size: {item.size}</span>
                      <p className="cart-item-price">
                        ₹{item.product?.offerPrice || item.product?.price}
                      </p>

                      <div className="cart-item-quantity">
                        <button className="qty-btn" onClick={() => updateQty(item._id, "dec")}>-</button>
                        <span>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(item._id, "inc")}>+</button>
                      </div>
                    </div>

                    <button className="remove-item" onClick={() => removeFromCart(item._id)}>
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-dropdown-footer">
                <button className="checkout-btn" onClick={() => navigate("/cart")}>
                  View Cart
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;