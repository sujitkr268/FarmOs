const express = require("express");
const router = express.Router();

const {
  getRegisteredBuyers,
  getRegisteredBuyerById,
  updateBuyerProfile
} = require("../controllers/buyerController");

const protect = require("../middleware/authMiddleware");

// Public routes
router.get("/", getRegisteredBuyers);
router.get("/:id", getRegisteredBuyerById);

// Protected buyer profile route
router.put("/profile", protect, updateBuyerProfile);

module.exports = router;
