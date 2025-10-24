import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/Auth.css";
import { loginUser } from "../api";

function SignIn({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser({ email, password });
      onLogin(user);
      if (user.firstLogin) navigate("/select-language");
      else navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <>
      <div className="background-container"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="welcome-text">Welcome Back</div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <small style={{ color: "red" }}>{error}</small>}

            <button type="submit" className="btn sign-in-btn">
              Sign In
            </button>
          </form>

          <div className="signup-prompt">
            New here? <Link to="/signup" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
