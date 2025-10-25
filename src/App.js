import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Page Imports
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Language from "./pages/Language";
import Genre from "./pages/Genre";
import Home1 from "./pages/Home1";
import Navbar1 from "./pages/Navbar1";
import Movies from "./pages/Movies";
import Recommended from "./pages/Recommended";
import MyProfile from "./pages/MyProfile";
import Bookmarks from "./pages/Bookmarks";
import WatchHistory from "./pages/WatchHistory";
import Home from "./pages/Home";
import AuthCallBack from "./pages/AuthCallBack.js";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const location = useLocation();

  // Initial Authentication Check
  useEffect(() => {
    setAuthLoading(true);
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          handleLogout();
          return;
        }

        setIsLoggedIn(true);
        setUserId(decodedToken.id);

        const fetchProfile = async () => {
          if (!API_BASE_URL) {
            setFirstLogin(true);
            setAuthLoading(false);
            return;
          }

          try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.genres?.length > 0) {
              setFirstLogin(false);
              setSelectedLanguages(response.data.preferredLanguage ? [response.data.preferredLanguage] : []);
              setSelectedGenres(response.data.genres);
            } else {
              setFirstLogin(true);
            }
          } catch (error) {
            if (error.response?.status === 401) handleLogout();
            else setFirstLogin(true);
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

  // Login Handler
  const handleLogin = (tokenOrId) => {
    let id;
    let tokenToUse = null;

    if (typeof tokenOrId === "string" && tokenOrId.length > 50) {
      try {
        const decodedToken = jwtDecode(tokenOrId);
        id = decodedToken.id;
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

      const checkProfile = async () => {
        if (!API_BASE_URL) {
          setFirstLogin(true);
          return;
        }
        try {
          const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${tokenToUse}` },
          });

          if (response.data?.genres?.length > 0) {
            setFirstLogin(false);
            setSelectedLanguages(response.data.preferredLanguage ? [response.data.preferredLanguage] : []);
            setSelectedGenres(response.data.genres);
          } else setFirstLogin(true);
        } catch {
          setFirstLogin(true);
        }
      };
      checkProfile();
    } else handleLogout();
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserId(null);
    setFirstLogin(true);
    setSelectedLanguages([]);
    setSelectedGenres([]);
    setAuthLoading(false);
  };

  // Setup Handlers
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

  return (
    <>
      {isLoggedIn && !firstLogin && <Navbar1 onLogout={handleLogout} />}

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
              element={<Home1 selectedLanguages={selectedLanguages} selectedGenres={selectedGenres} />}
            />
            <Route path="/recommended" element={<Recommended userId={userId} />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/my-profile" element={<MyProfile userId={userId} onLogout={handleLogout} />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/watch-history" element={<WatchHistory />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}

        {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </>
  );
}

export default App;
