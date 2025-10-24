import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Movies.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const videoUrl = new URL(url);
    const videoId = videoUrl.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  } catch (error) {
    console.error("Invalid trailer URL:", error);
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => setSearchResults(response.data))
      .catch(err => {
        console.error("Search error:", err);
        setError("Failed to fetch movies. Please try again.");
      })
      .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleMovieClick = async (movie) => {
    if (!movie.trailer_link) {
      alert("No trailer available for this movie.");
      return;
    }

    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);

    try {
      if (API_BASE_URL) {
        await axios.post(
          `${API_BASE_URL}/api/user/history`,
          { movieId: movie.id },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        console.log(`Added "${movie.title}" (ID: ${movie.id}) to watch history.`);
      }
    } catch (e) {
      console.error("Failed to save to watch history via API:", e.response?.data?.msg || e.message);
    }

    setTrailerUrl(embedUrl);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerUrl("");
  };

  return (
    <div className="movies-page">
      <h1>🎞️ Movies</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <h2>Search Results</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="movies-list">
        {!loading && !error && searchResults.length > 0 && (
          searchResults.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              <img src={movie.poster_path} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))
        )}

        {!loading && !error && searchResults.length === 0 && searchTerm.length > 0 && (
          <p>No movies found matching "{searchTerm}".</p>
        )}

        {!loading && !error && searchResults.length === 0 && searchTerm.length === 0 && (
          <p>Start typing to search for a movie.</p>
        )}
      </div>

      {showTrailer && (
        <div className="trailer-modal" onClick={closeTrailer}>
          <div className="trailer-content" onClick={e => e.stopPropagation()}>
            <iframe
              src={trailerUrl}
              title="Movie Trailer"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="close-btn" onClick={closeTrailer}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
