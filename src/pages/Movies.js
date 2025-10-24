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
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      setError(null);
      axios
        .get(`${API_BASE_URL}/api/movies/search?query=${searchTerm}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        })
        .then((res) => setSearchResults(res.data))
        .catch(() => setError("Failed to fetch movies."))
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleMovieClick = async (movie) => {
    if (!movie.trailer_link) return;
    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/history`,
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      window.dispatchEvent(new Event("watchHistoryUpdated"));
    } catch {}
    setTrailerUrl(embedUrl);
    setShowTrailer(true);
  };

  const handleBookmark = async (movie) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/bookmark`,
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
    } catch {}
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
      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}
      <div className="movies-list">
        {searchResults.map((movie) => (
          <div key={movie._id || movie.id} className="movie-card">
            <img src={movie.poster_path} alt={movie.title} onClick={() => handleMovieClick(movie)} />
            <h3>{movie.title}</h3>
            <button className="bookmark-btn" onClick={(e) => { e.stopPropagation(); handleBookmark(movie); }}>🔖 Bookmark</button>
          </div>
        ))}
        {!loading && !error && searchResults.length === 0 && searchTerm && <p className="status-text">No movies found matching "{searchTerm}".</p>}
      </div>
      {showTrailer && (
        <div className="trailer-modal" onClick={closeTrailer}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
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
