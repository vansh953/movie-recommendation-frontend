import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Recommended.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    try {
        const videoUrl = new URL(url);
        const videoId = videoUrl.searchParams.get("v");
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        if (url.includes("youtube.com/embed/")) return url;
        return url;
    } catch (error) {
        console.error("Invalid trailer URL:", error);
        return "";
    }
}

async function addToWatchHistory(movieId) {
    if (!movieId) return;
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        await axios.post(
            `${API_BASE_URL}/api/user/history`,
            { movieId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        window.dispatchEvent(new Event("watchHistoryUpdated"));
    } catch (err) {
        console.error("Failed to add to watch history:", err.response?.data?.msg || err.message);
    }
}

async function addBookmark(movieId) {
    if (!movieId) return;
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        await axios.post(
            `${API_BASE_URL}/api/user/bookmark`,
            { movieId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Movie bookmarked successfully!");
    } catch (err) {
        console.error("Failed to bookmark movie:", err.response?.data?.msg || err.message);
    }
}

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

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/api/recommendations/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.data && Array.isArray(response.data.recommendedMoviesData)) {
                setRecommendations(response.data.recommendedMoviesData);
            } else {
                setRecommendations([]);
                setError("Invalid recommendations data.");
            }
        })
        .catch(err => {
            if (err.response?.status === 404) {
                setError("No recommendations yet. Watch some trailers!");
                setRecommendations([]);
            } else {
                setError("Failed to load recommendations.");
            }
        })
        .finally(() => setLoading(false));
    }, [userId]);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        addToWatchHistory(movie.id);
    };

    const handleCloseModal = () => setSelectedMovie(null);

    if (loading) {
        return (
            <div className="recommended-page">
                <h1>⭐ Recommended Movies</h1>
                <p>Loading recommendations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommended-page">
                <h1>⭐ Recommended Movies</h1>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="recommended-page">
            <h1>⭐ Recommended Movies</h1>
            {recommendations.length === 0 ? (
                <p>No recommendations available yet. Watch some trailers!</p>
            ) : (
                <div className="movies-list">
                    {recommendations.map((movie) => (
                        <div key={movie.id || movie.imdb_id || movie.title} className="movie-card">
                            <img
                                src={movie.poster_path}
                                alt={movie.title}
                                onClick={() => handleMovieClick(movie)}
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/111/FFF?text=No+Image'; }}
                            />
                            <h3>{movie.title}</h3>
                            <button className="bookmark-btn" onClick={() => addBookmark(movie.id)}>🔖 Bookmark</button>
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

