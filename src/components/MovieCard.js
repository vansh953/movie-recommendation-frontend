import React from "react";

function MovieCard({ title, poster }) {
    return (
        <div style={{ width: "200px", textAlign: "center" }}>
            <img src={poster} alt={title} style={{ width: "100%", borderRadius: "8px" }} />
            <h3>{title}</h3>
        </div>
    );
}

export default MovieCard;