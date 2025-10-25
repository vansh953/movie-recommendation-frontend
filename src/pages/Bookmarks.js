import React, { useEffect, useState } from "react";
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

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovieData, setSelectedMovieData] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to view bookmarks.");
      setLoading(false);
      return;
    }
    if (!API_BASE_URL) {
      setError("API URL configuration error.");
      setLoading(false);
      return;
    }
    axios
      .get(`${API_BASE_URL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) =>
        setBookmarks(response.data?.filter((b) => b.movie) || [])
      )
      .catch(() => {
        setError("Failed to load bookmarks.");
        setBookmarks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (bookmarkIdToRemove) => {
    if (!bookmarkIdToRemove) return;
    const originalBookmarks = [...bookmarks];
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark._id !== bookmarkIdToRemove)
    );
    if (selectedMovieData && selectedMovieData.bookmarkId === bookmarkIdToRemove) {
      setSelectedMovieData(null);
      setShowTrailer(false);
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found.");
      await axios.delete(`${API_BASE_URL}/api/bookmarks/${bookmarkIdToRemove}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      setError("Failed to remove bookmark. Please try again.");
      setBookmarks(originalBookmarks);
    }
  };

  const handleMovieSelect = (bookmark) => {
    if (bookmark && bookmark.movie && bookmark._id) {
      setSelectedMovieData({ movie: bookmark.movie, bookmarkId: bookmark._id });
      setShowTrailer(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovieData(null);
    setShowTrailer(false);
  };

  useEffect(() => {
    const styles = `
      .bookmarks-page {
        width: 100%; min-height: calc(100vh - 70px);
        padding-top: 70px; padding: 20px; box-sizing: border-box;
        background-color: #0d0d0d; display: flex; flex-direction: column;
      }
      .bookmarks-page h2 { color: #ff3b3f; margin-bottom: 20px; }
      .bookmarks-grid {
        display: grid; width: 100%; max-width: 1400px;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 20px; padding: 0 20px 20px 20px;
        box-sizing: border-box; align-self: center;
      }
      .bookmark-movie-card {
        aspect-ratio: 2 / 3;
        height: auto; min-height: 225px;
        cursor: pointer; border-radius: 8px; overflow: hidden;
        position: relative; box-shadow: 0 4px 10px rgba(255, 59, 63, 0.15);
        background-color: #1a1a1a;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .bookmark-movie-card:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(255, 59, 63, 0.3);
      }
      .bookmark-movie-card img {
        width: 100%; height: 100%; object-fit: cover; display: block;
      }
      .bookmark-title-overlay {
        position: absolute; bottom: 0; left: 0; right: 0; padding: 8px;
        background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
        color: #fff; text-align: center; font-size: 0.9em;
      }
      .bookmark-title-overlay h3 {
        margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
    `;
    const styleId = "bookmarks-styles";
    let styleSheet = document.getElementById(styleId);
    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  if (selectedMovieData) {
    const movie = selectedMovieData.movie;
    const bookmarkId = selectedMovieData.bookmarkId;
    const trailerEmbedUrl = getYouTubeEmbedUrl(movie.trailer_link);
    return (
      <div className="movie-detail-container-overlay" onClick={handleCloseModal}>
        <div className="movie-detail-card" onClick={(e) => e.stopPropagation()}>
          <div className="movie-detail-image-container">
            <img
              src={movie.poster_path}
              alt={movie.title}
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
              {movie.title}
            </h2>
            <p
              style={{
                fontSize: "1.2em",
                lineHeight: "1.6",
                marginBottom: "30px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {movie.description || "No description available."}
            </p>
            {!showTrailer && trailerEmbedUrl && (
              <button
                className="play-trailer-button"
                onClick={() => setShowTrailer(true)}
              >
                ▶ Play Trailer
              </button>
            )}
            {showTrailer && trailerEmbedUrl && (
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
                  src={trailerEmbedUrl}
                  title={`${movie.title} Trailer`}
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
            {!trailerEmbedUrl && (
              <p style={{ marginBottom: "15px" }}>No trailer available.</p>
            )}
            <button
              className="remove-bookmark-button"
              onClick={() => handleRemove(bookmarkId)}
            >
              ❌ Remove Bookmark
            </button>
            <button className="close-detail-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <h2>🔖 Your Bookmarked Movies</h2>
      {loading && <p style={{ color: "#fff" }}>Loading bookmarks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && bookmarks.length === 0 && (
        <p style={{ color: "#fff" }}>No bookmarked movies yet!</p>
      )}
      {!loading && !error && bookmarks.length > 0 && (
        <div className="bookmarks-grid">
          {bookmarks.map((bookmark) =>
            bookmark.movie ? (
              <div
                key={bookmark._id}
                className="bookmark-movie-card"
                onClick={() => handleMovieSelect(bookmark)}
              >
                <img
                  src={bookmark.movie.poster_path}
                  alt={bookmark.movie.title}
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
                <div className="bookmark-title-overlay">
                  <h3 style={{ margin: 0 }}>{bookmark.movie.title}</h3>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
