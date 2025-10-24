import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/Auth.css";
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const LOGIN_API_URL = `${API_BASE_URL}/api/auth/login`;
const GOOGLE_AUTH_URL = `${API_BASE_URL}/api/auth/google`; 

function SignIn({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleSignIn = async () => {
    setApiMessage("");
    
    if (!email || !password) {
        setApiMessage("❌ Please enter both email and password.");
        return;
    }
    
    if (!API_BASE_URL) {
        setApiMessage("❌ Configuration Error: API URL not set.");
        return; 
    }

    setLoading(true);

    try {
        const response = await axios.post(LOGIN_API_URL, {
            email,
            password
        });
        
        
        const token = response.data.token;
        const userId = response.data.user.id; 
        
        if (!token || !userId) {
            throw new Error("Login failed: Invalid response from server.");
        }

        localStorage.setItem('authToken', token);
        
        onLogin(userId); 
        
        navigate("/", { replace: true }); 

    } catch (error) {
        const errorMessage = error.response?.data?.message 
                             || "Invalid email or password. Please try again.";
        setApiMessage(`❌ ${errorMessage}`);

    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <div className="background-container"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="welcome-text">Welcome Back</div>
          
          {apiMessage && (
              <div style={{ 
                  color: "red", 
                  textAlign: "center", 
                  marginBottom: "10px",
                  fontWeight: "bold"
              }}>
                  {apiMessage}
              </div>
          )}

          <div className="input-group">
            <span className="icon">📧</span>
            <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="icon">🔒</span>
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="#" className="forgot-password">Forgot Password?</a>

          <button 
            className="btn sign-in-btn" 
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

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
              <span className="google-icon" style={{ marginRight: '8px' }}>G</span> Sign in with Google
          </a>

          <div className="signup-prompt">
            New here? <Link to="/signup" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;