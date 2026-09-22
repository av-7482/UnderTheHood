const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { _id: false }
);

const specificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true, // free text / key-value lines
    },
  },
  { _id: false }
);

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "cpu",
        "gpu",
        "motherboard",
        "ram",
        "storage",
        "psu",
        "case",
        "cooling",
        "monitor",
      ],
    },

    price: {
      type: Number,
      required: true,
    },

    /** ✅ IMAGE FILE NAME ONLY */
    image: {
      type: String,
      required: true,
      // example: "rtx4090.png"
    },

    /** Dynamic specification sections */
    specifications: [specificationSchema],

    /** User star reviews */
    reviews: [reviewSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Component", componentSchema);
