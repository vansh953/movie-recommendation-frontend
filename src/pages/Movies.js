import React, { useState, useEffect } from "react";
import "../style/Movies.css";

function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data);
        setFeatured(data.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    setFilteredMovies(
      movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, movies]);

  const handleMovieClick = (trailer) => {
    setTrailerUrl(trailer);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerUrl("");
  };

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

      <h2>🌟 Featured</h2>
      <div className="featured-scroll">
        {featured.map((movie) => (
          <div
            key={movie.id}
            className="featured-card"
            onClick={() => handleMovieClick(movie.trailer)}
          >
            <img src={movie.poster} alt={movie.title} />
            <h4>{movie.title}</h4>
          </div>
        ))}
      </div>

      <h2>All Movies</h2>
      <div className="movies-list">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => handleMovieClick(movie.trailer)}
            >
              <img src={movie.poster} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>No movies found. (Please ensure your API is running and returning data.)</p>
        )}
      </div>

      {showTrailer && (
        <div className="trailer-modal" onClick={closeTrailer}>
          <div className="trailer-content" onClick={e => e.stopPropagation()}>
            <iframe
              src={trailerUrl}
              title="Movie Trailer"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="close-btn" onClick={closeTrailer}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;