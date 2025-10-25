import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/MyProfile.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PROFILE_API_URL = `${API_BASE_URL}/api/user/profile`;

function MyProfile({ userId, setIsLoggedIn, setFirstLogin, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: "",
    mobile: "",
    gender: "",
    favoriteActor: "",
    favoriteDirector: "",
    dob: "",
    genres: [],
    preferredLanguage: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      navigate("/signin");
      return;
    }
    if (!API_BASE_URL) {
      setError("API URL configuration error.");
      setLoading(false);
      return;
    }

    axios
      .get(PROFILE_API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const fetchedProfile = response.data;
        setProfile((prev) => ({
          ...prev,
          name: fetchedProfile.name || "",
          email: fetchedProfile.email || "",
          profilePic: fetchedProfile.profilePic || "",
          genres: fetchedProfile.genres || [],
          preferredLanguage: fetchedProfile.preferredLanguage || "",
        }));
      })
      .catch((err) => {
        console.error("Error fetching profile:", err.response || err);
        setError("Failed to load profile data.");
        if (err.response?.status === 401) {
          handleLogout();
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      setLoading(true);
      setSaveError(null);
      const token = localStorage.getItem("authToken");
      if (!token || !API_BASE_URL) {
        setSaveError("Configuration or authentication error.");
        setLoading(false);
        return;
      }

      try {
        const genresArray =
          typeof profile.genres === "string"
            ? profile.genres
                .split(",")
                .map((g) => g.trim())
                .filter((g) => g)
            : profile.genres;

        const updateData = {
          name: profile.name,
          genres: genresArray,
          preferredLanguage: profile.preferredLanguage,
          profilePic: profile.profilePic,
        };

        const response = await axios.put(PROFILE_API_URL, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedProfile = response.data;
        setProfile((prev) => ({
          ...prev,
          name: updatedProfile.name || "",
          email: updatedProfile.email || prev.email,
          profilePic: updatedProfile.profilePic || "",
          genres: updatedProfile.genres || [],
          preferredLanguage: updatedProfile.preferredLanguage || "",
        }));

        setIsEditing(false);
      } catch (err) {
        console.error("Error saving profile:", err.response || err);
        setSaveError(err.response?.data?.msg || "Failed to save profile. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("selectedGender");
      localStorage.removeItem("selectedLanguages");
      localStorage.removeItem("selectedGenres");
      setIsLoggedIn(false);
      setFirstLogin(true);
      navigate("/");
    }
  };

  if (loading && !profile.email) {
    return (
      <div className="profile-container">
        <p style={{ color: "white" }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>
        {saveError && <p className="error-message" style={{ textAlign: "center" }}>{saveError}</p>}
        <div className="profile-info">
          <div className="profile-field">
            <label>Name:</label>
            {isEditing ? (
              <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Enter your name" />
            ) : (
              <span>{profile.name || "Not provided"}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{profile.email || "Not provided"}</span>
          </div>

          <div className="profile-field">
            <label>Preferred Language:</label>
            {isEditing ? (
              <input type="text" name="preferredLanguage" value={profile.preferredLanguage} onChange={handleChange} placeholder="e.g., English" />
            ) : (
              <span>{profile.preferredLanguage || "Not specified"}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Favorite Genres:</label>
            {isEditing ? (
              <input
                type="text"
                name="genres"
                value={Array.isArray(profile.genres) ? profile.genres.join(", ") : profile.genres}
                onChange={handleChange}
                placeholder="e.g., Action, Comedy, Drama"
              />
            ) : (
              <span>{Array.isArray(profile.genres) && profile.genres.length > 0 ? profile.genres.join(", ") : "Not specified"}</span>
            )}
          </div>
        </div>

        <div className="profile-buttons">
          <button onClick={handleEditToggle} disabled={loading}>
            {isEditing ? (loading ? "Saving..." : "Save Profile") : "Edit Profile"}
          </button>
          <button className="logout-btn" onClick={handleLogout} disabled={loading}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;