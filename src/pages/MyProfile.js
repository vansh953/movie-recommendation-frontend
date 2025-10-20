import React, { useState } from "react";
import "../style/NavbarHome.css";

function MyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    interests: "",
    favoriteArtists: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-form">
        <label>Name</label>
        <input name="name" value={profile.name} onChange={handleChange} />

        <label>Date of Birth</label>
        <input type="date" name="dob" value={profile.dob} onChange={handleChange} />

        <label>Interests</label>
        <input name="interests" value={profile.interests} onChange={handleChange} />

        <label>Favorite Artists</label>
        <input name="favoriteArtists" value={profile.favoriteArtists} onChange={handleChange} />

        <button className="save-btn">Save Profile</button>
      </div>
    </div>
  );
}

export default MyProfile;
