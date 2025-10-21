import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/NavbarHome.css";

function Navbar1() {
  const [active, setActive] = useState("home");

  const handleClick = (option) => {
    setActive(option);
  };

  return (
    <nav className="navbar1">
      <div className="navbar-logo">🎬 F-Sync</div>
      <div className="navbar-links">
        <Link
          to="/home"
          className={`nav-link ${active === "home" ? "active" : ""}`}
          onClick={() => handleClick("home")}
        >
          🏠 Home
        </Link>
        <Link
          to="/recommended"
          className={`nav-link ${active === "recommended" ? "active" : ""}`}
          onClick={() => handleClick("recommended")}
        >
          ⭐ Recommended
        </Link>
        <Link
          to="/movies"
          className={`nav-link ${active === "movies" ? "active" : ""}`}
          onClick={() => handleClick("movies")}
        >
          🎞️ Movies
        </Link>
        <Link
          to="/watch-history"
          className={`nav-link ${active === "history" ? "active" : ""}`}
          onClick={() => handleClick("history")}
        >
          📜 Watch History
        </Link>
        <Link
          to="/my-profile"
          className={`nav-link ${active === "profile" ? "active" : ""}`}
          onClick={() => handleClick("profile")}
        >
          👤 My Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar1;
