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

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/api/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMovies(res.data || []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    addToWatchHistoryAPI(movie.id);
  };

  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div className="movies-page">
      <h1>Movies</h1>
      <input
        type="text"
        className="search-bar"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading movies...</p>
      ) : filteredMovies.length === 0 ? (
        <p>No movies found</p>
      ) : (
        <div className="movies-list">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id || movie._id}
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.poster_path}
                alt={movie.title}
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/200x300/111/FFF?text=No+Image")
                }
              />
              <h3>{movie.title}</h3>
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
                style={{ border: "none", marginBottom: "10px" }}
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

export default Movies;
