import React, { useState } from "react";
import "../CSS/update.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

export default function UpdateItem() {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [type, setType] = useState(""); // component | computer
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

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


    /* ================= FETCH ITEM ================= */
    const fetchItem = async () => {
        if (!id) return;

        setLoading(true);
        setMsg("");

        try {
            // Try component
            let res = await fetch(`https://underthehood.onrender.com/api/components/${id}`);
            if (res.ok) {
                setData(await res.json());
                setType("component");
                return;
            }

            // Try computer
            res = await fetch(`https://underthehood.onrender.com/api/computers/${id}`);
            if (res.ok) {
                setData(await res.json());
                setType("computer");
                return;
            }

            throw new Error();
        } catch {
            setMsg("No component or computer found");
            setData(null);
            setType("");
        } finally {
            setLoading(false);
        }
    };

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (path, value) => {
        setData((prev) => {
            const copy = structuredClone(prev);
            let ref = copy;
            for (let i = 0; i < path.length - 1; i++) {
                ref = ref[path[i]];
            }
            ref[path[path.length - 1]] = value;
            return copy;
        });
    };

    /* ================= UPDATE ================= */
    const updateItem = async () => {
        if (!data) return;

        // Remove fields backend doesn't need
        const { _id, createdAt, __v, ...payload } = data;

        try {
            const res = await fetch(
                `https://underthehood.onrender.com/api/${type}s/${_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(localStorage.getItem("token") && {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        })
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) throw new Error();
            setMsg("Updated successfully ✅");
        } catch {
            setMsg("Update failed ❌");
        }
    };

    return (
        <>
            <div className="update1-page">
                <Header />
                <div className="update-page">
                    <h1>Update Component / Computer</h1>

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

                    {msg && <p className={`msg ${msg.includes('✅') ? 'success' : 'error'}`}>{msg}</p>}

                    {/* ================= COMPONENT FORM ================= */}
                    {data && type === "component" && (
                        <div className="form-card">
                            <h2>Edit Component</h2>

                            <div className="form-group">
                                <label>Component Name</label>
                                <input
                                    value={data.name}
                                    onChange={(e) => handleChange(["name"], e.target.value)}
                                    placeholder="Enter component name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Brand</label>
                                <input
                                    value={data.brand}
                                    onChange={(e) => handleChange(["brand"], e.target.value)}
                                    placeholder="Enter brand name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    value={data.category}
                                    onChange={(e) => handleChange(["category"], e.target.value)}
                                    placeholder="Enter category"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => handleChange(["price"], e.target.value)}
                                    placeholder="Enter price"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={data.about || ""}
                                    onChange={(e) => handleChange(["about"], e.target.value)}
                                    placeholder="Enter detailed description"
                                />
                            </div>

                            <h3>Specifications</h3>
                            {data.specifications?.map((spec, i) => (
                                <div key={i} className="spec-group">
                                    <div className="form-group">
                                        <label>Specification Title</label>
                                        <input
                                            value={spec.title}
                                            onChange={(e) =>
                                                handleChange(["specifications", i, "title"], e.target.value)
                                            }
                                            placeholder="e.g., Processor, RAM, Storage"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Specification Details</label>
                                        <textarea
                                            value={spec.body}
                                            onChange={(e) =>
                                                handleChange(["specifications", i, "body"], e.target.value)
                                            }
                                            placeholder="e.g., Intel Core i7, 16GB DDR4, 1TB SSD"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ================= COMPUTER FORM ================= */}
                    {data && type === "computer" && (
                        <div className="form-card">
                            <h2>Edit Computer</h2>

                            <div className="form-group">
                                <label>Model Name</label>
                                <input
                                    value={data.modelName}
                                    onChange={(e) =>
                                        handleChange(["modelName"], e.target.value)
                                    }
                                    placeholder="Enter model name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Brand</label>
                                <input
                                    value={data.brand}
                                    onChange={(e) => handleChange(["brand"], e.target.value)}
                                    placeholder="Enter brand name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => handleChange(["price"], e.target.value)}
                                    placeholder="Enter price"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={data.description || ""}
                                    onChange={(e) =>
                                        handleChange(["description"], e.target.value)
                                    }
                                    placeholder="Enter computer description"
                                />
                            </div>

                            <h3>Specifications</h3>
                            {Object.entries(data.specs || {}).map(([key, val]) => (
                                <div className="form-group" key={key}>
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                    <input
                                        value={val}
                                        onChange={(e) =>
                                            handleChange(["specs", key], e.target.value)
                                        }
                                        placeholder={`Enter ${key}`}
                                    />
                                </div>
                            ))}

                            <h3>Images</h3>
                            {data.images?.map((img, i) => (
                                <div className="form-group" key={i}>
                                    <label>Image URL {i + 1}</label>
                                    <input
                                        value={img}
                                        onChange={(e) =>
                                            handleChange(["images", i], e.target.value)
                                        }
                                        placeholder="Enter image URL"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {data && (
                        <button className="update-btn" onClick={() => {
                            updateItem();
                            scrollToTop();
                        }}>
                            Update {type === 'component' ? 'Component' : 'Computer'}
                        </button>
                    )}
                    <button className="update-btn" onClick={() => {
                        navigate("/");
                        scrollToTop();
                    }}>
                        Back to Home
                    </button>
                </div>
                <Footer />
            </div>


        </>
    );
}