import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Movies.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BOOKMARK_API_URL = `${API_BASE_URL}/api/bookmarks`;
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

const addBookmarkAPI = async (movieToAdd) => {
  if (!movieToAdd || !movieToAdd.id || !API_BASE_URL) {
    alert("Cannot bookmark this movie.");
    return false;
  }
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("No auth token.");
    const response = await axios.post(
      BOOKMARK_API_URL,
      { movieId: Number(movieToAdd.id) },
      { headers: { 'Authorization': `Bearer ${token}` } }
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

function Recommended({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (!userId) { setError("User ID is missing."); setLoading(false); return; }
    setLoading(true); setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) { setError("Authentication token not found."); setLoading(false); return; }
    if (!API_BASE_URL) { setError("API URL missing."); setLoading(false); return; }

    axios.get(`${API_BASE_URL}/api/recommendations/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (response.data && Array.isArray(response.data.recommendedMoviesData)) {
          setRecommendations(response.data.recommendedMoviesData);
        } else {
          setRecommendations([]);
          setError("Invalid recommendations format.");
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setError("No recommendations found yet.");
          setRecommendations([]);
        } else {
          setError("Failed to load recommendations.");
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

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

  const handleMovieClick = (movie) => {
    if (!movie) return;
    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);
    setSelectedMovie(movie);
    setShowTrailer(true);
    setTrailerUrl(embedUrl || "");
    if (movie.id) addToWatchHistoryAPI(movie.id);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setShowTrailer(false);
    setTrailerUrl("");
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <h1>⭐ Recommended Movies</h1>
        <p style={{ textAlign: 'center', color: 'grey' }}>Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <h1>⭐ Recommended Movies</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <h1>⭐ Recommended Movies</h1>
      {recommendations.length === 0 ? (
        <p style={{ color: 'grey', textAlign: 'center' }}>
          No recommendations available yet. Watch some trailers or bookmark movies!
        </p>
      ) : (
        <div className="movies-list">
          {recommendations.map((movie) => (
            <div
              key={movie.id || movie.imdb_id || movie.title}
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.poster_path}
                alt={movie.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/200x300/1a1a1a/FFF?text=No+Image';
                }}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}

      {showTrailer && selectedMovie && (
        <div className="trailer-modal" onClick={handleCloseModal}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>

            {trailerUrl ? (
              <iframe
                src={trailerUrl}
                title={`${selectedMovie.title} Trailer`}
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
              className="add-bookmark-button"
              onClick={() => addBookmarkAPI(selectedMovie)}
              style={{
                background: 'linear-gradient(45deg, #1e90ff, #4169e1)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                alignSelf: 'center',
                marginBottom: '10px'
              }}
            >
              🔖 Add to Bookmarks
            </button>

            <button className="close-btn" onClick={handleCloseModal}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommended;
