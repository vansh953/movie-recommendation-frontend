import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import Bookmarks from "./pages/Bookmarks";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUserId(user._id);
      setFirstLogin(user.firstLogin ?? true);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserId(user._id);
    setFirstLogin(user.firstLogin ?? true);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLanguageSelect = (languages) => {
    setSelectedLanguages(languages);
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
    setFirstLogin(false);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem("user", JSON.stringify({ ...user, firstLogin: false }));
    }
  };

  return (
    <>
      {isLoggedIn && !firstLogin && <Navbar1 />}

      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? <Home /> :
            firstLogin ? <Navigate to="/select-language" /> :
            <Navigate to="/home" />
          }
        />
        <Route
          path="/signin"
          element={
            !isLoggedIn ? <SignIn onLogin={handleLogin} /> :
            firstLogin ? <Navigate to="/select-language" /> :
            <Navigate to="/home" />
          }
        />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/select-language"
          element={isLoggedIn ? <Language onNext={handleLanguageSelect} /> : <Navigate to="/signin" />}
        />

        <Route
          path="/select-genre"
          element={isLoggedIn ? <Genre selectedLanguages={selectedLanguages} onNext={handleGenreSelect} /> : <Navigate to="/signin" />}
        />

        <Route
          path="/home"
          element={isLoggedIn && !firstLogin ? <Home1 selectedLanguages={selectedLanguages} selectedGenres={selectedGenres} /> : <Navigate to="/" />}
        />
        <Route
          path="/recommended"
          element={isLoggedIn && !firstLogin ? <Recommended userId={userId} /> : <Navigate to="/" />}
        />
        <Route
          path="/movies"
          element={isLoggedIn && !firstLogin ? <Movies /> : <Navigate to="/" />}
        />
        <Route
          path="/my-profile"
          element={isLoggedIn && !firstLogin ? <MyProfile userId={userId} setIsLoggedIn={setIsLoggedIn} setFirstLogin={setFirstLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/bookmarks"
          element={isLoggedIn && !firstLogin ? <Bookmarks /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

