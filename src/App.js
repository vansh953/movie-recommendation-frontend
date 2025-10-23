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
import Home from "./pages/Home"; 
import Bookmarks from "./pages/Bookmarks"; // ✅ Import Bookmarks page

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userId, setUserId] = useState(null); // store logged-in user ID

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
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
      {isLoggedIn && !firstLogin && <Navbar1 />} {/* Navbar visible after login & first setup */}

      <Routes>
        {/* Default / home route */}
        <Route 
          path="/" 
          element={
            !isLoggedIn ? <Home /> :
            firstLogin ? <Navigate to="/select-language" /> :
            <Navigate to="/home" />
          } 
        />

        {/* Sign In */}
        <Route 
          path="/signin" 
          element={
            !isLoggedIn ? <SignIn onLogin={handleLogin} /> :
            firstLogin ? <Navigate to="/select-language" /> :
            <Navigate to="/home" />
          } 
        />

        {/* Sign Up */}
        <Route path="/signup" element={<SignUp />} />

        {/* Language selection */}
        <Route
          path="/select-language"
          element={isLoggedIn ? <Language onNext={handleLanguageSelect} /> : <Navigate to="/signin" />}
        />

        {/* Genre selection */}
        <Route
          path="/select-genre"
          element={isLoggedIn ? <Genre selectedLanguages={selectedLanguages} onNext={handleGenreSelect} /> : <Navigate to="/signin" />}
        />

        {/* Protected routes after login */}
        {isLoggedIn && !firstLogin && (
          <>
            <Route path="/home" element={<Home1 selectedLanguages={selectedLanguages} selectedGenres={selectedGenres} />} />
            <Route path="/recommended" element={<Recommended userId={userId} />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/my-profile" element={<MyProfile userId={userId} setIsLoggedIn={setIsLoggedIn} setFirstLogin={setFirstLogin} />} />
            <Route path="/bookmarks" element={<Bookmarks />} /> {/* ✅ Bookmarks route */}
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
