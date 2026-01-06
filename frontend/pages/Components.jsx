import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "../CSS/components.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const ComponentShowcase = () => {
  const [components, setComponents] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  /* 🔍 SEARCH + FILTER STATE */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const token = localStorage.getItem("token");

  /* ================= FETCH COMPONENTS ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/components")
      .then(res => res.json())
      .then(data => setComponents(data))
      .catch(err => console.error(err));
  }, []);

  /* ================= WISHLIST ================= */
  const toggleWishlist = async (componentId) => {
    if (!token) {
      alert("Please login to add to wishlist");
      return;
    }

    const isWishlisted = wishlist.includes(componentId);

    try {
      await fetch(
        `http://localhost:5000/api/wishlist/components/${componentId}`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setWishlist(prev =>
        isWishlisted
          ? prev.filter(id => id !== componentId)
          : [...prev, componentId]
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredComponents = components.filter(component => {
    const matchesSearch =
      component.name.toLowerCase().includes(search.toLowerCase()) ||
      component.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || component.category === category;

    return matchesSearch && matchesCategory;
  });

  /* ================= UNIQUE CATEGORIES ================= */
  const categories = [
    "all",
    ...new Set(components.map(c => c.category))
  ];

  return (
    <>
      <Header />

      <div className="components-page">
        <div className="showcase-page">

          <h1 className="page-title">Component Showcase</h1>

          {/* ================= SEARCH + FILTER ================= */}
          <div className="filter-bar">

            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>

          </div>

          {/* ================= GRID ================= */}
          <div className="grid">
            {filteredComponents.length === 0 && (
              <p className="no-results">No components found</p>
            )}

            {filteredComponents.map(component => (
              <div key={component._id} className="component-card">

                {/* Image */}
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(../src/assets/${component.image})`
                  }}
                >
                  {/* Wishlist */}
                  <span
                    className={`wishlist ${wishlist.includes(component._id) ? "active" : ""
                      }`}
                    onClick={() => toggleWishlist(component._id)}
                  >
                    ♥
                  </span>
                </div>

                {/* Info */}
                <div className="info">
                  <h3>{component.name}</h3>
                  <p className="brand">{component.brand}</p>
                  <p className="category">{component.category.toUpperCase()}</p>
                  <p className="price">₹ {component.price}</p>

                  {component.reviews.length > 0 && (
                    <div className="stars">
                      ⭐{" "}
                      {(
                        component.reviews.reduce(
                          (acc, r) => acc + r.stars,
                          0
                        ) / component.reviews.length
                      ).toFixed(1)}
                      /5
                    </div>
                  )}

                  <button
                    className="view-btn"
                    onClick={() =>
                      (window.location.href = `/components/${component._id}`)
                    }
                  >
                    View Specs
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
};

export default ComponentShowcase;
