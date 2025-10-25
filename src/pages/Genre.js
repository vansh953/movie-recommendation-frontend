import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import "../style/Select.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const INTERESTS_API_URL = `${API_BASE_URL}/api/user/interests`;

const genres = [
    { name: "Comedy", colorClass: "comedy" },
    { name: "Romance", colorClass: "love" },
    { name: "Mystery", colorClass: "mystery" },
    { name: "Action", colorClass: "action" },
    { name: "Horror", colorClass: "horror" },
    { name: "Thriller", colorClass: "thriller" },
    { name: "Fantasy", colorClass: "fantasy" },
    { name: "Adventure", colorClass: "adventure" },
    { name: "Drama", colorClass: "drama" },
    { name: "Science Fiction", colorClass: "scifi" },
    { name: "Musical", colorClass: "musical" },
    { name: "Animation", colorClass: "animation" },
    { name: "Biography", colorClass: "biography" },
    { name: "Documentary", colorClass: "documentary" },
];

function Genre({ onNext }) {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const selectedLanguage = location.state?.selectedLanguage;

    const toggleGenre = (genreName) => {
        setError('');
        setSelectedGenres(prevSelected =>
            prevSelected.includes(genreName)
                ? prevSelected.filter(g => g !== genreName)
                : [...prevSelected, genreName]
        );
    };

    const handleNext = async () => {
        if (!selectedLanguage) {
            setError("Preferred language was not selected. Please go back to the previous step.");
            return;
        }
        if (selectedGenres.length === 0) {
            setError("Please select at least one genre.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Authentication error. Please log in again.");
                setLoading(false);
                navigate('/signin');
                return;
            }
            if (!API_BASE_URL) {
                setError("API URL configuration error.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                INTERESTS_API_URL,
                {
                    genres: selectedGenres,
                    preferredLanguage: selectedLanguage
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            onNext(selectedGenres);
            navigate("/home");

        } catch (err) {
            setError(err.response?.data?.msg || "Failed to save preferences. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="selection-container">
            <h1 className="title">Choose your favourite genre(s)</h1>
            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
            <p style={{ color: 'grey', textAlign: 'center', marginBottom: '20px' }}>
                Selected Language: {selectedLanguage || "None (Please go back)"}
            </p>
            <div className="grid">
                {genres.map((genre) => (
                    <button
                        key={genre.name}
                        className={`card ${genre.colorClass} ${selectedGenres.includes(genre.name) ? "selected" : ""}`}
                        onClick={() => toggleGenre(genre.name)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
            <button
                className="next-button"
                onClick={handleNext}
                disabled={selectedGenres.length === 0 || loading || !selectedLanguage}
            >
                {loading ? "Saving..." : "Finish"}
            </button>
        </div>
    );
}

export default Genre;

