import React, { useEffect, useState } from "react";
import "../CSS/computers.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const ComputerShowcase = () => {
    const [computers, setComputers] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    /* 🔍 SEARCH + FILTER */
    const [search, setSearch] = useState("");
    const [brand, setBrand] = useState("all");

    const token = localStorage.getItem("token");

    /* ================= FETCH COMPUTERS ================= */
    useEffect(() => {
        fetch("https://underthehood.onrender.com/api/computers")
            .then(res => res.json())
            .then(data => setComputers(data))
            .catch(err => console.error(err));
    }, []);

    /* ================= FETCH WISHLIST ================= */
    useEffect(() => {
        if (!token) return;

        const fetchWishlist = async () => {
            try {
                const res = await fetch("https://underthehood.onrender.com/api/wishlist", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                // normalize IDs to string
                setWishlist((data.computers || []).map(id => id.toString()));
            } catch (err) {
                console.error("Failed to load wishlist", err);
            }
        };

        fetchWishlist();
    }, [token]);

    /* ================= WISHLIST ================= */
    const toggleWishlist = async (computerId) => {
        if (!token) {
            alert("Please login to add to wishlist");
            return;
        }

        const id = computerId.toString();
        const isWishlisted = wishlist.includes(id);

        try {
            await fetch(
                `https://underthehood.onrender.com/api/wishlist/computers/${computerId}`,
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
                    ? prev.filter(wid => wid !== id)
                    : [...prev, id]
            );
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= FILTER LOGIC ================= */
    const filteredComputers = computers.filter(pc => {
        const matchesSearch =
            pc.modelName.toLowerCase().includes(search.toLowerCase()) ||
            pc.brand.toLowerCase().includes(search.toLowerCase());

        const matchesBrand =
            brand === "all" || pc.brand === brand;

        return matchesSearch && matchesBrand;
    });

    /* ================= UNIQUE BRANDS ================= */
    const brands = [
        "all",
        ...new Set(computers.map(pc => pc.brand))
    ];

    return (
        <>
            <Header />

            <div className="computers-page">
                <h1 className="page-title">PC & Laptop Builds</h1>

                {/* ================= FILTER BAR ================= */}
                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search PCs or laptops..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    >
                        {brands.map(b => (
                            <option key={b} value={b}>
                                {b.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ================= GRID ================= */}
                <div className="grid">
                    {filteredComputers.length === 0 && (
                        <p className="no-results">No computers found</p>
                    )}

                    {filteredComputers.map(pc => {
                        const pcId = pc._id.toString();

                        return (
                            <div key={pcId} className="computer-card">
                                {/* IMAGE */}
                                <div
                                    className="image"
                                    style={{
                                        backgroundImage: `url(/images/${pc.images?.[0] || "default.png"})`
                                    }}
                                >
                                    <span
                                        className={`wishlist ${wishlist.includes(pcId) ? "active" : ""}`}
                                        onClick={() => toggleWishlist(pcId)}
                                    >
                                        ♥
                                    </span>
                                </div>

                                {/* INFO */}
                                <div className="info">
                                    <h3>{pc.modelName}</h3>
                                    <p className="brand">{pc.brand}</p>

                                    <div className="spec-mini">
                                        <span>{pc.specs?.cpu}</span>
                                        <span>{pc.specs?.gpu}</span>
                                        <span>{pc.specs?.ram}</span>
                                    </div>

                                    <p className="price">₹ {pc.price}</p>

                                    {pc.reviews?.length > 0 && (
                                        <div className="stars">
                                            ⭐{" "}
                                            {(
                                                pc.reviews.reduce((acc, r) => acc + r.stars, 0) /
                                                pc.reviews.length
                                            ).toFixed(1)}
                                            /5
                                        </div>
                                    )}

                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            (window.location.href = `/computers/${pcId}`)
                                        }
                                    >
                                        View Build
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Footer />
            </div>
        </>
    );
};

export default ComputerShowcase;
