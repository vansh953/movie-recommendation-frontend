import React, { useEffect, useState } from "react";

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("watchHistory")) || [];
    const uniqueHistory = [];
    storedHistory.forEach((movie) => {
      const existingIndex = uniqueHistory.findIndex(m => m.title === movie.title);
      if (existingIndex !== -1) {
        uniqueHistory.splice(existingIndex, 1);
      }
      uniqueHistory.push(movie);
    });
    setHistory(uniqueHistory.reverse());
  }, []);

  const handleClose = () => {
    setSelectedMovie(null);
    setShowTrailer(false);
  };

  if (selectedMovie) {
    return (
      <div style={{
        width: "100vw",
        height: "calc(100vh - 70px)",
        paddingTop: "70px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#0d0d0d",
        overflow: "hidden"
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#111",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 30px rgba(255, 59, 63, 0.35)"
        }}>
          <div style={{
            flex: 1,
            background: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <img src={selectedMovie.cover} alt={selectedMovie.title} style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }} />
          </div>
          <div style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#fff"
          }}>
            <h2 style={{ fontSize: "2.5em", color: "#ff3b3f", marginBottom: "20px" }}>{selectedMovie.title}</h2>
            <p style={{ fontSize: "1.2em", lineHeight: "1.6", marginBottom: "30px" }}>{selectedMovie.longDesc}</p>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "15px" }}>
              <iframe
                src={selectedMovie.trailer}
                title={selectedMovie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              ></iframe>
            </div>
            <button style={{
              background: "linear-gradient(45deg, #ff3b3f, #ff6b6b)",
              border: "none",
              color: "#fff",
              padding: "12px 30px",
              borderRadius: "10px",
              fontSize: "1.1em",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: "100vw",
      minHeight: "calc(100vh - 70px)",
      paddingTop: "70px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0d0d0d"
    }}>
      <h2 style={{ color: "#ff3b3f", marginBottom: "20px" }}>Watch History</h2>
      {history.length === 0 ? (
        <p style={{ color: "#fff" }}>No movies watched yet!</p>
      ) : (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "flex-start"
        }}>
          {history.map((movie, idx) => (
            <div
              key={idx}
              style={{
                width: "250px",
                height: "350px",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 0 15px rgba(255,59,63,0.3)",
                backgroundColor: "#000"
              }}
              onClick={() => { setSelectedMovie(movie); setShowTrailer(true); }}
            >
              <img
                src={movie.cover}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "70%",
                  objectFit: "cover"
                }}
              />
              <div style={{
                padding: "10px",
                textAlign: "center",
                background: "rgba(0,0,0,0.6)",
                color: "#fff"
              }}>
                <h3 style={{ margin: 0, fontSize: "1.1em" }}>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchHistory;

