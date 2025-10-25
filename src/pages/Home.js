import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Home.css"; 

function Home() {
    const navigate = useNavigate();

    const messages = [
        "Unlimited Movies.",
        "Unlimited TV Shows.",
        "Unlimited Entertainment.",
        "Watch Anywhere, Anytime.",
        "Cancel Anytime.",
        "Your Entertainment, Your Way."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
                setFade(true);
            }, 300); // faster fade-out
        }, 2000); // faster transition between sentences
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="background-container"></div>
            <div className="overlay"></div>

            <div className="header">
                <button className="signin-btn" onClick={() => navigate("/signin")}>
                    Sign In
                </button>
                <button className="signup-btn" onClick={() => navigate("/signup")}>
                    Sign Up
                </button>
            </div>

            <div className="hero-section">
                <h1 className="hero-text">
                    <span className="highlight">FLIX</span>
                </h1>

                <h2 className={`hero-message ${fade ? "fade-in" : "fade-out"}`}>
                    {messages[currentMessageIndex]}
                </h2>

                <button className="cta-button" onClick={() => navigate("/signup")}>
                    Get Started
                </button>
            </div>
        </>
    );
}

export default Home;