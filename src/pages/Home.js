import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Home.css"; 

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className="background-container"></div>
            <div className="overlay"></div>

            <div
                style={{
                    position: "fixed",
                    top: "20px",
                    right: "5%",
                    display: "flex",
                    gap: "10px",
                    zIndex: 20,
                }}
            >
                <button
                    className="signin-btn"
                    onClick={() => navigate("/signin")}
                >
                    Sign In
                </button>
                <button
                    className="signup-btn"
                    onClick={() => navigate("/signup")}
                >
                    Sign Up
                </button>
            </div>

            <div className="hero-section" style={{ zIndex: 15, position: "relative" }}>
                <h1 style={{ fontSize: "4rem", fontWeight: "900", textShadow: "3px 3px 8px rgba(0,0,0,0.7)" }}>
                    <span style={{ color: "#00e0b7" }}>Movie</span>
                    <span style={{ color: "#fff" }}>Verse</span>
                </h1>

                <h2 style={{
                    whiteSpace: "nowrap",
                    fontSize: "2rem",
                    fontWeight: "700",
                    textShadow: "2px 2px 5px rgba(0,0,0,0.6)"
                }}>
                    Unlimited <span style={{ color: "#00e0b7" }}>Movies</span>, <span style={{ color: "#00e0b7" }}>TV Shows</span>, and More.
                </h2>

                <p style={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    margin: "20px 0",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.6)"
                }}>
                    Watch anywhere. Cancel anytime. Your entertainment, your way.
                </p>

                <button
                    className="cta-button"
                    onClick={() => navigate("/signup")}
                    style={{ fontSize: "1.3rem", padding: "18px 40px" }}
                >
                    Get Started
                </button>
            </div>
        </>
    );
}

export default Home;