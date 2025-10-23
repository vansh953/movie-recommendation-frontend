import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/MyProfile.css";

function MyProfile({ setIsLoggedIn, setFirstLogin }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    languages: "",
    genres: "",
    favoriteActor: "",
    favoriteDirector: "",
    dob: "",
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    const selectedGender = localStorage.getItem("selectedGender");
    const selectedLanguages = localStorage.getItem("selectedLanguages");
    const selectedGenres = localStorage.getItem("selectedGenres");

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      parsedProfile.gender = selectedGender || parsedProfile.gender || "";
      parsedProfile.languages = selectedLanguages || parsedProfile.languages || "";
      parsedProfile.genres = selectedGenres || parsedProfile.genres || "";
      setProfile(parsedProfile);
    } else {
      const userEmail = localStorage.getItem("userEmail") || "";
      setProfile({
        name: "",
        email: userEmail,
        mobile: "",
        gender: selectedGender || "",
        languages: selectedLanguages || "",
        genres: selectedGenres || "",
        favoriteActor: "",
        favoriteDirector: "",
        dob: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "gender") {
      localStorage.setItem("selectedGender", value);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("selectedGender", profile.gender);
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setFirstLogin(true);
    navigate("/");
  };

  const formatDOB = (dob) => {
    if (!dob) return "Not specified";
    const dateObj = new Date(dob);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>
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
            {isEditing ? (
              <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Enter your email" />
            ) : (
              <span>{profile.email || "Not provided"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Gender:</label>
            {isEditing ? (
              <select name="gender" value={profile.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span>{profile.gender || "Not specified"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Preferred Languages:</label>
            {isEditing ? (
              <input type="text" name="languages" value={profile.languages} onChange={handleChange} placeholder="Enter preferred languages" />
            ) : (
              <span>{profile.languages || "Not specified"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Favorite Genres:</label>
            {isEditing ? (
              <input type="text" name="genres" value={profile.genres} onChange={handleChange} placeholder="Enter favorite genres" />
            ) : (
              <span>{profile.genres || "Not specified"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Mobile Number:</label>
            {isEditing ? (
              <input type="text" name="mobile" value={profile.mobile} onChange={handleChange} placeholder="Enter your mobile number" />
            ) : (
              <span>{profile.mobile || "Not provided"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Favorite Actor:</label>
            {isEditing ? (
              <input type="text" name="favoriteActor" value={profile.favoriteActor} onChange={handleChange} placeholder="Enter favorite actor" />
            ) : (
              <span>{profile.favoriteActor || "Not specified"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Favorite Director:</label>
            {isEditing ? (
              <input type="text" name="favoriteDirector" value={profile.favoriteDirector} onChange={handleChange} placeholder="Enter favorite director" />
            ) : (
              <span>{profile.favoriteDirector || "Not specified"}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Date of Birth:</label>
            {isEditing ? (
              <input type="date" name="dob" value={profile.dob} onChange={handleChange} />
            ) : (
              <span>{formatDOB(profile.dob)}</span>
            )}
          </div>
        </div>
        <div className="profile-buttons">
          <button onClick={handleEditToggle}>{isEditing ? "Save Profile" : "Edit Profile"}</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
