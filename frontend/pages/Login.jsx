import { useState } from "react";
import axios from "axios";
import "../CSS/auth.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://underthehood.onrender.com/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", res.data); // 🔍 DEBUG

      if (!res.data.user || !res.data.token) {
        alert("Invalid login response from server");
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔍 VERIFY
      console.log(
        "Stored user:",
        JSON.parse(localStorage.getItem("user"))
      );

      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };



  return (
    <>
      <Header />
      {/* Login Form */}
      <div className="login-form-container">
        <div className="login-card">
          <h1 className="login-heading">Log In</h1>
          <p className="login-subheading">
            Welcome back! Please enter your details.
          </p>
          <form className="login-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-button" onClick={handleLogin}>
              Log In
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );

}
