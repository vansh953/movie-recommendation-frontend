import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import "../style/Auth.css";

function SignIn({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      onLogin(data.user._id); // set logged in user
      if (data.user.firstLogin) {
        navigate("/select-language");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
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
            <button type="submit" className="btn sign-in-btn">Sign In</button>
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
