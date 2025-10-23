import React, { useEffect, useState } from "react";
import "../style/Home1.css"; // reuse existing styles for split-view, movie-box, buttons, etc.

function Bookmarks() {
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
    setBookmarkedMovies(stored);
  }, []);

  const handleRemove = (title) => {
    const updated = bookmarkedMovies.filter((movie) => movie.title !== title);
    localStorage.setItem("bookmarkedMovies", JSON.stringify(updated));
    setBookmarkedMovies(updated);
    if (selectedMovie && selectedMovie.title === title) {
      setSelectedMovie(null);
      setShowTrailer(false);
    }
  };

  // Split-view for selected movie
  if (selectedMovie) {
    return (
      <div className="home1-container">
        <div className="split-view">
          <div className="split-left">
            <img src={selectedMovie.cover} alt={selectedMovie.title} className="split-image" />
          </div>
          <div className="split-right">
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.longDesc}</p>

            {!showTrailer ? (
              <button className="play-btn" onClick={() => setShowTrailer(true)}>
                ▶ Play Trailer
              </button>
            ) : (
              <div className="trailer-container" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={selectedMovie.trailer}
                  title={selectedMovie.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                ></iframe>
              </div>
            )}

            <button className="bookmark-btn" onClick={() => handleRemove(selectedMovie.title)}>
              ❌ Remove Bookmark
            </button>

            <button className="close-btn" onClick={() => { setSelectedMovie(null); setShowTrailer(false); }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view for all bookmarks
  return (
    <div className="home1-container" style={{ flexDirection: "column", padding: "20px", overflowY: "auto" }}>
      <h2 style={{ color: "#ff3b3f", marginBottom: "20px" }}>Your Bookmarked Movies</h2>
      {bookmarkedMovies.length === 0 ? (
        <p style={{ color: "#fff" }}>No bookmarked movies yet!</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {bookmarkedMovies.map((movie, idx) => (
            <div
              key={idx}
              className="movie-box"
              style={{ width: "250px", height: "350px", flexDirection: "column", cursor: "pointer" }}
              onClick={() => setSelectedMovie(movie)}
            >
              <img src={movie.cover} alt={movie.title} className="movie-image" style={{ height: "70%" }} />
              <div className="movie-caption" style={{ padding: "10px" }}>
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
