import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/home.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const navigate = useNavigate();

  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [computers, setComputers] = useState([]);


  /* ================= QUOTES ================= */
  const techQuotes = [
    "The computer was born to solve problems that did not exist before.",
    "Technology is best when it brings people together.",
    "The advance of technology is based on making it fit in so that you don't really even notice it.",
    "Any sufficiently advanced technology is indistinguishable from magic.",
    "First, solve the problem. Then, write the code.",
    "The function of good software is to make the complex appear to be simple."
  ];

  /* ================= ROTATE QUOTES ================= */
  useEffect(() => {
    if (techQuotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % techQuotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  /* ================= FEATURES ================= */
  const features = [
    { icon: "⚡", title: "Real-Time Data", desc: "Up-to-date specifications and benchmarks" },
    { icon: "🔧", title: "Build Planning", desc: "Compatible component suggestions" },
    { icon: "⭐", title: "User Reviews", desc: "Authentic feedback from the community" },
    { icon: "💾", title: "Database", desc: "Comprehensive hardware library" }
  ];

  /* ================= STATS ================= */
  const stats = [
    { value: "500+", label: "Components" },
    { value: "50+", label: "Brands" },
    { value: "4.5", label: "Avg. Rating" },
    { value: "10K+", label: "Visitors" }
  ];

  /* ================= FETCH COMPONENTS ================= */
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/components");
        const data = await res.json();
        setComponents(data);
      } catch (err) {
        console.error("Failed to fetch components", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  useEffect(() => {
    const fetchComputers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/computers");
        const data = await res.json();
        setComputers(data);
      } catch (err) {
        console.error("Failed to fetch computers", err);
      }
    };

    fetchComputers();
  }, []);


  /* ================= DATA GROUPING ================= */
  const trending = components.slice(0, 4);
  const latest = components.slice(0, 5);

  return (
    <>
      <div className="container-home">
        <Header />
        {/* ================= HERO SECTION ================= */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-header">
              {/* Logo and Title Container */}
              <div className="logo-title-container">
                <div className="logo-wrapper">
                  <img
                    src="../src/assets/logo.svg"
                    alt="Hardware Hub Logo"
                    className="hero-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="logo-fallback">⚙️</div>
                </div>
                <div className="hero-title-wrapper">
                  <h1 className="hero-title">
                    <span className="gradient-text">Under</span>TheHood
                  </h1>
                  <div className="hero-tagline">
                    <span className="tagline-chip">🔧</span>
                    <span>Premium Hardware Database</span>
                  </div>
                </div>
              </div>

              {/* Hero Description */}
              <div className="hero-description">
                <p className="hero-subtitle">
                  The ultimate repository for computer specifications.
                  Find, analyse, and choose your hardware components with ease.
                </p>
              </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
              <div className="quick-links">
                <button className="quick-link" onClick={() => navigate("/components")}>
                  <span className="link-icon">💻</span>
                  All Components
                </button>
                <button className="quick-link" onClick={() => navigate("/components")}>
                  <span className="link-icon">🎮</span>
                  GPUs
                </button>
                <button className="quick-link" onClick={() => navigate("/components")}>
                  <span className="link-icon">⚡</span>
                  CPUs
                </button>
                <button className="quick-link" onClick={() => navigate("/components")}>
                  <span className="link-icon">🔌</span>
                  Motherboards
                </button>
              </div>
            </div>

            {/* Featured Quote */}
            <div className="quote-container">
              <div className="quote-icon">❝</div>
              <p className="quote-text">{techQuotes[currentQuote]}</p>
              <div className="quote-dots">
                {techQuotes.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === currentQuote ? 'active' : ''}`}
                    onClick={() => setCurrentQuote(idx)}
                  />
                ))}
              </div>
            </div>


          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="features-section">
          <div className="section-header">
            <h2>Why Choose <span className="highlight">UnderTheHood</span></h2>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, idx) => (
              <div className="stat-card" key={idx}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TRENDING HARDWARE ================= */}
        <section className="section trending-section">
          <div className="section-header">
            <div>
              <h2>🔥 Trending Hardware</h2>
            </div>
            <span className="view-all-btn" onClick={() => navigate("/components")}>
              View All →
            </span>
          </div>

          <div className="trending-grid">
            {loading ? (
              <div className="loading-grid">
                {[...Array(2)].map((_, idx) => (
                  <div className="hardware-card skeleton" key={idx}>
                    <div className="skeleton-image"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-button"></div>
                  </div>
                ))}
              </div>
            ) : trending.length === 0 ? (
              <div className="empty-state">
                <p>No trending components available</p>
              </div>
            ) : (
              trending.map((item) => (
                <div className="hardware-card" key={item._id}>
                  <div className="card-badge">{item.category.toUpperCase()}</div>
                  <div className="card-image">
                    <img
                      src={`../src/assets/${item.image}`}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default-component.png";
                      }}
                    />
                  </div>
                  <h3>{item.name}</h3>
                  <p className="card-brand">{item.brand}</p>
                  <p className="card-brand">Price: ₹{item.price.toLocaleString()}</p>
                  <div className="card-footer">
                    {/* <span className="card-price">₹{item.price.toLocaleString()}/-</span> */}
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/components/${item._id}`)}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ================= COMING SOON BUILDS ================= */}
        <section className="builds-section">
          <div className="section-header">
            <h2>💻 PC Builds</h2>
          </div>

          <div className="builds-grid">
            {computers.length === 0 ? (
              <div className="empty-state">
                <p>No PC builds available yet</p>
              </div>
            ) : (
              computers.slice(0, 3).map((pc) => (
                <div className="build-card" key={pc._id}>
                  <div className="build-content">
                    <div className="build-badge">{pc.brand}</div>
                    {/* PC IMAGE */}
                    <div className="build-image">
                      <img
                        src={`../src/assets/${pc.images?.[0]}`}
                        alt={pc.modelName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-pc.png";
                        }}
                      />
                    </div>

                    <h3>{pc.modelName}</h3>

                    <p>
                      {pc.description
                        ? pc.description.substring(0, 100) + "..."
                        : "Custom PC build with optimized performance"}
                    </p>


                    <p className="price">
                       ₹{pc.price?.toLocaleString()}
                    </p>

                    <button
                      className="notify-btn"
                      onClick={() => navigate(`/computers/${pc._id}`)}
                    >
                      View Build →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </section>

        {/* ================= LATEST ADDITIONS ================= */}
        <section className="latest-section">
          <div className="section-header">
            <div>
              <h2>📦 Latest Additions</h2>
              <p className="section-subtitle">Recently added to our database</p>
            </div>
            <span className="view-all-btn" onClick={() => navigate("/components")}>
              View All Components →
            </span>
          </div>

          <div className="table-container">
            <table className="components-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Added On</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <div className="loading-row">
                        Loading latest components...
                      </div>
                    </td>
                  </tr>
                ) : latest.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No components found
                    </td>
                  </tr>
                ) : (
                  latest.map((item) => (
                    <tr
                      key={item._id}
                      className="table-row"
                      onClick={() => navigate(`/components/${item._id}`)}
                    >
                      <td className="component-name">
                        <div className="name-wrapper">
                          <span className="name">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-tag">{item.category.toUpperCase()}</span>
                      </td>
                      <td>{item.brand}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="price-cell">₹{item.price.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Search Your Dream PC?</h2>
            <p>Join thousands of PC enthusiasts who trust our database for their builds.</p>
            <div className="cta-buttons">
              <button
                className="cta-btn primary"
                onClick={() => navigate("/components")}
              >
                Browse Components
              </button>
              <button
                className="cta-btn secondary"
                onClick={() => navigate("/login")}
              >
                Join Community
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}