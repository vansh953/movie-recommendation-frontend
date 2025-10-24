import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/NavbarHome.css";

function Navbar1() {
  const location = useLocation();

  const getActive = (path) => {
    switch (path) {
      case "/home": return "home";
      case "/recommended": return "recommended";
      case "/movies": return "movies";
      case "/watch-history": return "history";
      case "/bookmarks": return "bookmarks";
      case "/my-profile": return "profile";
      default: return "";
    }
  };

  const active = getActive(location.pathname);

  return (
    <nav className="navbar1">
      <div className="navbar-logo">🎬 Flix</div>
      <div className="navbar-links">
        <Link to="/home" className={`nav-link ${active === "home" ? "active" : ""}`}>🏠 Home</Link>
        <Link to="/recommended" className={`nav-link ${active === "recommended" ? "active" : ""}`}>⭐ Recommended</Link>
        <Link to="/movies" className={`nav-link ${active === "movies" ? "active" : ""}`}>🎞️ Movies</Link>
        <Link to="/watch-history" className={`nav-link ${active === "history" ? "active" : ""}`}>📜 Watch History</Link>
        <Link to="/bookmarks" className={`nav-link ${active === "bookmarks" ? "active" : ""}`}>🔖 Bookmarks</Link>
        <Link to="/my-profile" className={`nav-link ${active === "profile" ? "active" : ""}`}>👤 My Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar1;
