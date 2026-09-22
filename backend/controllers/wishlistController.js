const Wishlist = require("../models/WishlistSchema");

/* ================= GET USER WISHLIST ================= */
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                components: [],
                computers: []
            });
        }

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
};

/* ================= ADD COMPONENT ================= */
exports.addComponent = async (req, res) => {
    const { id } = req.params;

    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                components: [],
                computers: []
            });
        }

        if (!wishlist.components.includes(id)) {
            wishlist.components.push(id);
            await wishlist.save();
        }

        res.json({ message: "Component added to wishlist" });
    } catch {
        res.status(500).json({ message: "Failed to add component" });
    }
};

/* ================= REMOVE COMPONENT ================= */
exports.removeComponent = async (req, res) => {
    const { id } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) return res.json({});

        wishlist.components = wishlist.components.filter(
            item => item.toString() !== id
        );

        await wishlist.save();
        res.json({ message: "Component removed" });
    } catch {
        res.status(500).json({ message: "Failed to remove component" });
    }
};

/* ================= ADD COMPUTER ================= */
exports.addComputer = async (req, res) => {
    const { id } = req.params;

    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                components: [],
                computers: []
            });
        }

        if (!wishlist.computers.includes(id)) {
            wishlist.computers.push(id);
            await wishlist.save();
        }

        res.json({ message: "Computer added to wishlist" });
    } catch {
        res.status(500).json({ message: "Failed to add computer" });
    }
};

/* ================= REMOVE COMPUTER ================= */
exports.removeComputer = async (req, res) => {
    const { id } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) return res.json({});

        wishlist.computers = wishlist.computers.filter(
            item => item.toString() !== id
        );

        await wishlist.save();
        res.json({ message: "Computer removed" });
    } catch {
        res.status(500).json({ message: "Failed to remove computer" });
    }
};
