const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunitySchema");

/**
 * @route   GET /api/community
 * @desc    Get all community posts (latest first)
 * @access  Public
 */
router.get("/access", async (req, res) => {
    try {
        const posts = await CommunityPost.find()
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching community posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});
/**
 * @route   GET /api/community/:id
 * @desc    Get single community post by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Server error" });
    }
});


/**
 * @route   POST /api/community
 * @desc    Create a community post (admin/mod only)
 * @access  Protected (optional)
 */
router.post("/add", async (req, res) => {
    try {
        const { title, body, image } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: "Title and body are required" });
        }

        const newPost = new CommunityPost({
            title,
            body,
            image,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        console.error("Error creating community post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
