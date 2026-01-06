import { useState } from "react";
import "../CSS/addcomponent.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AddComponent() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [about, setAbout] = useState("");
  const [specs, setSpecs] = useState([
    { title: "GPU Core", body: "" },
    { title: "Memory", body: "" },
  ]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // role check
  /* IMAGE → filename only */
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0].name);
    }
  };

  const addSpec = () => {
    setSpecs([...specs, { title: "", body: "" }]);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      brand,
      category,
      price,
      image, // filename only
      about,
      specifications: specs,
    };

    try {
      const res = await fetch("http://localhost:5000/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Component added");
      navigate(`/components/${data._id}`);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="app-layout">
        <Header />
        <div className="add-component-page">
          <h1>Add New Component</h1>

          <form className="component-form" onSubmit={handleSubmit}>
            <div className="card">
              <h2>Basic Details</h2>

              <div className="form-group">
                <label htmlFor="name">Component Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="about">About</label>
                <input
                  id="about"
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  required
                />
              </div>


              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="cpu">CPU</option>
                  <option value="gpu">GPU</option>
                  <option value="ram">RAM</option>
                  <option value="motherboard">Motherboard</option>
                  <option value="storage">Storage</option>
                  <option value="psu">PSU</option>
                  <option value="case">Case</option>
                  <option value="cooling">Cooling</option>
                  <option value="monitor">Monitor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Component Image</label>
                <input id="image" type="file" onChange={handleImageChange} />
                {image && <p className="image-name">Selected: {image}</p>}
              </div>
            </div>

            <div className="card">
              <h2>Specifications</h2>

              {specs.map((spec, index) => (
                <div className="spec-card" key={index}>
                  <div className="form-group">
                    <label>Specification Title</label>
                    <input
                      type="text"
                      value={spec.title}
                      onChange={(e) =>
                        updateSpec(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Specification Details</label>
                    <textarea
                      value={spec.body}
                      onChange={(e) =>
                        updateSpec(index, "body", e.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeSpec(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" onClick={addSpec}>
                Add Specification
              </button>
            </div>

            <button className="submit-btn" type="submit">
              Publish Component
            </button>
          </form>

        </div>
        <Footer />
      </div>
    </>
  );
}
