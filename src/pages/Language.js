import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Select.css";

const languages = [
  { name: "Hindi", colorClass: "hindi" },
  { name: "English", colorClass: "english" },
  { name: "Punjabi", colorClass: "punjabi" },
  { name: "Haryanvi", colorClass: "haryanvi" },
  { name: "Telugu", colorClass: "telugu" },
  { name: "Tamil", colorClass: "tamil" },
  { name: "Bengali", colorClass: "bengali" },
  { name: "French", colorClass: "french" },
  { name: "Spanish", colorClass: "spanish" },
  { name: "Rajasthani", colorClass: "rajasthani" },
  { name: "Marathi", colorClass: "marathi" },
  { name: "Gujarati", colorClass: "gujarati" },
  { name: "Awadhi", colorClass: "awadhi" },
  { name: "Kannada", colorClass: "kannada" },
  { name: "Malayalam", colorClass: "malayalam" },
  { name: "Urdu", colorClass: "urdu" },
];

function Language() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleLanguage = (lang) => {
    if (selected.includes(lang)) {
      setSelected(selected.filter((l) => l !== lang));
    } else {
      setSelected([...selected, lang]);
    }
  };

  const handleNext = () => {
    navigate("/select-genre", { state: { selectedLanguages: selected } });
  };
  useEffect(() => {
    const handlePopState = (event) => {
      navigate("/signin", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="selection-container">
      <h1 className="title">Choose your Preferable languages</h1>
      <div className="grid">
        {languages.map((lang) => (
          <button
            key={lang.name}
            className={`card ${lang.colorClass} ${selected.includes(lang.name) ? "selected" : ""}`}
            onClick={() => toggleLanguage(lang.name)}
          >
            {lang.name}
          </button>
        ))}
      </div>
      <button
        className="next-button"
        onClick={handleNext}
        disabled={selected.length < 2}
      >
        Next
      </button>
    </div>
  );
}

export default Language;

