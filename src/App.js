import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Language from "./pages/Language";
import Genre from "./pages/Genre";

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
    setFirstLogin(false);
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

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
      </Routes>
    </Router>
  );
}

export default App;
