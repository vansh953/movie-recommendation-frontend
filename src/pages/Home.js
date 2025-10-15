import React from "react";
import Navbar from "../components/Navbar";

function Home() {
    return (
        <>
            <div className="background-container"></div>
            <div className="overlay"></div>

            <Navbar />

            <div className="hero-section">
                <h1>Unlimited Movies, TV Shows, and More.</h1>
                <h2>Watch Anywhere. Cancel Anytime.</h2>
                <p>Ready to watch? Click below to get started.</p>
                <button className="cta-button">Get Started</button>
            </div>
        </>
    );
}

export default Home;