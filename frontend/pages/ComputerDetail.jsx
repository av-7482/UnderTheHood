import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS/computerdetail.css";

export default function ComputerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [computer, setComputer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stars, setStars] = useState(5);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    /* ================= FETCH COMPUTER ================= */
    const fetchComputer = async () => {
        try {
            const res = await fetch(`https://underthehood.onrender.com/api/computers/${id}`);

            if (!res.ok) throw new Error("Computer not found");

            const data = await res.json();
            setComputer(data);
        } catch (err) {
            console.error(err);
            setComputer(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComputer();
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
                `https://underthehood.onrender.com/api/computers/${id}/review`,
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
            fetchComputer();
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= STATES ================= */
    if (loading)
        return <p className="status-text">Loading computer...</p>;

    if (!computer)
        return <p className="status-text">Computer not found</p>;

    /* ================= RATING ================= */
    const avgRating =
        computer.reviews?.length > 0
            ? (
                computer.reviews.reduce((s, r) => s + r.stars, 0) /
                computer.reviews.length
            ).toFixed(1)
            : null;

    return (
        <div className="page">
            <Header />

            <main className="content">
                {/* BACK */}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {/* TITLE */}
                <h1 className="title">{computer.modelName}</h1>

                {/* PRODUCT CONTAINER */}
                <div className="product-container">
                    {/* LEFT */}
                    <div className="left-column">
                        <div className="product-image">
                            <img
                                src={`/images/${computer.images?.[0]}`}
                                alt={computer.modelName}
                                onError={(e) => {
                                    e.target.src = "/images/default-pc.png";
                                }}
                            />
                        </div>

                        {computer.description && (
                            <section className="about-section">
                                <h2>About This Build</h2>
                                <p>{computer.description}</p>
                            </section>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="right-column">
                        <section className="info-card card">
                            <h2>Build Details</h2>
                            <p><strong>Brand:</strong> {computer.brand}</p>
                            <p><strong>Price:</strong> ₹{computer.price.toLocaleString()}</p>
                            <p><strong>Build ID:</strong> {computer._id}</p>
                        </section>

                        <section className="card review">
                            <h2>User Ratings</h2>

                            {avgRating ? (
                                <div className="rating">
                                    {"★".repeat(Math.floor(avgRating))}
                                    <span>{avgRating} / 5</span>
                                </div>
                            ) : (
                                <p className="no-reviews">No ratings yet</p>
                            )}

                            {computer.reviews?.length > 0 && (
                                <p className="muted">
                                    Based on {computer.reviews.length} reviews
                                </p>
                            )}
                        </section>

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
                                                {s} Stars
                                            </option>
                                        ))}
                                    </select>

                                    <button onClick={submitReview} disabled={submitting}>
                                        {submitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* ================= SPECS ================= */}
                <section className="specs-expanded">
                    <h2 className="section-title">Specifications</h2>

                    <div className="specs-grid">
                        {Object.entries(computer.specs || {}).map(
                            ([key, value]) =>
                                value && (
                                    <div className="specs-card" key={key}>
                                        <h3>{key.toUpperCase()}</h3>
                                        <p>{value}</p>
                                    </div>
                                )
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
