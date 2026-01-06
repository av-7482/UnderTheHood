const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/computers", require("./routes/computerRoutes"));
app.use("/api/community", require("./routes/communityroute"));
app.use("/api/components", require("./routes/componentsRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
