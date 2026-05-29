import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS/communityarticle.css";

const CommunityArticle = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`https://underthehood.onrender.com/api/community/${id}`);
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error("Failed to load article", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p className="loading">Loading article...</p>;
    if (!post) return <p className="error">Article not found</p>;

    return (
        <>
            <div className="article-page">
                <Header />

                <div className="article-container">
                    <img
                        className="article-image"
                        src={post.image || "/placeholder.jpg"}
                        alt={post.title}
                    />

                    <h1 className="article-title">{post.title}</h1>

                    {/* Author + Date */}
                    <div className="article-meta">
                        <span className="article-author">
                            By {post.author || "UnderTheHood Team"}
                        </span>
                        <span className="article-dot"> • </span>
                        <span className="article-date">
                            {new Date(post.createdAt).toDateString()}
                        </span>
                    </div>
                    <br></br><br></br>
                    <div className="article-body">
                        {post.body}
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
                        ← Back to Community
                    </button>
                </div>


                <Footer />


            </div>
        </>
    );
};

export default CommunityArticle;
