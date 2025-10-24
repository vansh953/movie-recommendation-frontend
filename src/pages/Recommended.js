import React, { useEffect, useState } from "react";

function Recommended() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/recommended", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendedMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <div className="recommended-page">
      <style>{`
        .recommended-page {
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #121212;
          color: #fff;
          min-height: 100vh;
        }
        .recommended-page h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
        }
        .movie-card {
          background-color: #1c1c1c;
          border-radius: 8px;
          overflow: hidden;
          text-align: center;
          transition: transform 0.2s;
          cursor: pointer;
        }
        .movie-card:hover {
          transform: scale(1.05);
        }
        .movie-card img {
          width: 100%;
          height: auto;
        }
        .movie-info {
          padding: 10px;
        }
        .movie-info h3 {
          margin: 5px 0;
          font-size: 16px;
        }
        .movie-info p {
          margin: 0;
          color: #aaa;
          font-size: 14px;
        }
        .loading, .error {
          text-align: center;
          margin-top: 50px;
          font-size: 18px;
        }
        .error {
          color: red;
        }
      `}</style>

      {loading ? (
        <p className="loading">Loading recommendations...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h1>⭐ Recommended for You</h1>
          <div className="movies-grid">
            {recommendedMovies.length > 0 ? (
              recommendedMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <img src={movie.poster} alt={movie.title} />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.year}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No recommendations available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Recommended;

