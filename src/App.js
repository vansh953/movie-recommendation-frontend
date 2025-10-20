import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Language from "./pages/Language";
import Genre from "./pages/Genre";
import Home1 from "./pages/Home1";
import Navbar1 from "./pages/Navbar1";
import Movies from "./pages/Movies";
import Recommended from "./pages/Recommended";
import MyProfile from "./pages/MyProfile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLanguageSelect = (languages) => {
    setSelectedLanguages(languages);
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
    setFirstLogin(false);
  };

  return (
    <Router>
      {isLoggedIn && !firstLogin && <Navbar1 />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              firstLogin ? (
                <Navigate to="/select-language" />
              ) : (
                <Home1
                  selectedLanguages={selectedLanguages}
                  selectedGenres={selectedGenres}
                />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/signin"
          element={
            isLoggedIn ? (
              firstLogin ? (
                <Navigate to="/select-language" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/select-language"
          element={
            isLoggedIn ? (
              <Language onNext={handleLanguageSelect} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/select-genre"
          element={
            isLoggedIn ? (
              <Genre
                selectedLanguages={selectedLanguages}
                onNext={handleGenreSelect}
              />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route path="/home" element={<Home1 selectedLanguages={selectedLanguages} selectedGenres={selectedGenres} />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
