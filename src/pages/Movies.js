import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const videoUrl = new URL(url);
    const videoId = videoUrl.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  } catch {
    return "";
  }
}

function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      setError(null);

      axios.get(`${API_BASE_URL}/api/movies/search?query=${searchTerm}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((response) => setSearchResults(response.data))
      .catch(() => setError("Failed to fetch movies. Please try again."))
      .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleMovieClick = async (movie) => {
    if (!movie.trailer_link) return alert("No trailer available for this movie.");
    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);

    try {
      await axios.post(`${API_BASE_URL}/api/user/history`, { movieId: movie.id }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } 
      });
    } catch {}

    setTrailerUrl(embedUrl);
    setShowTrailer(true);
  };

  const closeTrailer = () => { setShowTrailer(false); setTrailerUrl(""); };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      paddingTop: "70px", // below navbar
      boxSizing: "border-box",
      backgroundColor: "#0d0d0d",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <h1 style={{ color: "#ff3b3f", marginBottom: "20px" }}>🎞️ Movies</h1>
      
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "80%",
          maxWidth: "600px",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          marginBottom: "30px",
          fontSize: "1rem",
        }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "20px",
        padding: "0 20px",
        flexGrow: 1,
      }}>
        {searchResults.map((movie) => (
          <div key={movie._id} 
               style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
               onClick={() => handleMovieClick(movie)}>
            <img 
              src={movie.poster_path} 
              alt={movie.title} 
              style={{ width: "100%", height: "225px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} 
            />
            <h3 style={{ textAlign: "center", fontSize: "1em" }}>{movie.title}</h3>
          </div>
        ))}
        {!loading && searchResults.length === 0 && searchTerm.length > 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No movies found for "{searchTerm}"</p>
        )}
        {!loading && searchResults.length === 0 && searchTerm.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>Start typing to search for movies</p>
        )}
      </div>

      {showTrailer && (
        <div 
          onClick={closeTrailer}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "80%",
            maxWidth: "900px",
            height: "70%",
            maxHeight: "600px",
            position: "relative",
          }}>
            <iframe 
              src={trailerUrl}
              title="Movie Trailer"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none", borderRadius: "8px" }}
            ></iframe>
            <button 
              onClick={closeTrailer}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                backgroundColor: "#ff3b3f",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >✖ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
