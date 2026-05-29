import React, { useEffect, useState } from "react";
import "../CSS/community.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const CommunityNews = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);

    // Fetch news from backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("https://underthehood.onrender.com/api/community/access");
                const data = await res.json();
                setPosts(data);
                setFilteredPosts(data);
            } catch (err) {
                console.error("Failed to fetch community posts", err);
            }
        };

        fetchPosts();
    }, []);

    // Search functionality
    useEffect(() => {
        const result = posts.filter(post =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.body.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredPosts(result);
    }, [search, posts]);

    return (
        <>
            <div className="community-page">
                <Header />
                <div className="community-container">

                    <h1 className="page-title">Community News & Updates</h1>
                    <p className="page-subtitle">
                        Stay up-to-date with the latest from the UnderTheHood community.
                    </p>

                    {/* Search */}
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search news articles, topics, or keywords..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* News Grid */}
                    <div className="news-grid">
                        {filteredPosts.length === 0 ? (
                            <p className="no-results">No articles found.</p>
                        ) : (
                            filteredPosts.map(post => (
                                <div className="news-card" key={post._id} onClick={() => window.location.href = `/community/${post._id}`} >
                                    <div className="image-wrapper">
                                        <img
                                           src={`/images/${post.image}`}
                                            alt={post.title}
                                        />
                                    </div>

                                    <div className="news-content">
                                        <h3>{post.title}</h3>
                                        <p className="time">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Divider */}
                <hr className="article-divider" />

                {/* Back Button */}
                <div className="back-button-wrapper">
                    <button
                        className="back-button"
                        onClick={() => window.history.back()}
                    >
                        ← Back
                    </button>
                </div>
                <Footer />
            </div>
        </>
    );

};

export default CommunityNews;
