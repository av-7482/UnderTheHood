const Computer = require("../models/ComputerSchema");

/* ================= CREATE COMPUTER (ADMIN) ================= */
exports.createComputer = async (req, res) => {
  try {
    const computer = await Computer.create(req.body);
    res.status(201).json(computer);
  } catch (err) {
    res.status(400).json({ message: "Failed to add computer", error: err.message });
  }
};

/* ================= GET ALL COMPUTERS (PUBLIC) ================= */
exports.getAllComputers = async (req, res) => {
  try {
    const computers = await Computer.find().sort({ createdAt: -1 });
    res.json(computers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch computers" });
  }
};

/* ================= GET SINGLE COMPUTER ================= */
exports.getComputerById = async (req, res) => {
  try {
    const computer = await Computer.findById(req.params.id)
      .populate("reviews.user", "name");

    if (!computer)
      return res.status(404).json({ message: "Computer not found" });

    res.json(computer);
  } catch (err) {
    res.status(500).json({ message: "Invalid computer ID" });
  }
};

/* ================= UPDATE COMPUTER (ADMIN) ================= */
exports.updateComputer = async (req, res) => {
  try {
    const updated = await Computer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Computer not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};

/* ================= DELETE COMPUTER (ADMIN) ================= */
exports.deleteComputer = async (req, res) => {
  try {
    const deleted = await Computer.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Computer not found" });

    res.json({ message: "Computer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= ADD REVIEW (USER ONLY) ================= */
exports.addComputerReview = async (req, res) => {
  try {
    const { stars } = req.body;
    const userId = req.user.id;

    const computer = await Computer.findById(req.params.id);
    if (!computer)
      return res.status(404).json({ message: "Computer not found" });

    // prevent duplicate reviews
    const alreadyReviewed = computer.reviews.find(
      r => r.user.toString() === userId
    );

    if (alreadyReviewed)
      return res.status(400).json({ message: "You already reviewed this PC" });

    computer.reviews.push({ user: userId, stars });
    await computer.save();

    res.json({ message: "Review added successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to add review" });
  }
};
