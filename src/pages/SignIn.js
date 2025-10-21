import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/Auth.css";

function SignIn({ onLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  return (
    <>
      <div className="background-container"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="welcome-text">Welcome Back</div>

          <div className="input-group">
            <span className="icon">📧</span>
            <input type="email" placeholder="Email" />
          </div>
          <div className="input-group">
            <span className="icon">🔒</span>
            <input type="password" placeholder="Password" />
          </div>

          <a href="#" className="forgot-password">Forgot Password?</a>

          <button className="btn sign-in-btn" onClick={onLogin}>
            Sign In
          </button>

          <div className="or-separator">OR</div>

          <button className="btn google-btn">
            <span className="google-icon">🟢</span> Sign in with Google
          </button>

          <div className="signup-prompt">
            New here? <Link to="/signup" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
