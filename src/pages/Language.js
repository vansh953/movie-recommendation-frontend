import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Select.css";

const languages = [ ];
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Language({ onNext }) {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const toggleLanguage = (lang) => setSelected(selected === lang ? "" : lang);

  const handleNext = async () => {
    if (!selected || !token) return;

    try {
      await axios.put(`${API_BASE_URL}/api/user/profile`, 
        { preferredLanguage: selected }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onNext([selected]);
      navigate("/select-genre");
    } catch (err) {
      console.error("Failed to save language:", err);
      alert("Could not save language. Try again.");
    }
  };

  useEffect(() => {
    const handlePopState = () => navigate("/signin", { replace: true });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  return (
    <div className="selection-container">
      <h1 className="title">Choose your Preferable Language</h1>
      <div className="grid">
        {languages.map(lang => (
          <button
            key={lang.name}
            className={`card ${lang.colorClass} ${selected === lang.name ? "selected" : ""}`}
            onClick={() => toggleLanguage(lang.name)}
          >
            {lang.name}
          </button>
        ))}
      </div>
      <button
        className="next-button"
        onClick={handleNext}
        disabled={!selected}
      >
        Next
      </button>
    </div>
  );
}

export default Language;
