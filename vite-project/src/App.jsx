import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nav";
import Hero from "./components/Hero/Hero";
import NewArrivals from "./components/NewArraivals/Newaravials";
import About from "./components/About/About";
import Login from "./components/Login";
import Register from "./components/Register";
import BannerLayout from "./components/BannerSticky/Banner";
import Footer from "./components/Footer/Footer";
import UnderDevelopment from "./components/UnderDevelopment";

// 👇 change here
const UNDER_DEV = true;  // true = under development page show

function App() {

  // if under development ON
  if (UNDER_DEV) {
    return <UnderDevelopment />;
  }

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <NewArrivals />
              <BannerLayout />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/sarees" element={<div>Sarees Page - Coming Soon</div>} />
          <Route path="/fabric" element={<div>Fabric Page - Coming Soon</div>} />
          <Route path="/salwars" element={<div>Unstitched Salwar Page - Coming Soon</div>} />
          <Route path="/dupattas" element={<div>Dupatta Page - Coming Soon</div>} />
          <Route path="/women" element={<div>Women's Collections Page - Coming Soon</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
