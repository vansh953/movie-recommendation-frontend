import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SIGNUP_API_URL = `${API_BASE_URL}/api/auth/signup`;
const GOOGLE_AUTH_URL = `${API_BASE_URL}/api/auth/google`; 

function SignUp({ onLogin }) { 
    const navigate = useNavigate(); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    
    const [loading, setLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState("");

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => 
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiMessage("");

        let tempErrors = {};

        if (!name) tempErrors.name = "Full name is required.";
        if (!email) tempErrors.email = "Email is required.";
        else if (!validateEmail(email)) tempErrors.email = "Invalid email address.";

        if (!password) tempErrors.password = "Password is required.";
        else if (!validatePassword(password))
            tempErrors.password = "Password must be 8+ chars...";

        if (!confirmPassword) tempErrors.confirmPassword = "Confirm your password.";
        else if (password !== confirmPassword) tempErrors.confirmPassword = "Passwords do not match.";

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {
            if (!API_BASE_URL) {
                setApiMessage("❌ Configuration Error: API URL not set.");
                return;
            }
            
            setLoading(true);

            try {
                await axios.post(SIGNUP_API_URL, {
                    name,
                    email,
                    password
                });
                
                setApiMessage("✅ Sign Up Successful! Redirecting to login...");
                
                setTimeout(() => {
                    navigate("/signin");
                }, 2000); 

            } catch (error) {
                const errorMessage = error.response?.data?.message 
                                     || "Sign Up failed. Please check your network and try again.";
                setApiMessage(`❌ ${errorMessage}`);

            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <>
            <div className="background-container"></div>
            <div className="login-container">
                <div className="login-card">
                    <div className="welcome-text">Sign Up</div>
                    <form onSubmit={handleSubmit}>
                        
                        {apiMessage && (
                            <div style={{ 
                                color: apiMessage.startsWith("✅") ? "green" : "red", 
                                textAlign: "center", 
                                marginBottom: "10px",
                                fontWeight: "bold"
                            }}>
                                {apiMessage}
                            </div>
                        )}

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

                        <button 
                            type="submit" 
                            className="btn sign-in-btn"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"} 
                        </button>
                    </form>

                    <div className="or-separator">OR</div>

                    <a 
                        href={GOOGLE_AUTH_URL} 
                        className="btn google-btn" 
                        style={{ 
                            textDecoration: 'none', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            opacity: loading ? 0.5 : 1,
                            pointerEvents: loading ? 'none' : 'auto'
                        }}
                    >
                     
                        <span className="google-icon" style={{ marginRight: '8px' }}>G</span> Sign up with Google
                    </a>


                    <div className="signup-prompt">
                        Already have an account? <Link to="/signin" className="signup-link">Sign In</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;