const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    body: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String, // URL or file path
      default: "../src/assets/logo.svg"
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UnderTheHood Team",
      required: false // optional for now
    }
  },
  {
    timestamps: true // ✅ adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
