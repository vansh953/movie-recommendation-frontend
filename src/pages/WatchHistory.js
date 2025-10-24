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

  const fetchHistory = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) { setError("Login required"); setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/history`, { headers: { Authorization: `Bearer ${token}` } });
      setHistory(res.data.reverse()); 
      setError(null);
    } catch {
      setError("Failed to load history"); setHistory([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchHistory();
    const listener = () => fetchHistory();
    window.addEventListener("watchHistoryUpdated", listener);
    return () => window.removeEventListener("watchHistoryUpdated", listener);
  }, []);

  const closeDetail = () => setSelectedMovie(null);

  if (loading) return <div className="watch-history-page"><h2>Watch History</h2><p>Loading...</p></div>;
  if (error) return <div className="watch-history-page"><h2>Watch History</h2><p>{error}</p></div>;

  if (selectedMovie) {
    const trailerUrl = getYouTubeEmbedUrl(selectedMovie.trailer_link);
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-card">
          <div className="movie-detail-image">
            <img src={selectedMovie.poster_path} alt={selectedMovie.title} />
          </div>
          <div className="movie-detail-info">
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.description || "No description available."}</p>
            {trailerUrl && <iframe src={trailerUrl} title={selectedMovie.title} frameBorder="0" allowFullScreen></iframe>}
            <button onClick={closeDetail}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-history-page">
      <h2>Watch History</h2>
      {history.length === 0 ? <p>No movies watched yet!</p> :
        <div className="history-grid">
          {history.map((movie) => (
            <div key={movie._id || movie.id} className="history-card" onClick={() => setSelectedMovie(movie)}>
              <img src={movie.poster_path} alt={movie.title} />
              <div className="history-title"><h3>{movie.title}</h3></div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default WatchHistory;
