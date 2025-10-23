import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/Auth.css";
import { loginUser, loginWithGoogle } from "../api";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        alert("Login Successful!");
        navigate("/"); // Redirect to home or dashboard
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <>
      <div className="background-container"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="welcome-text">Welcome Back</div>

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

          {error && <small style={{ color: "red" }}>{error}</small>}

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          <button className="btn sign-in-btn" onClick={handleLogin}>
            Sign In
          </button>

          <div className="or-separator">OR</div>

          <button className="btn google-btn" onClick={loginWithGoogle}>
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
