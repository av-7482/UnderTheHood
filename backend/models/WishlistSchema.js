const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        components: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Component"
            }
        ],

        computers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Computer"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
