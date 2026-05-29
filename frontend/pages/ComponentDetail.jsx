import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS/componentdetail.css";

export default function ComponentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stars, setStars] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    /* ================= FETCH COMPONENT ================= */
    const fetchComponent = async () => {
        try {
            const res = await fetch(
                `https://underthehood.onrender.com/api/components/${id}`
            );

            if (!res.ok) throw new Error("Component not found");

            const data = await res.json();
            setComponent(data);
        } catch (err) {
            console.error(err);
            setComponent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComponent();
    }, [id]);

    /* ================= ADD REVIEW ================= */
    const submitReview = async () => {
        if (!token || !user || user.role !== "user") {
            alert("You must be logged in as a user to review");
            return;
        }

        try {
            setSubmitting(true);

            const res = await fetch(
                `https://underthehood.onrender.com/api/components/${id}/review`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ stars }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to add review");
                return;
            }

            alert("Review added successfully ⭐");
            fetchComponent();
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= STATES ================= */
    if (loading)
        return <p className="status-text">Loading component...</p>;

    if (!component)
        return <p className="status-text">Component not found</p>;

    /* ================= RATING ================= */
    const avgRating =
        component.reviews.length > 0
            ? (
                component.reviews.reduce((s, r) => s + r.stars, 0) /
                component.reviews.length
            ).toFixed(1)
            : null;

    return (
        <div className="page">
            <Header />

            <main className="content">
                {/* ================= BACK BUTTON ================= */}
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                {/* ================= TITLE ================= */}
                <h1 className="title">{component.name}</h1>

                {/* ================= PRODUCT CONTAINER ================= */}
                <div className="product-container">
                    {/* LEFT COLUMN: IMAGE + ABOUT */}
                    <div className="left-column">
                        {/* IMAGE */}
                        <div className="product-image">
                            <img
                                src={`/images/${component.image}`}
                                alt={component.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/default-component.png";
                                }}
                            />
                        </div>

                        {/* ABOUT SECTION */}
                        {component.about && (
                            <section className="about-section card">
                                <h2>About This Product</h2>
                                <div className="about-content">
                                    {component.about.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN: INFO & RATINGS */}
                    <div className="right-column">
                        {/* BASIC INFO */}
                        <section className="info-card card">
                            <h2>Product Details</h2>
                            <p><strong>Brand:</strong> {component.brand}</p>
                            <p><strong>Category:</strong> {component.category.toUpperCase()}</p>
                            <p><strong>Price:</strong> ₹{component.price.toLocaleString()}</p>
                            <p><strong>Product ID:</strong> {component._id}</p>
                        </section>

                        {/* RATINGS */}
                        <section className="card review">
                            <h2>User Ratings</h2>

                            {avgRating ? (
                                <div className="rating">
                                    {"★".repeat(Math.floor(avgRating))}
                                    {avgRating % 1 >= 0.5 && "⭐"}
                                    <span> {avgRating} / 5</span>
                                </div>
                            ) : (
                                <p className="no-reviews">No ratings yet</p>
                            )}

                            {component.reviews.length > 0 && (
                                <p className="muted" style={{ marginTop: '10px' }}>
                                    Based on {component.reviews.length} review{component.reviews.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </section>

                        {/* ADD REVIEW (USER ONLY) */}
                        {user && user.role === "user" && (
                            <section className="add-review">
                                <h2>Add Your Review</h2>
                                <div className="review-controls">
                                    <select
                                        value={stars}
                                        onChange={(e) => setStars(Number(e.target.value))}
                                    >
                                        {[5, 4, 3, 2, 1].map((s) => (
                                            <option key={s} value={s}>
                                                {s} Star{s !== 1 ? 's' : ''} - {"★".repeat(s)}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={submitReview}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* ================= SPECIFICATIONS ================= */}
                <section className="specs-expanded">
                    <h2 className="section-title">Specifications</h2>

                    <div
                        className={`specs-grid ${component.specifications.length === 1
                            ? "center-spec"
                            : ""
                            }`}
                    >
                        {component.specifications.map((spec, idx) => (
                            <div className="specs-card" key={idx}>
                                <h3>{spec.title}</h3>
                                <table>
                                    <tbody>
                                        {spec.body.split("\n").map((line, i) => {
                                            const [key, value] = line.split(":");
                                            return (
                                                <tr key={i}>
                                                    <td>{key}</td>
                                                    <td>{value}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
