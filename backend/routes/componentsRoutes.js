const express = require("express");
const router = express.Router();
const {
  createComponent,
  getAllComponents,
  getAllComponentsNoCategory,
  getComponentById,
  updateComponent,
  deleteComponent,
  addReview
} = require("../controllers/componentsController");

const verifyToken = require("../middleware/verifyToken");

// PUBLIC
router.get("/", getAllComponents);
router.get("/all", getAllComponentsNoCategory);
router.get("/:id", getComponentById);
// PROTECTED
router.post("/", verifyToken, createComponent);
router.put("/:id", verifyToken, updateComponent);
router.delete("/:id", verifyToken, deleteComponent);
router.post("/:id/review", verifyToken, addReview);

module.exports = router;
