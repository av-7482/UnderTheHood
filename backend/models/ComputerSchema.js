const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const computerSchema = new mongoose.Schema(
  {
    modelName: { type: String, required: true },
    brand: { type: String, required: true },

    description: {
      type: String,
      required: true
    },

    specs: {
      cpu: String,
      gpu: String,
      ram: String,
      storage: String,
      motherboard: String,
      powerSupply: String,
      cooling: String
    },

    price: { type: Number, required: true },

    images: [String],

    reviews: [reviewSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Computer", computerSchema);
