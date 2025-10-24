import React from "react";
import "../style/WatchHistory.css";

function WatchHistory() {
  return (
    <div className="watch-history-container">
      <h1 className="watch-history-title">📜 Watch History</h1>
      <p className="watch-history-desc">
        Here you can view all the movies and shows you’ve watched recently.
      </p>

      <div className="history-list">
        <div className="history-item">
          <img src="https://via.placeholder.com/150" alt="Movie Poster" />
          <div>
            <h3>Movie Title 1</h3>
            <p>Watched on: 20 Oct 2025</p>
          </div>
        </div>

        <div className="history-item">
          <img src="https://via.placeholder.com/150" alt="Movie Poster" />
          <div>
            <h3>Movie Title 2</h3>
            <p>Watched on: 15 Oct 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
