const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const {
    getWishlist,
    addComponent,
    removeComponent,
    addComputer,
    removeComputer
} = require("../controllers/wishlistController");

/* ================= VIEW WISHLIST ================= */
router.get("/", verifyToken, getWishlist);

/* ================= COMPONENT WISHLIST ================= */
router.post(
    "/components/:id",
    verifyToken,
    addComponent
);

router.delete(
    "/components/:id",
    verifyToken,
    removeComponent
);

/* ================= COMPUTER WISHLIST ================= */
router.post(
    "/computers/:id",
    verifyToken,
    addComputer
);

router.delete(
    "/computers/:id",
    verifyToken,
    removeComputer
);

module.exports = router;
