import React, { useState } from "react";
import "../CSS/update.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

export default function DeleteItem() {
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [type, setType] = useState(""); // component | computer
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= FETCH ITEM ================= */
    const fetchItem = async () => {
        if (!id) return;

        setLoading(true);
        setMsg("");
        setData(null);
        setType("");

        try {
            // Try component
            let res = await fetch(`http://localhost:5000/api/components/${id}`);
            if (res.ok) {
                setData(await res.json());
                setType("component");
                return;
            }

            // Try computer
            res = await fetch(`http://localhost:5000/api/computers/${id}`);
            if (res.ok) {
                setData(await res.json());
                setType("computer");
                return;
            }

            throw new Error();
        } catch {
            setMsg("No component or computer found ❌");
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ================= */
    const deleteItem = async () => {
        if (!data) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete this ${type}?`
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/${type}s/${data._id}`,
                {
                    method: "DELETE",
                    headers: {
                        ...(localStorage.getItem("token") && {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }),
                    },
                }
            );

            if (!res.ok) throw new Error();

            setMsg("Deleted successfully ✅");
            setData(null);
            setType("");
            setId("");
            scrollToTop();
        } catch {
            setMsg("Delete failed ❌");
        }
    };

    return (
        <div className="update1-page">
            <Header />

            <div className="update-page">
                <h1>Delete Component / Computer</h1>

                {/* SEARCH */}
                <div className="search-box">
                    <input
                        placeholder="Enter Item ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <button onClick={fetchItem} disabled={loading}>
                        {loading ? "Searching..." : "Search Item"}
                    </button>
                </div>

                {msg && (
                    <p className={`msg ${msg.includes("✅") ? "success" : "error"}`}>
                        {msg}
                    </p>
                )}

                {/* ================= PREVIEW CARD ================= */}
                {data && (
                    <div className="form-card">
                        <h2>
                            {type === "component" ? "Component Preview" : "Computer Preview"}
                        </h2>

                        {/* IMAGE */}
                        {data.images?.length > 0 && (
                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                <img
                                    src={data.images[0]}
                                    alt="preview"
                                    style={{
                                        maxWidth: "220px",
                                        borderRadius: "10px",
                                        border: "1px solid #333",
                                    }}
                                />
                            </div>
                        )}

                        {/* COMMON INFO */}
                        <div className="form-group">
                            <label>Name / Model</label>
                            <input
                                disabled
                                value={data.name || data.modelName}
                            />
                        </div>

                        <div className="form-group">
                            <label>Brand</label>
                            <input disabled value={data.brand} />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input disabled value={data.price} />
                        </div>

                        {/* COMPUTER SPECS */}
                        {type === "computer" && (
                            <>
                                <h3>Specifications</h3>
                                {Object.entries(data.specs || {}).map(([key, val]) => (
                                    <div className="form-group" key={key}>
                                        <label>{key}</label>
                                        <input disabled value={val} />
                                    </div>
                                ))}
                            </>
                        )}

                        {/* COMPONENT INFO */}
                        {type === "component" && (
                            <>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input disabled value={data.category} />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea disabled value={data.about || ""} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* DELETE BUTTON */}
                {data && (
                    <button
                        className="update-btn"
                        style={{
                            background: "#ff3b3b",
                            borderColor: "#ff3b3b",
                            color: "#fff",
                        }}
                        onClick={deleteItem}
                    >
                        Delete {type === "component" ? "Component" : "Computer"}
                    </button>
                )}

                <button
                    className="update-btn"
                    onClick={() => {
                        navigate("/");
                        scrollToTop();
                    }}
                >
                    Back to Home
                </button>
            </div>

            <Footer />
        </div>
    );
}
