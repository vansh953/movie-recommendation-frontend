import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Select.css";

const genres = [
  { name: "Comedy", colorClass: "comedy" },
  { name: "Love", colorClass: "love" },
  { name: "Mystery", colorClass: "mystery" },
  { name: "Action", colorClass: "action" },
  { name: "Horror", colorClass: "horror" },
  { name: "Thriller", colorClass: "thriller" },
  { name: "Fantasy", colorClass: "fantasy" },
  { name: "Adventure", colorClass: "adventure" },
  { name: "Drama", colorClass: "drama" },
  { name: "Sci-Fi", colorClass: "scifi" },
  { name: "Musical", colorClass: "musical" },
  { name: "Animation", colorClass: "animation" },
  { name: "Biography", colorClass: "biography" },
  { name: "Documentary", colorClass: "documentary" }
];

function Genre({ onNext }) {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedLanguages = location.state?.selectedLanguages || [];

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter((g) => g !== genre));
    } else {
      setSelected([...selected, genre]);
    }
  };

  const handleNext = () => {
    onNext(selected); // save selected genres in App.js
    navigate("/"); // go to Home1 page
  };

  return (
    <div className="selection-container">
      <h1 className="title">Choose your favourite genres</h1>
      <div className="grid">
        {genres.map((genre) => (
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
        disabled={selected.length < 1}
      >
        Finish
      </button>
    </div>
  );
}

export default Genre;

