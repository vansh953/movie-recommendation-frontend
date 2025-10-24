import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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
import AuthCallback from "./pages/AuthCallback";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("authToken");
    return !!token;
  });

  const [firstLogin, setFirstLogin] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userId, setUserId] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id;
      } catch (e) {
        localStorage.removeItem("authToken");
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUserId(decodedToken.id);

        const fetchProfile = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data && response.data.genres && response.data.genres.length > 0) {
              setFirstLogin(false);
              setSelectedLanguages(
                response.data.preferredLanguage ? [response.data.preferredLanguage] : []
              );
              setSelectedGenres(response.data.genres);
            } else {
              setFirstLogin(true);
            }
          } catch (profileError) {
            console.error("Failed to fetch profile:", profileError);
            setFirstLogin(true);
          }
        };
        fetchProfile();
      } catch (e) {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserId(null);
        setFirstLogin(true);
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
      setFirstLogin(true);
    }
  }, []);

  const handleLogin = (tokenOrId) => {
    let id;
    let tokenToUse = null;

    if (typeof tokenOrId === "string" && tokenOrId.length > 50) {
      try {
        const decodedToken = jwtDecode(tokenOrId);
        id = decodedToken.id;
        tokenToUse = tokenOrId;
        localStorage.setItem("authToken", tokenOrId);
      } catch (e) {
        console.error("Invalid token:", e);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserId(null);
        setFirstLogin(true);
        return;
      }
    } else if (tokenOrId) {
      id = tokenOrId;
      tokenToUse = localStorage.getItem("authToken");
      if (!tokenToUse) {
        console.error("Login successful but token missing in localStorage!");
        return;
      }
    }

    if (id) {
      setIsLoggedIn(true);
      setUserId(id);
      if (typeof tokenOrId === "string" && tokenOrId.length > 50) {
        setFirstLogin(false);
      } else {
        setFirstLogin(true);
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
      setFirstLogin(true);
      localStorage.removeItem("authToken");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserId(null);
    setFirstLogin(true);
  };

  const handleLanguageSelect = (languages) => {
    setSelectedLanguages(languages);
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
    setFirstLogin(false);
  };

  return (
    <>
      {isLoggedIn && !firstLogin && <Navbar1 onLogout={handleLogout} />}

      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? <Home /> : firstLogin ? <Navigate to="/select-language" /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/signin"
          element={
            !isLoggedIn ? <SignIn onLogin={handleLogin} /> : firstLogin ? <Navigate to="/select-language" /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/signup"
          element={!isLoggedIn ? <SignUp onLogin={handleLogin} /> : <Navigate to="/home" />}
        />
        <Route path="/dashboard" element={<AuthCallback onLogin={handleLogin} />} />
        <Route
          path="/select-language"
          element={isLoggedIn ? <Language onNext={handleLanguageSelect} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/select-genre"
          element={isLoggedIn ? <Genre selectedLanguages={selectedLanguages} onNext={handleGenreSelect} /> : <Navigate to="/signin" />}
        />

        {isLoggedIn && !firstLogin ? (
          <>
            <Route path="/home" element={<Home1 selectedLanguages={selectedLanguages} selectedGenres={selectedGenres} />} />
            <Route path="/recommended" element={<Recommended userId={userId} />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/my-profile" element={<MyProfile userId={userId} onLogout={handleLogout} />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/watch-history" element={<WatchHistory />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : isLoggedIn && firstLogin ? (
          <Route path="*" element={<Navigate to="/select-language" />} />
        ) : (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}

        {!isLoggedIn && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </>
  );
}

export default App;
