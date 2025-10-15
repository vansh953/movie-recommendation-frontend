import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="header">
            <button className="signin-btn" onClick={() => navigate('/signin')}>Sign In</button>
            <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
    );
}

export default Navbar;

