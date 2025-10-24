import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Bookmark.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    axios
      .get(`${API_BASE_URL}/api/user/bookmark`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookmarks(res.data || []))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bookmark-page">
      <h1>Bookmarked Movies</h1>
      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="movies-list">
          {bookmarks.map((movie) => (
            <div key={movie.id || movie.title} className="movie-card">
              <img
                src={movie.poster_path}
                alt={movie.title}
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/200x300/111/FFF?text=No+Image")
                }
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmark;
