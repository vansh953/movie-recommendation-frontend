import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";
import bgImage from "../assets/bg.jpg"; 

const messages = [
    "Unlimited Movies.",
    "Unlimited TV Shows.",
    "Unlimited Entertainment.",
    "Watch Anywhere, Anytime.",
    "Cancel Anytime.",
    "Your Entertainment, Your Way."
];

const Home = () => {
    const navigate = useNavigate();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [showCTA, setShowCTA] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
                setFade(true);
            }, 300);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowCTA(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSignIn = () => navigate("/signin");
    const handleSignUp = () => navigate("/signup");

    const messageClass = fade ? "fade-in-slide" : "fade-out-slide";
    const ctaClass = showCTA ? "fade-up-cta" : "hidden-cta";

    return (
        <div id="flix-app">
            <div
                className="background-container"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="overlay"></div>

            <header className="header">
                <div className="logo">
                    FLI<span>X</span>
                </div>
                <div className="header-buttons">
                    <button className="signin-btn" onClick={handleSignIn}>
                        Sign In
                    </button>
                    <button className="signup-btn" onClick={handleSignUp}>
                        Sign Up
                    </button>
                </div>
            </header>

            <main className="hero-section">
                <h1 className="hero-text">
                    Your Entertainment <br />
                    <span className="highlight">Unlimited</span>
                </h1>

                <h2 className={`hero-message ${messageClass}`}>
                    {messages[currentMessageIndex]}
                </h2>

                <button
                    className={`cta-button ${ctaClass}`}
                    onClick={handleSignUp}
                >
                    Get Started
                </button>
            </main>
        </div>
    );
};

export default Home;
