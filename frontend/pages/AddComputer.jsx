import { useState } from "react";
import "../CSS/addcomputer.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AddComputer() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ===== BASIC DETAILS ===== */
  const [modelName, setModelName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  /* ===== SPECS ===== */
  const [specs, setSpecs] = useState({
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    motherboard: "",
    powerSupply: "",
    cooling: ""
  });

  /* ===== IMAGE HANDLER (filename only) ===== */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).map(file => file.name);
    setImages(files);
  };

  /* ===== SPECS HANDLER ===== */
  const handleSpecChange = (e) => {
    setSpecs({ ...specs, [e.target.name]: e.target.value });
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      modelName,
      brand,
      description,
      price,
      images,
      specs
    };

    try {
      const res = await fetch("https://underthehood.onrender.com/api/computers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add computer");
        return;
      }

      alert("Computer added successfully");
      navigate(`/computers/${data._id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="app-layout">
      <Header />

      <div className="add-computer-page">
        <h1>Add New Computer</h1>

        <form className="computer-form" onSubmit={handleSubmit}>

          {/* ===== BASIC DETAILS ===== */}
          <div className="card">
            <h2>Basic Details</h2>

            <div className="form-group">
              <label>Model Name</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Images</label>
              <input type="file" multiple onChange={handleImageChange} />
              {images.length > 0 && (
                <p className="image-name">
                  Selected: {images.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* ===== SPECIFICATIONS ===== */}
          <div className="card">
            <h2>Specifications</h2>

            {Object.keys(specs).map((key) => (
              <div className="form-group" key={key}>
                <label>{key.toUpperCase()}</label>
                <input
                  name={key}
                  value={specs[key]}
                  onChange={handleSpecChange}
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>

          <button className="submit-btn" type="submit">
            Publish Computer
          </button>

        </form>
      </div>

      <Footer />
    </div>
  );
}
