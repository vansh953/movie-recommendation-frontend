import React, { useState, useEffect } from "react";
import "../style/Home1.css";

import M1 from "../assets/M1.jpg";
import M2 from "../assets/M2.jpg";
import M3 from "../assets/M3.jpg";
import M4 from "../assets/M4.jpg";
import M5 from "../assets/M5.jpg";
import M6 from "../assets/M6.jpg";
import M7 from "../assets/M7.jpg";
import M8 from "../assets/M8.jpg";
import M9 from "../assets/M9.jpg";
import M10 from "../assets/M10.jpg";

const movies = [
  {
    title: "Chhaava",
    cover: M1,
    shortDesc: "Historical action drama based on Chhatrapati Sambhaji Maharaj.",
    longDesc: "Chhaava depicts the heroic life and struggles of Chhatrapati Sambhaji Maharaj, combining historical accuracy with cinematic spectacle.",
    trailer: "https://www.youtube.com/embed/nsC5PhXS19Y"
  },
  {
    title: "Kantara: A Legend – Chapter 1",
    cover: M2,
    shortDesc: "Prequel diving deeper into the mythology of Kantara.",
    longDesc: "Rishab Shetty returns in this epic prequel exploring folklore and traditions that shaped the first film's universe.",
    trailer: "https://www.youtube.com/embed/Frp0zC4643U"
  },
  {
    title: "Saiyaara",
    cover: M3,
    shortDesc: "Romantic drama with compelling storytelling.",
    longDesc: "Saiyaara is a captivating romantic drama known for its emotional depth, stellar performances, and beautiful soundtrack.",
    trailer: "https://www.youtube.com/embed/nF31d_f4n_A"
  },
  {
    title: "Coolie",
    cover: M4,
    shortDesc: "Tamil action blockbuster.",
    longDesc: "Coolie is an action-packed film from Tamil cinema, praised for its thrilling sequences and blockbuster appeal.",
    trailer: "https://www.youtube.com/embed/6xqNk5Sf5jo"
  },
  {
    title: "War 2",
    cover: M5,
    shortDesc: "Sequel to the high-octane action franchise.",
    longDesc: "War 2 continues the saga of elite agents with breathtaking action scenes and engaging storytelling.",
    trailer: "https://www.youtube.com/embed/dK1W-AViQ-M"
  },
  {
    title: "Mahavatar Narsimha",
    cover: M6,
    shortDesc: "Spiritual action with mythological narratives.",
    longDesc: "Mahavatar Narsimha explores ancient myths and legends through intense action and stunning visuals.",
    trailer: "https://www.youtube.com/embed/wkOYEhjAXyo"
  },
  {
    title: "Sunny Sanskari Ki Tulsi Kumari",
    cover: M7,
    shortDesc: "Romantic comedy starring Varun Dhawan.",
    longDesc: "A heartwarming romantic comedy filled with humor, love, and colorful characters, perfect for family viewing.",
    trailer: "https://www.youtube.com/embed/Ask30y_yaik"
  },
  {
    title: "Ek Deewane Ki Deewaniyat",
    cover: M8,
    shortDesc: "Love story featuring Harshvardhan Rane.",
    longDesc: "A romantic tale capturing the essence of youthful love and emotional drama.",
    trailer: "https://www.youtube.com/embed/dGb3acfZp2k"
  },
  {
    title: "The TAJ Story",
    cover: M9,
    shortDesc: "Historical drama highlighting the Taj Mahal.",
    longDesc: "A journey into the creation of one of the world's most iconic monuments, exploring love and history.",
    trailer: "https://www.youtube.com/embed/rFDGTuwAnbk"
  },
  {
    title: "Lord Curzon Ki Haveli",
    cover: M10,
    shortDesc: "Mystery drama centered around a historical haveli.",
    longDesc: "Exploring secrets and stories of a grand haveli from the British era, with intense drama and intrigue.",
    trailer: "https://www.youtube.com/embed/QsiVBi0seyk"
  }
];

function Home1() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? movies.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="home1-container">
      <div
        className="movie-fullscreen"
        style={{ backgroundImage: `url(${movies[currentIndex].cover})` }}
      >
        <button className="arrow left" onClick={handlePrev}>◀</button>
        <div className="movie-info">
          <h1>{movies[currentIndex].title}</h1>
          <p>{movies[currentIndex].shortDesc}</p>
          <button onClick={() => setSelectedMovie(movies[currentIndex])}>
            View Details & Trailer
          </button>
        </div>
        <button className="arrow right" onClick={handleNext}>▶</button>

        <div className="dots-container">
          {movies.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => handleDotClick(idx)}
            ></span>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <div className="movie-details-overlay">
          <div className="movie-details-card">
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.shortDesc}</p>
            <p>{selectedMovie.longDesc}</p>
            <div className="trailer-container">
              <iframe
                width="100%"
                height="315"
                src={selectedMovie.trailer}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              className="close-btn"
              onClick={() => setSelectedMovie(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home1;
