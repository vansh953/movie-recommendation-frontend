import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Recommended.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const videoUrl = new URL(url);
    const videoId = videoUrl.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    if (url.includes("youtube.com/embed/")) return url;
    return url;
  } catch {
    return "";
  }
}

const addToWatchHistoryAPI = async (movieId) => {
  if (!movieId) return;
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    await axios.post(
      `${API_BASE_URL}/api/user/history`,
      { movieId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {}
};

const addBookmarkAPI = async (movieId) => {
  if (!movieId) return;
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    await axios.post(
      `${API_BASE_URL}/api/user/bookmark`,
      { movieId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {}
};

const Recommended = ({ userId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/recommendations/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && Array.isArray(res.data.recommendedMoviesData)) {
          setMovies(res.data.recommendedMoviesData);
        } else setMovies([]);
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    if (movie.id) addToWatchHistoryAPI(movie.id);
  };

  const handleBookmark = (movie) => {
    if (movie.id) addBookmarkAPI(movie.id);
  };

  const handleCloseModal = () => setSelectedMovie(null);

  if (loading)
    return (
      <div className="recommended-page">
        <h1>Recommended Movies</h1>
        <p>Loading recommendations...</p>
      </div>
    );

  if (error)
    return (
      <div className="recommended-page">
        <h1>Recommended Movies</h1>
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <div className="recommended-page">
      <h1>⭐ Recommended Movies</h1>
      {movies.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <div className="movies-list">
          {movies.map((movie) => (
            <div key={movie.id || movie.title} className="movie-card">
              <img
                src={movie.poster_path}
                alt={movie.title}
                onClick={() => handleMovieClick(movie)}
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/200x300/111/FFF?text=No+Image")
                }
              />
              <h3>{movie.title}</h3>
              <button
                className="bookmark-btn"
                onClick={() => handleBookmark(movie)}
              >
                🔖 Bookmark
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <div className="trailer-modal" onClick={handleCloseModal}>
          <div
            className="trailer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedMovie.title}</h2>
            {getYouTubeEmbedUrl(selectedMovie.trailer_link) ? (
              <iframe
                src={getYouTubeEmbedUrl(selectedMovie.trailer_link)}
                title={`${selectedMovie.title} Trailer`}
                width="100%"
                height="80%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>No trailer available.</p>
            )}
            <button className="close-btn" onClick={handleCloseModal}>
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommended;
