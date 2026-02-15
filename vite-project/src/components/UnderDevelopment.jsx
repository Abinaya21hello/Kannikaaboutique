import React from "react";
import underdevelopmentImg from "../assets/Welcome.png";

const UnderDevelopment = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${underdevelopmentImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
    </div>
  );
};

export default UnderDevelopment;
