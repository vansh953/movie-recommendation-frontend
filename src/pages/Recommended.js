import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Movies.css'; 

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
        return "";
    }
}

const addToWatchHistoryAPI = async (movieId) => {
    if (!movieId) return;
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        await axios.post(`${API_BASE_URL}/api/user/history`,
            { movieId }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
    } catch (error) {}
};

function Recommended({ userId, selectedLanguage, selectedGenre }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null); 

    useEffect(() => {
        if (!userId) {
            setError("User ID missing.");
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error("Auth token missing");

                const response = await axios.post(
                    `${API_BASE_URL}/api/recommendations/${userId}`,
                    { 
                        language: selectedLanguage || null,
                        genre: selectedGenre || null
                    },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (response.data && Array.isArray(response.data.recommendedMoviesData)) {
                    setRecommendations(response.data.recommendedMoviesData);
                } else {
                    setRecommendations([]);
                    setError("Invalid recommendation data from server.");
                }
            } catch (err) {
                setRecommendations([]);
                setError("Failed to load recommendations. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [userId, selectedLanguage, selectedGenre]);

    useEffect(() => {
        const styles = `
        .recommendations-page {
          padding: 20px;
          padding-top: 80px;
          color: white;
          background-color: #0d0d0d;
          min-height: 100vh;
        }
        .recommendations-page h1 {
            color: #ff3b3f;
            margin-bottom: 20px;
        }
        .error-message {
            color: red;
        }
        .movies-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
        }
        .movie-card {
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            background-color: #1a1a1a;
            box-shadow: 0 4px 12px rgba(255, 59, 63, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .movie-card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 24px rgba(255, 59, 63, 0.35);
        }
        .movie-card img {
            width: 100%;
            height: 260px;
            object-fit: cover;
            display: block;
        }
        .movie-card h3 {
            margin: 10px 0;
            color: #fff;
            font-size: 1em;
            text-align: center;
        }
        .trailer-modal {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.85); display: flex;
          justify-content: center; align-items: center; z-index: 1001;
        }
        .trailer-content {
          background: #181818; padding: 20px; border-radius: 12px;
          width: 90%; max-width: 900px; height: 80%; max-height: 650px;
          position: relative; display: flex; flex-direction: column;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255, 59, 63, 0.3);
        }
        .trailer-content h2 { color: #ff3b3f; margin-bottom: 15px; text-align:center; }
        .trailer-content iframe { flex: 1; border: none; }
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
                    {recommendations.map((movie) => (
                        <div
                            key={movie.id || movie.imdb_id || movie.title}
                            className="movie-card"
                            onClick={() => handleMovieClick(movie)}
                        >
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
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
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
