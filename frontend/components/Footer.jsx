import React from "react";
import "../CSS/footer.css";
import logo from "../src/assets/logo.png";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon"><img src={logo} alt="Logo" /></span>
            <span className="logo-text">
              <span className="logo-under">Under</span><span className="logo-rest">TheHood</span>
            </span>
          </div>
          <p>
            The community-driven database for computer enthusiasts.
            Compare specs, check compatibility, and build your dream PC.
          </p>
        </div>

        {/* Hardware */}
        <div className="footer-column">
          <h4>Hardware</h4>
          <ul>
            <Link to="/components"><li>Components</li></Link>
            <Link to="/computers"><li>Computers</li></Link>
          </ul>
        </div>

        {/* Community */}
        <div className="footer-column">
          <h4>Pages</h4>
          <ul>
            <Link to="/"><li>Home</li></Link>
            <Link to="/community"><li>Community</li></Link>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2024 UnderTheHood. All rights reserved.</p>

        <div className="footer-icons">
          <span>🌐</span>
          <span>✉️</span>
          <span>📡</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
