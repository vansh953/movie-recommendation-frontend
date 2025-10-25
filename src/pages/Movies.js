import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Movies.css";

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
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found.");
    await axios.post(
      HISTORY_API_URL,
      { movieId: Number(movieId) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`Added movie ID ${movieId} to watch history via API.`);
  } catch (error) {
    console.error(
      "Failed to add movie to watch history via API:",
      error.response?.data?.msg || error.message
    );
  }
};

const addBookmarkAPI = async (movieToAdd) => {
  if (!movieToAdd || !movieToAdd.id || !API_BASE_URL) {
    console.error("Invalid movie data or API URL for bookmarking.");
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
    console.error("Failed to add bookmark:", error.response?.data || error.message);
    if (error.response?.data?.msg === "Movie already bookmarked") {
      alert(`"${movieToAdd.title}" is already in your bookmarks.`);
    } else {
      alert("Failed to add bookmark. Please try again.");
    }
    return false;
  }
};

function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!API_BASE_URL) {
        setError("API URL configuration missing.");
        setLoading(false);
        return;
      }
      axios
        .get(`${API_BASE_URL}/api/movies/search?query=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setSearchResults(response.data || []))
        .catch((err) => {
          console.error("Search error:", err.response || err);
          setError("Failed to fetch movies. Please try again.");
          setSearchResults([]);
        })
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleMovieClick = (movie) => {
    if (!movie) return;
    const embedUrl = getYouTubeEmbedUrl(movie.trailer_link);
    setSelectedMovie(movie);
    setShowTrailer(true);
    if (embedUrl) setTrailerUrl(embedUrl);
    else setTrailerUrl("");
    if (movie.id) addToWatchHistoryAPI(movie.id);
    else console.warn("Cannot add to history: Movie ID missing", movie);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerUrl("");
    setSelectedMovie(null);
  };

  useEffect(() => {
    const styles = `
      .error-message { color: red; }
      .trailer-modal {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); display: flex;
        justify-content: center; align-items: center; z-index: 1001;
      }
      .trailer-content {
        background: #181818; padding: 25px; border-radius: 12px;
        width: 85%; max-width: 900px; height: 75%; max-height: 650px;
        position: relative; display: flex; flex-direction: column;
        box-shadow: 0 5px 25px rgba(0,0,0,0.5);
        border: 1px solid rgba(255, 59, 63, 0.3);
        color: #e0e0e0;
      }
      .trailer-content h2 { color: #ff3b3f; margin-bottom: 15px; text-align: center;}
      .trailer-content iframe { border: none; margin-bottom: 15px; flex-grow: 1;}
      .trailer-content p { text-align: center; margin-bottom: 15px; }
      .trailer-content button {
        border: none; padding: 10px 20px; border-radius: 8px;
        cursor: pointer; font-size: 1em; margin-top: 10px;
        transition: background 0.3s ease, transform 0.2s ease;
        align-self: center;
      }
      .trailer-content button:hover { transform: translateY(-2px); filter: brightness(1.1); }
      .add-bookmark-button {
        background: linear-gradient(45deg, #1e90ff, #4169e1);
        color: white;
      }
      .close-btn {
        position: absolute; top: 15px; right: 15px; background: none;
        border: none; color: white; font-size: 28px; cursor: pointer;
        line-height: 1; padding: 0; margin: 0;
      }
      .close-btn:hover { color: #ff3b3f; }
    `;
    const styleId = "movies-styles";
    let styleSheet = document.getElementById(styleId);
    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

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
      {loading && <p style={{ color: "white" }}>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="movies-list">
        {!loading &&
          !error &&
          searchResults.length > 0 &&
          searchResults.map((movie) => (
            <div
              key={movie._id || movie.id}
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.poster_path}
                alt={movie.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/200x300/1a1a1a/FFF?text=No+Image";
                }}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        {!loading && !error && searchResults.length === 0 && searchTerm.length > 0 && (
          <p style={{ color: "grey" }}>No movies found matching "{searchTerm}".</p>
        )}
        {!loading && !error && searchResults.length === 0 && searchTerm.length === 0 && (
          <p style={{ color: "grey" }}>Start typing to search for a movie.</p>
        )}
      </div>
      {showTrailer && selectedMovie && (
        <div className="trailer-modal" onClick={closeTrailer}>
          <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            {trailerUrl ? (
              <iframe
                src={trailerUrl}
                title="Movie Trailer"
                width="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>No trailer available for this movie.</p>
            )}
            <button
              className="add-bookmark-button"
              onClick={() => addBookmarkAPI(selectedMovie)}
            >
              🔖 Add to Bookmarks
            </button>
            <button className="close-btn" onClick={closeTrailer}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;