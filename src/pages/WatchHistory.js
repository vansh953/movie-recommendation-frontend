import React, { useEffect, useState } from "react";
import axios from "axios";
//import "../style/Movies.css";

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

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to view watch history.");
      setLoading(false);
      return;
    }
    if (!API_BASE_URL) {
        setError("Configuration Error: API URL not set.");
        setLoading(false);
        return;
    }
    axios.get(`${API_BASE_URL}/api/user/history`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        setHistory(response.data || []);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load watch history. Please try again.");
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const styles = `
    .watch-history-page { width: 100%; min-height: calc(100vh - 70px); padding-top: 70px; padding: 20px; box-sizing: border-box; background-color: #0d0d0d; }
    .history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
    .history-movie-card { height: 225px; cursor: pointer; border-radius: 8px; overflow: hidden; position: relative; box-shadow: 0 4px 10px rgba(255, 59, 63, 0.15); background-color: #1a1a1a; transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .history-movie-card:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(255, 59, 63, 0.3); }
    .history-title-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0)); color: #fff; text-align: center; font-size: 0.9em; }
    .history-title-overlay h3 { margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .movie-detail-container-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; padding-top: 70px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; background-color: rgba(13, 13, 13, 0.85); overflow: hidden; z-index: 1000; padding: 20px; }
    .movie-detail-card { width: 90%; max-width: 1200px; height: 80%; max-height: 700px; display: flex; background: #181818; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 59, 63, 0.3); }
    .movie-detail-image-container { flex: 0 0 40%; background: #000; overflow: hidden; }
    .movie-detail-info-container { flex: 1; padding: 30px 40px; display: flex; flex-direction: column; justify-content: center; color: #e0e0e0; overflow-y: auto; }
    .close-detail-button { background: linear-gradient(45deg, #ff3b3f, #ff6b6b); border: none; color: #fff; padding: 10px 25px; border-radius: 8px; font-size: 1em; cursor: pointer; transition: background 0.3s ease, transform 0.2s ease; align-self: flex-start; margin-top: 20px; }
    .close-detail-button:hover { background: linear-gradient(45deg, #ff6b6b, #ff3b3f); transform: translateY(-2px); }
    `;
    const styleSheet = document.getElementById('watch-history-styles');
    if (!styleSheet) {
        const newStyleSheet = document.createElement("style");
        newStyleSheet.id = 'watch-history-styles';
        newStyleSheet.type = "text/css";
        newStyleSheet.innerText = styles;
        document.head.appendChild(newStyleSheet);
    }
  }, []);

  const handleClose = () => setSelectedMovie(null);

  if (selectedMovie) {
    const trailerEmbedUrl = getYouTubeEmbedUrl(selectedMovie.trailer_link);
    return (
      <div className="movie-detail-container-overlay">
        <div className="movie-detail-card">
          <div className="movie-detail-image-container">
             <img src={selectedMovie.poster_path} alt={selectedMovie.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="movie-detail-info-container">
             <h2 style={{ fontSize: "2.5em", color: "#ff3b3f", marginBottom: "20px" }}>{selectedMovie.title}</h2>
             <p style={{ fontSize: "1.2em", lineHeight: "1.6", marginBottom: "30px", maxHeight: '200px', overflowY: 'auto' }}>{selectedMovie.description || "No description available."}</p>
             {trailerEmbedUrl && (
                 <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "15px", backgroundColor: '#000' }}>
                   <iframe
                     src={trailerEmbedUrl}
                     title={selectedMovie.title}
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                   ></iframe>
                 </div>
             )}
            <button className="close-detail-button" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="watch-history-page"><h2 style={{ color: "#ff3b3f", marginBottom: "20px" }}>Watch History</h2><p style={{ color: "#fff" }}>Loading history...</p></div>;
  if (error) return <div className="watch-history-page"><h2 style={{ color: "#ff3b3f", marginBottom: "20px" }}>Watch History</h2><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="watch-history-page">
      <h2 style={{ color: "#ff3b3f", marginBottom: "20px" }}>Watch History</h2>
      {history.length === 0 ? <p style={{ color: "#fff" }}>No movies watched yet!</p> :
        <div className="history-grid">
          {history.map(movie => (
            <div key={movie._id || movie.id} className="history-movie-card" onClick={() => setSelectedMovie(movie)}>
              <img src={movie.poster_path} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
              <div className="history-title-overlay"><h3 style={{ margin: 0, fontSize: "1.1em" }}>{movie.title}</h3></div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default WatchHistory;
