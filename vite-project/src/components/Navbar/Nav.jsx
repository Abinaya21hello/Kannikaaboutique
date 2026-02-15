import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import logo from "../../assets/logo.jpeg";
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
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && !e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  // Prevent scroll when menu is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

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
          {/* LOGO - Click to go home */}
          <div className="logo" data-aos="fade-right" onClick={() => handleNavigation('/')}>
            <img src={logo} alt="Kannikaa Boutique" />
          </div>

          {/* MENU */}
          <nav className={`nav-links ${open ? "active" : ""}`}>
            <Link to="/" onClick={() => setOpen(false)}>NEW ARRIVALS</Link>
            <Link to="/about" onClick={() => setOpen(false)}>ABOUT KANNIKA</Link>
            <Link to="/sarees" onClick={() => setOpen(false)}>SAREES</Link>
            <Link to="/fabric" onClick={() => setOpen(false)}>FABRIC</Link>
            <Link to="/salwars" onClick={() => setOpen(false)}>UNSTITCHED SALWAR'S</Link>
            <Link to="/dupattas" onClick={() => setOpen(false)}>DUPATTA</Link>
            <Link to="/women" onClick={() => setOpen(false)}>WOMEN'S COLLECTIONS</Link>
          </nav>

          {/* ICONS - Make them clickable */}
          <div className="nav-icons" data-aos="fade-left">
            <FaUser onClick={() => handleNavigation('/login')} />
            <FaSearch />
            <FaShoppingBag />
          </div>

          {/* HAMBURGER */}
          <div
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            data-aos="fade-left"
          >
            {open ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;