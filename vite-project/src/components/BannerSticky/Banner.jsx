import React from "react";
import "./Banner.css";
import logo from "../../assets/image.png";

function BannerLayout() {
  return (
    <div className="banner-layout">
      <img src={logo} alt="Banner" />
    </div>
  );
}

export default BannerLayout;
