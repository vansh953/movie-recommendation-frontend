import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import '../style/Movies.css';

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
        const token = localStorage.getItem('authToken');
        if (!token) return;
        await axios.post(`${API_BASE_URL}/api/user/history`, { movieId }, { headers: { 'Authorization': `Bearer ${token}` } });
    } catch {}
};

function Recommended({ userId }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        if (!userId) {
            setError("User ID is missing.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }
        if (!API_BASE_URL) {
            setError("API URL configuration missing.");
            setLoading(false);
            return;
        }
        axios.get(`${API_BASE_URL}/api/recommendations/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(response => {
                if (response.data && Array.isArray(response.data.recommendedMoviesData)) setRecommendations(response.data.recommendedMoviesData);
                else {
                    setRecommendations([]);
                    setError("Received invalid recommendations format from server.");
                }
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    setError("No recommendations found yet. Keep interacting with movies!");
                    setRecommendations([]);
                } else setError("Failed to load recommendations. Please try again later.");
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
        }
        .error-message { color: red; }
        .trailer-modal {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.85); display: flex;
          justify-content: center; align-items: center; z-index: 1001;
        }
        .trailer-content {
          background: #181818; padding: 20px; border-radius: 10px;
          width: 80%; max-width: 900px; height: 70%; max-height: 600px;
          position: relative; display: flex; flex-direction: column;
          box-shadow: 0 5px 25px rgba(0,0,0,0.5);
          border: 1px solid rgba(255, 59, 63, 0.3);
        }
        .trailer-content h2 { color: #ff3b3f; margin-bottom: 15px; }
        .trailer-content .close-btn {
          position: absolute; top: 10px; right: 10px; background: none;
          border: none; color: white; font-size: 24px; cursor: pointer;
        }
        `;
        const styleSheet = document.getElementById('recommendations-styles');
        if (!styleSheet) {
            const newStyleSheet = document.createElement("style");
            newStyleSheet.id = 'recommendations-styles';
            newStyleSheet.type = "text/css";
            newStyleSheet.innerText = styles;
            document.head.appendChild(newStyleSheet);
        }
    }, []);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        if (movie.id) addToWatchHistoryAPI(movie.id);
    };

    const handleCloseModal = () => setSelectedMovie(null);

    if (loading) return <div className="recommendations-page"><h1>⭐ Recommended Movies</h1><p>Loading recommendations...</p></div>;
    if (error) return <div className="recommendations-page"><h1>⭐ Recommended Movies</h1><p className="error-message">{error}</p></div>;

    return (
        <div className="recommendations-page movies-page">
            <h1>⭐ Recommended Movies</h1>
            {recommendations.length === 0 ? (
                <p>No recommendations available yet. Watch some trailers or bookmark movies!</p>
            ) : (
                <div className="movies-list">
                    {recommendations.map(movie => (
                        <div key={movie.id || movie.imdb_id || movie.title} className="movie-card" onClick={() => handleMovieClick(movie)}>
                            <img src={movie.poster_path} alt={movie.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/111/FFF?text=No+Image'; }} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                </div>
            )}
            {selectedMovie && (
                <div className="trailer-modal" onClick={handleCloseModal}>
                    <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedMovie.title}</h2>
                        {getYouTubeEmbedUrl(selectedMovie.trailer_link) ? (
                            <iframe
                                src={getYouTubeEmbedUrl(selectedMovie.trailer_link)}
                                title={`${selectedMovie.title} Trailer`}
                                width="100%"
                                height="80%"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ border: 'none', marginBottom: '10px' }}
                            ></iframe>
                        ) : <p>No trailer available.</p>}
                        <button className="close-btn" onClick={handleCloseModal}>✖ Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Recommended;
