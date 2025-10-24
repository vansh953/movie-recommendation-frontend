import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/WatchHistory.css";

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

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchHistory = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }
    axios.get(`${API_BASE_URL}/api/user/history`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setHistory(res.data || []))
      .catch(() => { setError("Failed to load history."); setHistory([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
    window.addEventListener("watchHistoryUpdated", fetchHistory);
    return () => window.removeEventListener("watchHistoryUpdated", fetchHistory);
  }, []);

  const handleClose = () => setSelectedMovie(null);

  if (selectedMovie) {
    const trailerEmbedUrl = getYouTubeEmbedUrl(selectedMovie.trailer_link);
    return (
      <div className="history-overlay">
        <div className="history-detail-card">
          <div className="history-image"><img src={selectedMovie.poster_path} alt={selectedMovie.title} /></div>
          <div className="history-info">
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.description || "No description available."}</p>
            {trailerEmbedUrl && <div className="trailer-wrapper"><iframe src={trailerEmbedUrl} title={selectedMovie.title} allowFullScreen></iframe></div>}
            <button onClick={handleClose} className="close-btn-detail">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="watch-history-page"><p>Loading history...</p></div>;
  if (error) return <div className="watch-history-page"><p className="error">{error}</p></div>;

  return (
    <div className="watch-history-page">
      <h2>Watch History</h2>
      {history.length === 0 ? <p>No movies watched yet!</p> :
        <div className="history-grid">
          {history.map((movie) => (
            <div key={movie._id || movie.id} className="history-movie-card" onClick={() => setSelectedMovie(movie)}>
              <img src={movie.poster_path} alt={movie.title} />
              <div className="history-title-overlay"><h3>{movie.title}</h3></div>
            </div>
          ))}
        </div>}
    </div>
  );
}

export default WatchHistory;
