const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// API Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/computers", require("./routes/computerRoutes"));
app.use("/api/community", require("./routes/communityroute"));
app.use("/api/components", require("./routes/componentsRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Serve Frontend
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// React/Vite Catch-All Route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});