import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // fixed import

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Language from "./pages/Language";
import Genre from "./pages/Genre";
import Home1 from "./pages/Home1";
import Navbar1 from "./pages/Navbar1";
import Movies from "./pages/Movies";
import Recommended from "./pages/Recommended";
import MyProfile from "./pages/MyProfile";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleLogin = (tokenOrId) => {
    let id;

    if (typeof tokenOrId === "string" && tokenOrId.length > 50) {
      try {
        const decodedToken = jwtDecode(tokenOrId);
        id = decodedToken.id;
        localStorage.setItem("authToken", tokenOrId);
      } catch (e) {
        console.error("Invalid token:", e);
        return;
      }
    } else if (tokenOrId) {
      id = tokenOrId;
    }

    if (id) {
      setIsLoggedIn(true);
      setUserId(id);
    }
  };

  const handleLanguageSelect = (languages) => setSelectedLanguages(languages);
  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
    setFirstLogin(false);
  };

  return (
    <>
      {isLoggedIn && !firstLogin && <Navbar1 />}

      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Home />
            ) : firstLogin ? (
              <Navigate to="/select-language" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route
          path="/signin"
          element={
            !isLoggedIn ? (
              <SignIn onLogin={handleLogin} />
            ) : firstLogin ? (
              <Navigate to="/select-language" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />

        <Route
          path="/dashboard"
          element={<AuthCallback onLogin={handleLogin} />}
        />

        <Route
          path="/select-language"
          element={
            isLoggedIn ? <Language onNext={handleLanguageSelect} /> : <Navigate to="/signin" />
          }
        />

        <Route
          path="/select-genre"
          element={
            isLoggedIn ? (
              <Genre selectedLanguages={selectedLanguages} onNext={handleGenreSelect} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        {isLoggedIn && !firstLogin && (
          <>
            <Route
              path="/home"
              element={
                <Home1
                  selectedLanguages={selectedLanguages}
                  selectedGenres={selectedGenres}
                />
              }
            />
            <Route path="/recommended" element={<Recommended userId={userId} />} />
            <Route path="/movies" element={<Movies />} />
            <Route
              path="/my-profile"
              element={
                <MyProfile
                  userId={userId}
                  setIsLoggedIn={setIsLoggedIn}
                  setFirstLogin={setFirstLogin}
                />
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
