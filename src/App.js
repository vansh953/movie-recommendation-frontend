import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Language from "./pages/Language";
import Genre from "./pages/Genre";
import Home1 from "./pages/Home1";
import Movies from "./pages/Movies";
import Recommended from "./pages/Recommended";
import MyProfile from "./pages/MyProfile";
import Bookmarks from "./pages/Bookmarks";
import WatchHistory from "./pages/WatchHistory";
import Home from "./pages/Home";
import AuthCallBack from "./pages/AuthCallback";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          handleLogout();
          return;
        }
        setIsLoggedIn(true);
        setUserId(decoded.id);
        const fetchProfile = async () => {
          if (!API_BASE_URL) {
            setFirstLogin(true);
            setAuthLoading(false);
            return;
          }
          try {
            const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data?.genres?.length > 0) {
              setFirstLogin(false);
              setSelectedLanguages(
                res.data.preferredLanguage ? [res.data.preferredLanguage] : []
              );
              setSelectedGenres(res.data.genres);
            } else setFirstLogin(true);
          } catch {
            setFirstLogin(true);
          } finally {
            setAuthLoading(false);
          }
        };
        fetchProfile();
      } catch {
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
      setFirstLogin(true);
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = (tokenOrId) => {
    let id, tokenToUse;
    if (typeof tokenOrId === "string" && tokenOrId.length > 50) {
      try {
        const decoded = jwtDecode(tokenOrId);
        id = decoded.id;
        tokenToUse = tokenOrId;
        localStorage.setItem("authToken", tokenToUse);
      } catch {
        return;
      }
    } else if (tokenOrId) {
      id = tokenOrId;
      tokenToUse = localStorage.getItem("authToken");
      if (!tokenToUse) return;
    }
    if (id && tokenToUse) {
      setIsLoggedIn(true);
      setUserId(id);
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${tokenToUse}` },
          });
          if (res.data?.genres?.length > 0) {
            setFirstLogin(false);
            setSelectedLanguages(
              res.data.preferredLanguage ? [res.data.preferredLanguage] : []
            );
            setSelectedGenres(res.data.genres);
          } else setFirstLogin(true);
        } catch {
          setFirstLogin(true);
        }
      };
      fetchProfile();
    } else handleLogout();
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserId(null);
    setFirstLogin(true);
    setSelectedLanguages([]);
    setSelectedGenres([]);
    setAuthLoading(false);
  };

  const handleLanguageSelect = (languages) => {
    setSelectedLanguages(Array.isArray(languages) ? languages : [languages]);
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
    setFirstLogin(false);
  };

  if (authLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0d0d0d",
          color: "white",
        }}
      >
        Loading Application...
      </div>
    );

  const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const links = [
      { path: "/home", label: "Home" },
      { path: "/movies", label: "Movies" },
      { path: "/recommended", label: "Recommended" },
      { path: "/watch-history", label: "Watch History" },
      { path: "/bookmarks", label: "Bookmarks" },
    ];
    return (
      <nav className="navbar1">
        <div className="navbar-logo"></div>
        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${currentPath === link.path ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="profile-icon" onClick={() => (window.location.href = "/my-profile")}>
          👤
        </div>
      </nav>
    );
  };

  return (
    <>
      {isLoggedIn && !firstLogin && <Navbar />}
      <Routes>
        {!isLoggedIn && <Route path="/" element={<Home />} />}
        {!isLoggedIn && <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />}
        {!isLoggedIn && <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />}
        <Route path="/dashboard" element={<AuthCallBack onLogin={handleLogin} />} />
        {isLoggedIn && firstLogin && (
          <>
            <Route path="/select-language" element={<Language onNext={handleLanguageSelect} />} />
            <Route
              path="/select-genre"
              element={<Genre selectedLanguages={selectedLanguages} onNext={handleGenreSelect} />}
            />
            <Route path="*" element={<Navigate to="/select-language" replace />} />
          </>
        )}
        {isLoggedIn && !firstLogin && (
          <>
            <Route
              path="/home"
              element={
                <Home1
                  selectedLanguages={selectedLanguages}
                  selectedGenres={selectedGenres}
                  onLogout={handleLogout}
                />
              }
            />
            <Route path="/movies" element={<Movies />} />
            <Route path="/recommended" element={<Recommended userId={userId} />} />
            <Route path="/watch-history" element={<WatchHistory />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/my-profile" element={<MyProfile userId={userId} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </>
  );
}

export default App;
