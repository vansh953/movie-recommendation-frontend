import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../style/Select.css";

const genres = [  ];
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Genre({ selectedLanguages, onNext }) {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const toggleGenre = (genre) => {
    setSelected(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleNext = async () => {
    if (selected.length === 0 || !token) return;

    try {
      await axios.put(`${API_BASE_URL}/api/user/profile`, 
        { genres: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onNext(selected);

      navigate("/home");
    } catch (err) {
      console.error("Failed to save genres:", err);
      alert("Could not save genres. Try again.");
    }
  };

  return (
    <div className="selection-container">
      <h1 className="title">Choose your Favourite Genres</h1>
      <div className="grid">
        {genres.map(genre => (
          <button
            key={genre.name}
            className={`card ${genre.colorClass} ${selected.includes(genre.name) ? "selected" : ""}`}
            onClick={() => toggleGenre(genre.name)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <button
        className="next-button"
        onClick={handleNext}
        disabled={selected.length === 0}
      >
        Finish
      </button>
    </div>
  );
}

export default Genre;
