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
  { name: "Documentary", colorClass: "documentary" },
];

function Genre({ onNext }) {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const selectedLanguage = location.state?.selectedLanguage || "";

  const toggleGenre = (genre) => {
    setSelected(selected === genre ? "" : genre);
  };

  const handleNext = () => {
    onNext(selected); 
    navigate("/"); 
  };

  return (
    <div className="selection-container">
      <h1 className="title">Choose your favourite genre</h1>
      <div className="grid">
        {genres.map((genre) => (
          <button
            key={genre.name}
            className={`card ${genre.colorClass} ${selected === genre.name ? "selected" : ""}`}
            onClick={() => toggleGenre(genre.name)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <button
        className="next-button"
        onClick={handleNext}
        disabled={!selected}
      >
        Finish
      </button>
    </div>
  );
}

export default Genre;
