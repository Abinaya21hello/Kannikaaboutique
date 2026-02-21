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

import Categories from "./components/Categories/Categories";
import CategoryProducts from "./components/Categories/CategoryProducts";

const UNDER_DEV = false;

function App() {

  if (UNDER_DEV) {
    return <UnderDevelopment />;
  }

  return (
    <Router>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route path="/" element={
          <>
            <Hero />
            <NewArrivals />
            <BannerLayout />
            <Categories /> {/* 🔥 show category in home */}
          </>
        } />

        {/* CATEGORY PAGE */}
        <Route path="/categories" element={<Categories />} />

        {/* CATEGORY PRODUCTS */}
        <Route path="/category/:slug" element={<CategoryProducts />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        <Route path="/sarees" element={<div>Sarees Page</div>} />
        <Route path="/fabric" element={<div>Fabric Page</div>} />
        <Route path="/salwars" element={<div>Salwar Page</div>} />
        <Route path="/dupattas" element={<div>Dupatta Page</div>} />
        <Route path="/women" element={<div>Women Collection</div>} />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
