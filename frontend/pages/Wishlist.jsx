import React, { useEffect, useState } from "react";
import "../CSS/wishlist.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [components, setComponents] = useState([]);
    const [computers, setComputers] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= TOGGLE WISHLIST ================= */
    const toggleWishlist = async (id, type) => {
        if (!token) {
            alert("Please login to modify wishlist");
            return;
        }

        const isWishlisted = wishlist.includes(id);

        try {
            await fetch(
                `https://underthehood.onrender.com/api/wishlist/${type}s/${id}`,
                {
                    method: isWishlisted ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Update wishlist state
            setWishlist(prev =>
                isWishlisted
                    ? prev.filter(wid => wid !== id)
                    : [...prev, id]
            );

            // Remove item from UI immediately
            if (isWishlisted) {
                if (type === "component") {
                    setComponents(prev => prev.filter(c => c._id !== id));
                } else {
                    setComputers(prev => prev.filter(c => c._id !== id));
                }
            }
        } catch (err) {
            console.error("Wishlist toggle failed", err);
        }
    };

    /* ================= FETCH WISHLIST ================= */
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchWishlist = async () => {
            try {
                const res = await fetch("https://underthehood.onrender.com/api/wishlist", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const wishlistData = await res.json();

                // Store all wishlist IDs (for heart state)
                setWishlist([
                    ...wishlistData.components,
                    ...wishlistData.computers
                ]);

                // Fetch component details
                const componentData = await Promise.all(
                    wishlistData.components.map(id =>
                        fetch(`https://underthehood.onrender.com/api/components/${id}`).then(r => r.json())
                    )
                );

                // Fetch computer details
                const computerData = await Promise.all(
                    wishlistData.computers.map(id =>
                        fetch(`https://underthehood.onrender.com/api/computers/${id}`).then(r => r.json())
                    )
                );

                setComponents(componentData);
                setComputers(computerData);
            } catch (err) {
                console.error("Failed to load wishlist", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [token]);

    return (
        <>
            <Header />

            <div className="wishlist-page">
                <h1 className="page-title">❤️ Your Wishlist</h1>

                {loading && <p className="loading">Loading wishlist...</p>}

                {!loading && components.length === 0 && computers.length === 0 && (
                    <p className="empty">Your wishlist is empty</p>
                )}

                {/* ================= COMPONENTS ================= */}
                {components.length > 0 && (
                    <>
                        <h2 className="section-title">Components</h2>
                        <div className="grid">
                            {components.map(item => (
                                <div className="wishlist-card" key={item._id}>
                                    <div
                                        className="image"
                                        style={{
                                            backgroundImage: `url(/images/${item.image || "default.png"})`
                                        }}
                                    >
                                        <span
                                            className={`wishlist ${wishlist.includes(item._id) ? "active" : ""}`}
                                            onClick={() => toggleWishlist(item._id, "component")}
                                        >
                                            ♥
                                        </span>
                                    </div>

                                    <div className="info">
                                        <h3>{item.name}</h3>
                                        <p className="brand">{item.brand}</p>
                                        <p className="category">{item.category}</p>
                                        <p className="price">₹ {item.price}</p>

                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/components/${item._id}`)}
                                        >
                                            View Specs
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ================= COMPUTERS ================= */}
                {computers.length > 0 && (
                    <>
                        <h2 className="section-title">Computers</h2>
                        <div className="grid">
                            {computers.map(pc => (
                                <div className="wishlist-card" key={pc._id}>
                                    <div
                                        className="image"
                                        style={{
                                            backgroundImage: `url(../src/assets/${pc.images?.[0] || "default.png"})`
                                        }}
                                    >
                                        <span
                                            className={`wishlist ${wishlist.includes(pc._id) ? "active" : ""}`}
                                            onClick={() => toggleWishlist(pc._id, "computer")}
                                        >
                                            ♥
                                        </span>
                                    </div>

                                    <div className="info">
                                        <h3>{pc.modelName}</h3>
                                        <p className="brand">{pc.brand}</p>
                                        <p className="price">₹ {pc.price}</p>

                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/computers/${pc._id}`)}
                                        >
                                            View PC
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}
