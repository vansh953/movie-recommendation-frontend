import React from "react";
import "../style/NavbarHome.css";

function Home1() {
  const trending = [1,2,3,4,5,6]; 
  const movies = Array.from({ length: 20 }, (_, i) => i + 1); 

  return (
    <div className="home-container">
      <h2 className="section-title">Trending</h2>
      <div className="trending-grid">
        {trending.map((item) => (
          <div key={item} className="movie-card">
            <div className="movie-image">Movie {item}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Movies</h2>
      <div className="movies-grid">
        {movies.map((item) => (
          <div key={item} className="movie-card">
            <div className="movie-image">Movie {item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home1;
