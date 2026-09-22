import React, { useEffect, useState, useRef } from "react";
import "../CSS/header.css";
import logo from "../src/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef();
  const [adminOpen, setAdminOpen] = useState(false);


  const scrollToTop = () => {
    if (window.scrollY <= 300) return;

    const startPosition = window.scrollY;
    const duration = 1200; // ⏳ increase = slower (try 1500–2000)
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic for smooth slow ending
      const ease = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startPosition * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const getInitials = (name) =>
    name?.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <header className="header">
      {/* LOGO */}
      <Link to="/" onClick={scrollToTop}>
        <div className="logo">
          <span className="icon">
            <img src={logo} alt="Logo" />
          </span>
          <h2 className="text">
            <span className="under">Under</span>
            <span className="rest">TheHood</span>
          </h2>
        </div>
      </Link>

      {/* NAV */}
      <nav className="nav">
        <Link to="/" onClick={scrollToTop}>Home</Link>
        <Link to="/components">Browse Components</Link>

        <Link to="/computers">Computers</Link>
        <Link to="/community">Community</Link>
        {
          user?.role === "user" && (
            <Link to="/wishlist">My Wishlist</Link>
          )
        }

        {user?.role === "admin" && (
          <div
            className="nav-dropdown"
            onMouseEnter={() => setAdminOpen(true)}
            onMouseLeave={() => setAdminOpen(false)}
          >
            <span className="nav-link admin">Admin</span>

            {adminOpen && (
              <div className="dropdown-menu">
                <Link to="/admin/community/add">Add Community Post</Link>
                <Link to="/admin/component/add">Add Components</Link>
                <Link to="/admin/computer/add">Add Computers</Link>
                <Link to="/admin/update">Update Items</Link>
                <Link to="/admin/delete">Delete Items</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* AUTH AREA */}
      <div className="auth-buttons" ref={dropdownRef}>
        {!user ? (
          <>
            <button className="btn primary" onClick={() => navigate("/register")}>
              Sign Up
            </button>
            <button className="btn" onClick={() => navigate("/login")}>
              Log In
            </button>
          </>
        ) : (
          <div
            className="avatar-dropdown-wrapper"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <div className="avatar">{getInitials(user.name)}</div>

            {profileOpen && (
              <div className="dropdown">
                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </header>
  );
}

export default Header;
