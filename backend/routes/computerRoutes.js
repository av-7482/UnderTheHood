const express = require("express");
const router = express.Router();

const {
  createComputer,
  getAllComputers,
  getComputerById,
  updateComputer,
  deleteComputer,
  addComputerReview
} = require("../controllers/computerController");

const verifyToken = require("../middleware/verifyToken");

/* PUBLIC */
router.get("/", getAllComputers);
router.get("/:id", getComputerById);

/* ADMIN */
router.post("/", verifyToken, createComputer);
router.put("/:id", verifyToken, updateComputer);
router.delete("/:id", verifyToken, deleteComputer);

/* USER REVIEW */
router.post("/:id/review", verifyToken, addComputerReview);

module.exports = router;
