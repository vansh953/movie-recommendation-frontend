import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation /* Import useLocation */ } from "react-router-dom"; // Import hooks
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
import AuthCallback from "./pages/AuthCallBack";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  // --- State Variables ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLogin, setFirstLogin] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  // --- ADDED: Loading state for initial auth check ---
  const [authLoading, setAuthLoading] = useState(true);

  // Hook to get current location
  const location = useLocation();

  // --- Effect for Initial Authentication Check ---
  useEffect(() => {
    console.log("App Mount: Starting auth check...");
    setAuthLoading(true); // Start loading
    const token = localStorage.getItem('authToken');
    console.log("App Mount: Checking token...", token ? "Found" : "Not Found");

    if (token) {
      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log("App Mount: Token expired.");
          handleLogout(); // Clears state and sets authLoading false inside
          return;
        }

        // Token seems valid
        setIsLoggedIn(true);
        setUserId(decodedToken.id);
        console.log("App Mount: Token valid, user ID set:", decodedToken.id);

        // Fetch profile to determine firstLogin status
        const fetchProfileAndSetStatus = async () => {
          console.log("App Mount: Fetching profile...");
          if (!API_BASE_URL) {
               console.error("App Mount: API_BASE_URL not set.");
               setFirstLogin(true); // Assume setup needed
               setAuthLoading(false); // Finish loading
               return;
          }
          try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data && response.data.genres && response.data.genres.length > 0) {
              console.log("App Mount: Profile OK, setup complete. Setting firstLogin false.");
              setFirstLogin(false);
              setSelectedLanguages(response.data.preferredLanguage ? [response.data.preferredLanguage] : []);
              setSelectedGenres(response.data.genres);
            } else {
              console.log("App Mount: Profile OK, setup needed. Setting firstLogin true.");
              setFirstLogin(true);
            }
          } catch (profileError) {
            console.error("App Mount: Failed to fetch profile:", profileError.response?.data || profileError.message);
            if (profileError.response?.status === 401) {
                 handleLogout(); // Log out on auth error
            } else {
                 setFirstLogin(true); // Assume setup needed on other errors
            }
          } finally {
            console.log("App Mount: Profile fetch finished, setting authLoading false.");
            setAuthLoading(false); // Finish loading HERE
          }
        };
        fetchProfileAndSetStatus();

      } catch (e) {
        console.log("App Mount: Invalid token format.");
        handleLogout(); // Also sets authLoading false
      }
    } else {
      // No token found
      console.log("App Mount: No token, ensuring logged out state.");
      setIsLoggedIn(false);
      setUserId(null);
      setFirstLogin(true);
      setAuthLoading(false); // Finish loading
    }
  }, []); // Run only once

  // --- Login Handler ---
  const handleLogin = (tokenOrId) => {
    // ... (Keep the existing handleLogin function as it was)
    // It should fetch the profile AFTER setting isLoggedIn/userId
    // to correctly determine firstLogin status immediately after login.
    let id;
    let tokenToUse = null;
    console.log("handleLogin called with:", tokenOrId);

    if (typeof tokenOrId === 'string' && tokenOrId.length > 50) { // Assume JWT Token (Google/Callback)
      try {
        const decodedToken = jwtDecode(tokenOrId);
        id = decodedToken.id;
        tokenToUse = tokenOrId;
        localStorage.setItem('authToken', tokenToUse);
        console.log("handleLogin: Token processed, user ID:", id);
      } catch (e) { /* ... error handling ... */ return; }
    } else if (tokenOrId) { // Assume user ID (Email login)
      id = tokenOrId;
      tokenToUse = localStorage.getItem('authToken');
      console.log("handleLogin: User ID processed:", id);
      if (!tokenToUse) { /* ... error handling ... */ return; }
    }

    if (id && tokenToUse) {
      setIsLoggedIn(true);
      setUserId(id);
      console.log("handleLogin: State updated - isLoggedIn: true, userId:", id);

      // Fetch profile post-login to set firstLogin correctly
      const checkSetupStatus = async () => {
          console.log("handleLogin: Fetching profile post-login...");
           if (!API_BASE_URL) { /* ... error handling ... */ setFirstLogin(true); return; }
          try {
              const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                  headers: { 'Authorization': `Bearer ${tokenToUse}` }
              });
              if (response.data?.genres?.length > 0) {
                  console.log("handleLogin: Profile shows genres exist. Setting firstLogin false.");
                  setFirstLogin(false);
                   setSelectedLanguages(response.data.preferredLanguage ? [response.data.preferredLanguage] : []);
                   setSelectedGenres(response.data.genres);
              } else {
                  console.log("handleLogin: Profile shows no genres. Setting firstLogin true.");
                  setFirstLogin(true);
              }
          } catch (profileError) { /* ... error handling ... */ setFirstLogin(true); }
      };
      checkSetupStatus();
    } else { /* ... error handling ... */ handleLogout(); }
  };

  // --- Logout Handler ---
  const handleLogout = () => {
    console.log("handleLogout: Clearing token and resetting state.");
    localStorage.clear(); // Clear all local storage for safety
    setIsLoggedIn(false);
    setUserId(null);
    setFirstLogin(true);
    setSelectedLanguages([]);
    setSelectedGenres([]);
    setAuthLoading(false); // Ensure loading stops on logout
    // No navigate here, let routing handle redirect
  };

  // --- Setup Handlers ---
  const handleLanguageSelect = (languages) => {
    setSelectedLanguages(Array.isArray(languages) ? languages : [languages]);
    // Navigation is handled in Language component
  };
  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres); // State updated AFTER API call in Genre.js
    setFirstLogin(false);      // Mark setup complete AFTER API call in Genre.js
    console.log("handleGenreSelect: Setup complete, firstLogin set to false.");
    // Navigation is handled in Genre.js now
  };

  // --- RENDER ---
  console.log("App Render: authLoading:", authLoading, "isLoggedIn:", isLoggedIn, "firstLogin:", firstLogin);

  // --- Show Loading Indicator ---
  if (authLoading) {
    // You can replace this with a nicer loading spinner component
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0d0d0d', color: 'white' }}>
            Loading Application...
        </div>
    );
  }

  // --- Render Routes After Auth Check ---
  return (
    <>
      {/* Navbar renders only when fully logged in and setup complete */}
      {isLoggedIn && !firstLogin && <Navbar1 onLogout={handleLogout} />}

      <Routes>
        {/* --- Public Routes & Initial Redirect Logic --- */}
        {/* Render Home only if not logged in */}
        {!isLoggedIn && <Route path="/" element={<Home />} />}
        {/* Render SignIn only if not logged in */}
        {!isLoggedIn && <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />}
        {/* Render SignUp only if not logged in */}
        {!isLoggedIn && <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />}
        {/* Google Auth Callback */}
        <Route path="/dashboard" element={<AuthCallback onLogin={handleLogin} />} />

        {/* --- Protected Routes --- */}
        {isLoggedIn ? (
            // --- Routes accessible when logged in ---
            <>
                {/* Setup Routes - Render ONLY if firstLogin is true */}
                <Route
                  path="/select-language"
                  element={firstLogin ? <Language onNext={handleLanguageSelect} /> : <Navigate to="/home" replace />}
                />
                <Route
                  path="/select-genre"
                  element={firstLogin ? <Genre selectedLanguages={selectedLanguages} onNext={handleGenreSelect} /> : <Navigate to="/home" replace />}
                />

                {/* Main App Routes - Render ONLY if firstLogin is false */}
                {!firstLogin && (
                    <>
                        <Route path="/home" element={<Home1 selectedLanguages={selectedLanguages} selectedGenres={selectedGenres} />} />
                        <Route path="/recommended" element={<Recommended userId={userId} />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/my-profile" element={<MyProfile userId={userId} onLogout={handleLogout} />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />
                        <Route path="/watch-history" element={<WatchHistory />} />
                         {/* If logged in and setup done, redirect unknown paths to home */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </>
                )}

                 {/* If logged in but setup not done, redirect unknown paths to language select */}
                 {firstLogin && location.pathname !== '/select-language' && location.pathname !== '/select-genre' && (
                     <Route path="*" element={<Navigate to="/select-language" replace />} />
                 )}
            </>
        ) : (
             
            <Route path="*" element={<Navigate to="/" replace />} />
        )}

      </Routes>
    </>
  );
}

export default App;