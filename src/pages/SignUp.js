import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";

function SignUp() {
    const navigate = useNavigate(); // <-- For redirect
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => 
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    const handleSubmit = (e) => {
        e.preventDefault();
        let tempErrors = {};

        if (!name) tempErrors.name = "Full name is required.";
        if (!email) tempErrors.email = "Email is required.";
        else if (!validateEmail(email)) tempErrors.email = "Invalid email address.";

        if (!password) tempErrors.password = "Password is required.";
        else if (!validatePassword(password))
            tempErrors.password = "Password must be 8+ chars, with uppercase, lowercase, number & symbol.";

        if (!confirmPassword) tempErrors.confirmPassword = "Confirm your password.";
        else if (password !== confirmPassword) tempErrors.confirmPassword = "Passwords do not match.";

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {
            alert("Sign Up Successful! Please login.");
            navigate("/signin"); // <-- Redirect to login page
        }
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="login-container">
                <div className="login-card">
                    <div className="welcome-text">Sign Up</div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <span className="icon">👤</span>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
                        </div>

                        <div className="input-group">
                            <span className="icon">📧</span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                        </div>

                        <div className="input-group">
                            <span className="icon">🔒</span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
                        </div>

                        <div className="input-group">
                            <span className="icon">🔒</span>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && (
                                <small style={{ color: "red" }}>{errors.confirmPassword}</small>
                            )}
                        </div>

                        <button type="submit" className="btn sign-in-btn">
                            Sign Up
                        </button>
                    </form>

                    <div className="or-separator">OR</div>

                    <button className="btn google-btn">
                        <span className="google-icon">🟢</span> Sign up with Google
                    </button>

                    <div className="signup-prompt">
                        Already have an account? <Link to="/signin" className="signup-link">Sign In</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;
