import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/NavbarHome.css";

function Navbar1() {
  const [active, setActive] = useState("home");

  const handleClick = (option) => {
    setActive(option);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-options">
        <Link
          to="/home"
          className={`nav-item ${active === "home" ? "active" : ""}`}
          onClick={() => handleClick("home")}
        >
          Home
        </Link>
        <Link
          to="/recommended"
          className={`nav-item ${active === "recommended" ? "active" : ""}`}
          onClick={() => handleClick("recommended")}
        >
          Recommended
        </Link>
        <Link
          to="/movies"
          className={`nav-item ${active === "movies" ? "active" : ""}`}
          onClick={() => handleClick("movies")}
        >
          Movies
        </Link>
        <Link
          to="/my-profile"
          className={`nav-item ${active === "profile" ? "active" : ""}`}
          onClick={() => handleClick("profile")}
        >
          My Profile
        </Link>
      </div>
    </div>
  );
}

export default Navbar1;
