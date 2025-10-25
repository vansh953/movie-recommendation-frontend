import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Movies.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BOOKMARK_API_URL = `${API_BASE_URL}/api/bookmarks`;

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const videoUrl = new URL(url);
    const videoId = videoUrl.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return "";
  } catch {
    return "";
  }
}

const addBookmarkAPI = async (movieToAdd) => {
  if (!movieToAdd || !movieToAdd.id || !API_BASE_URL) {
    alert("Cannot bookmark this movie.");
    return false;
  }
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token.");
    const response = await axios.post(
      BOOKMARK_API_URL,
      { movieId: Number(movieToAdd.id) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(`"${movieToAdd.title}" added to bookmarks!`);
    return true;
  } catch (error) {
    if (error.response?.data?.msg === "Movie already bookmarked") {
      alert(`"${movieToAdd.title}" is already in your bookmarks.`);
    } else {
      alert("Failed to add bookmark. Please try again.");
    }
    return false;
  }
};

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailerInModal, setShowTrailerInModal] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token || !API_BASE_URL) return;
    axios
      .get(`${API_BASE_URL}/api/user/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setHistory(response.data?.filter((m) => m) || []))
      .catch(() => setError("Failed to load watch history."))
      .finally(() => setLoading(false));
  }, []);

  const handleMovieSelect = (movie) => {
    if (!movie) return;
    setSelectedMovie(movie);
    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);
    setTrailerUrl(embedUrl);
    setShowTrailerInModal(false);
  };

  const handleClose = () => {
    setSelectedMovie(null);
    setTrailerUrl("");
    setShowTrailerInModal(false);
  };

  if (selectedMovie) {
    return (
      <div className="movie-detail-container-overlay" onClick={handleClose}>
        <div className="movie-detail-card" onClick={(e) => e.stopPropagation()}>
          <div className="movie-detail-image-container">
            <img
              src={selectedMovie.poster_path}
              alt={selectedMovie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/400x600/111/FFF?text=No+Image";
              }}
            />
          </div>
          <div className="movie-detail-info-container">
            <h2
              style={{
                fontSize: "2.5em",
                color: "#ff3b3f",
                marginBottom: "20px",
              }}
            >
              {selectedMovie.title}
            </h2>
            <p
              style={{
                fontSize: "1.2em",
                lineHeight: "1.6",
                marginBottom: "30px",
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {selectedMovie.description || "No description available."}
            </p>

            {!showTrailerInModal && trailerUrl && (
              <button
                className="play-trailer-button"
                onClick={() => setShowTrailerInModal(true)}
              >
                ▶ Play Trailer
              </button>
            )}

            {showTrailerInModal && trailerUrl && (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  marginBottom: "15px",
                  backgroundColor: "#000",
                }}
              >
                <iframe
                  src={trailerUrl}
                  title={selectedMovie.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                ></iframe>
              </div>
            )}

            {!trailerUrl && <p style={{ marginBottom: "15px" }}>No trailer available.</p>}

            <button
              className="add-bookmark-button"
              onClick={() => addBookmarkAPI(selectedMovie)}
            >
              🔖 Add to Bookmarks
            </button>

            <button className="close-detail-button" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading)
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;

  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="watch-history-page">
      <h2 style={{ color: "#ff3b3f", marginBottom: "20px" }}>Watch History</h2>
      {history.length === 0 ? (
        <p style={{ color: "#fff" }}>No movies watched yet!</p>
      ) : (
        <div className="history-grid">
          {history.map((movie) =>
            movie ? (
              <div
                key={movie._id || movie.id}
                className="history-movie-card"
                onClick={() => handleMovieSelect(movie)}
              >
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/150x225/1a1a1a/FFF?text=No+Image";
                  }}
                />
                <div className="history-title-overlay">
                  <h3 style={{ margin: 0 }}>{movie.title}</h3>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default WatchHistory;
