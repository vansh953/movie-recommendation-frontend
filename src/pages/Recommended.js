import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Movies.css'; // Reuse styles from Movies.css or create a new one

// Get the base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Utility function for YouTube embed URL (can be moved to a separate utils file)
function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    try {
        const videoUrl = new URL(url);
        const videoId = videoUrl.searchParams.get("v");
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        // Handle cases where the link might already be an embed link or other format
        if (url.includes("youtube.com/embed/")) {
            return url;
        }
        return url; // Fallback
    } catch (error) {
        console.error("Invalid trailer URL:", error);
        return "";
    }
}

// Helper function to add movie to watch history via API
// (Copied from Movies.js - ideally move this to a separate api service file)
const addToWatchHistoryAPI = async (movieId) => {
    if (!movieId) return;
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Cannot add to history: No auth token found.");
            return;
        }
        await axios.post(`${API_BASE_URL}/api/user/history`,
            { movieId: movieId }, // Send the external numeric ID
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        console.log(`Added movie ID ${movieId} to watch history via API.`);
    } catch (error) {
        console.error("Failed to add movie to watch history via API:", error.response?.data?.msg || error.message);
    }
};


function Recommended({ userId }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null); // For modal

    // --- Effect to Fetch Recommendations ---
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

        axios.get(`${API_BASE_URL}/api/recommendations/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // The actual movie data is inside the recommendedMoviesData array
            if (response.data && Array.isArray(response.data.recommendedMoviesData)) {
                setRecommendations(response.data.recommendedMoviesData);
            } else {
                console.error("Invalid recommendations format:", response.data);
                setRecommendations([]); // Set to empty array if format is wrong
                setError("Received invalid recommendations format from server.");
            }
        })
        .catch(err => {
            console.error("Error fetching recommendations:", err.response || err);
            if (err.response?.status === 404) {
                 setError("No recommendations found yet. Keep interacting with movies!");
                 setRecommendations([]); // Ensure it's empty on 404
            } else {
                 setError("Failed to load recommendations. Please try again later.");
            }
        })
        .finally(() => {
            setLoading(false);
        });

    }, [userId]); // Re-fetch if userId changes

    // --- Effect to Inject Styles ---
    // MOVED INSIDE the Recommended component
    useEffect(() => {
        const styles = `
        .recommendations-page {
          padding: 20px;
          padding-top: 80px; /* Adjust based on navbar height */
          color: white;
          background-color: #0d0d0d;
          min-height: calc(100vh - 70px);
        }
        .recommendations-page h1 {
            color: #ff3b3f; /* Theme color */
            margin-bottom: 20px;
        }
        .error-message {
            color: red;
        }
        /* Reuse .movies-list and .movie-card from Movies.css */

        /* Ensure modal styles from Movies.css are available or copied here */
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
         // Optional cleanup
        return () => {
             const existingStyleSheet = document.getElementById('recommendations-styles');
             // if (existingStyleSheet) document.head.removeChild(existingStyleSheet);
         };
    }, []); // Run only once on mount

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        // Add to watch history when trailer is opened
        if (movie.id) {
            addToWatchHistoryAPI(movie.id);
        }
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div className="recommendations-page">
                <h1>⭐ Recommended Movies</h1>
                <p>Loading recommendations...</p>
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
        <div className="recommendations-page movies-page"> {/* Reuse movies-page class */}
            <h1>⭐ Recommended Movies</h1>

            {recommendations.length === 0 ? (
                <p>No recommendations available yet. Watch some trailers or bookmark movies!</p>
            ) : (
                <div className="movies-list"> {/* Reuse movies-list class */}
                    {recommendations.map((movie) => (
                        <div
                            // Use movie.id (external ID) as key if available, otherwise fallback
                            key={movie.id || movie.imdb_id || movie.title}
                            className="movie-card" // Reuse movie-card class
                            onClick={() => handleMovieClick(movie)}
                        >
                            <img src={movie.poster_path} alt={movie.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/111/FFF?text=No+Image'; }} />
                            <h3>{movie.title}</h3>
                            {/* Optional: Display similarity score */}
                            {/* <p>Similarity: {movie.similarity?.toFixed(2)}</p> */}
                        </div>
                    ))}
                </div>
            )}

            {/* Movie Detail Modal */}
            {selectedMovie && (
                <div className="trailer-modal" onClick={handleCloseModal}>
                    <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedMovie.title}</h2>
                        {/* Display other details if needed */}
                        {/* <p>Genres: {selectedMovie.genres}</p> */}
                        {/* <p>Rating: {selectedMovie.vote_average?.toFixed(1)} ({selectedMovie.vote_count} votes)</p> */}

                        {getYouTubeEmbedUrl(selectedMovie.trailer_link) ? (
                            <iframe
                                src={getYouTubeEmbedUrl(selectedMovie.trailer_link)}
                                title={`${selectedMovie.title} Trailer`}
                                width="100%"
                                height="80%" // Adjust height as needed
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ border: 'none', marginBottom: '10px' }}
                            ></iframe>
                        ) : (
                             <p>No trailer available.</p>
                        )}
                        <button className="close-btn" onClick={handleCloseModal}>✖ Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Recommended;