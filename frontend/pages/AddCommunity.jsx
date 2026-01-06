import React, { useState } from "react";
import "../CSS/addcommunity.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function NewCommunityPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [author, setAuthor] = useState("");
    const [imagePath, setImagePath] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !body || !author) {
            alert("Please fill in all required fields.");
            return;
        }

        const postData = {
            title,
            body,
            author,
            image: "../src/assets/" + imagePath, // just the path
        };

        try {
            const res = await fetch("http://localhost:5000/api/community/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Post created successfully!");
                navigate("/community"); // redirect to community page
            } else {
                alert(data.message || "Failed to create post.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while creating the post.");
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImagePath(e.target.files[0].name); // only store filename
        }
    };

    return (
        <>
            <Header />
            <div className="new-post-page">
            <div className="new-post-container">
                <h1>Create a New Community Post</h1>
                <p>Share your insights, discoveries, and updates with the community.</p>

                <form className="post-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="post-title">Title</label>
                        <input
                            type="text"
                            id="post-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="A compelling title for your post..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="post-body">Body</label>
                        <textarea
                            id="post-body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your post content here. Markdown supported."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="post-author">Author</label>
                        <input
                            type="text"
                            id="post-author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Your name or community handle"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image (Optional)</label>
                        <input type="file" id="post-image" onChange={handleImageChange} />
                        {imagePath && <p className="image-name">Selected: {imagePath}</p>}
                    </div>

                    <button type="submit" className="submit-btn">
                        Publish Post
                    </button>
                </form>
            </div>
            </div>
            <Footer />
        </>
    );
}
