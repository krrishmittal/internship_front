import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import video from "../assets/background-video.mp4";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try { 
      const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Invalid Credentials");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-page">
      <video autoPlay loop muted className="background-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input type="email" className="form-input" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <div className="password-container">
            <input type={showPassword ? "text" : "password"} className="form-input"
              placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}> {showPassword ? "👁️" : "🔒"}
            </span>
          </div>
          <button type="submit" className="form-button">Login</button>
          <p>New to Internship? Register <button onClick={() => navigate("/signup")} className="for-button">Signup</button></p>
        </form>
      </div>
    </div>
  );
}

export default Login;