import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Bookmark.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const HISTORY_API_URL = `${API_BASE_URL}/api/user/history`;

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
  if (!movieId || !API_BASE_URL) return;
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("No auth token found.");
    await axios.post(
      HISTORY_API_URL,
      { movieId: Number(movieId) },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Failed to add movie to watch history:", error.response?.data?.msg || error.message);
  }
};

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

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
    if (selectedMovie && selectedMovie._id === bookmarkIdToRemove) {
      handleCloseModal();
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

  const handleMovieClick = (bookmark) => {
    if (!bookmark || !bookmark.movie) return;
    const movie = bookmark.movie;
    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);
    setSelectedMovie(bookmark); 
    setShowTrailer(true);
    setTrailerUrl(embedUrl || "");
    if (movie.id) addToWatchHistoryAPI(movie.id); 
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setShowTrailer(false);
    setTrailerUrl("");
  };

  useEffect(() => {
    const styles = `
      .recommendations-page {
        padding: 20px;
        padding-top: 80px;
        color: white;
        background-color: #0d0d0d;
        min-height: calc(100vh - 70px);
      }
      .recommendations-page h1 {
        color: #ff3b3f;
        margin-bottom: 20px;
        text-align: center;
      }
      .error-message {
        color: red;
        text-align: center;
      }
      .movies-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 25px;
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }
      .movie-card {
        aspect-ratio: 2 / 3;
        height: auto;
        cursor: pointer;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        background-color: #1a1a1a;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .movie-card:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(255, 59, 63, 0.3);
      }
      .movie-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .movie-card h3 {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        padding: 10px;
        font-size: 0.9em;
        text-align: center;
        background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    const styleId = 'recommendations-styles'; 
    if (!document.getElementById(styleId)) {
      const newStyleSheet = document.createElement("style");
      newStyleSheet.id = styleId;
      newStyleSheet.type = "text/css";
      newStyleSheet.innerText = styles;
      document.head.appendChild(newStyleSheet);
    }
  }, []);


  return (
    <div className="recommendations-page"> {}
      <h1>⭐ Your Bookmarked Movies</h1> {}
      {loading && <p style={{ color: "#fff", textAlign: "center" }}>Loading bookmarks...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!loading && !error && bookmarks.length === 0 && (
        <p style={{ color: "#fff", textAlign: "center" }}>No bookmarked movies yet!</p>
      )}
      {!loading && !error && bookmarks.length > 0 && (
        <div className="movies-list"> {}
          {bookmarks.map((bookmark) =>
            bookmark.movie ? (
              <div
                key={bookmark._id}
                className="movie-card"
                onClick={() => handleMovieClick(bookmark)} 
              >
                <img
                  src={bookmark.movie.poster_path}
                  alt={bookmark.movie.title}
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/200x300/1a1a1a/FFF?text=No+Image";
                  }}
                />
                <h3>{bookmark.movie.title}</h3> 
              </div>
            ) : null
          )}
        </div>
      )}

      {showTrailer && selectedMovie && (
        <div className="trailer-modal" onClick={handleCloseModal}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.movie.title}</h2> {/* Use .movie object */}

            {trailerUrl ? (
              <iframe
                src={trailerUrl}
                title={`${selectedMovie.movie.title} Trailer`} 
                width="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  border: 'none',
                  marginBottom: '15px',
                  flexGrow: 1
                }}
              ></iframe>
            ) : (
              <p
                style={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ccc'
                }}
              >
                No trailer available.
              </p>
            )}

            <button
              className="remove-bookmark-button"
              onClick={() => handleRemove(selectedMovie._id)} 
              style={{
                background: 'linear-gradient(45deg, #ff3b3f, #c70039)', 
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                alignSelf: 'center',
                marginBottom: '10px'
              }}
            >
              ❌ Remove Bookmark
            </button>

            <button className="close-btn" onClick={handleCloseModal}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;