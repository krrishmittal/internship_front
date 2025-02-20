import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import video from "../assets/background-video.mp4";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const minLength = 8;
        const hasNumber = /\d/;
        const hasUpperCase = /[A-Z]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < minLength) {
            return "Password must be at least 8 characters long.";
        }
        if (!hasNumber.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!hasUpperCase.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!hasSpecialChar.test(password)) {
            return "Password must contain at least one special character.";
        }
        return null;
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const passwordError = validatePassword(password);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }
    
        try {
            const response = await fetch("https://internship-backend-bkhn.onrender.com/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
                credentials: "include",
            });
    
            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(errorText); 
            }
            await response.json(); 
            toast.success("Signup successful!");
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
        }
        setUsername("");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="signup-page">
            <video autoPlay loop muted className="background-video">
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="form-container">
                <h2 className="form-title">Sign Up</h2>
                <form onSubmit={handleSignupSubmit}>
                    <input type="text" className="form-input" placeholder="Username"
                        value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="email" className="form-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                    />
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <span className="eye-icon"onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "🔒"}
                        </span>
                    </div>
                    <button type="submit" className="form-button">Signup</button>
                </form>
                <p>Already registered? <button onClick={() => navigate("/login")} className="for-button">Login</button></p>
            </div>
        </div>
    );
}

export default Signup;