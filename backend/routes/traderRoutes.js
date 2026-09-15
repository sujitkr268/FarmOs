const express = require("express");
const router = express.Router();

const {
  getPublicTraders,
  getPublicTraderById,
  createPublicTrader,
  updatePublicTrader,
  deletePublicTrader
} = require("../controllers/traderController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getPublicTraders);
router.get("/:id", getPublicTraderById);

// Admin-only management routes
router.post("/", protect, authorizeRoles("admin"), createPublicTrader);
router.put("/:id", protect, authorizeRoles("admin"), updatePublicTrader);
router.delete("/:id", protect, authorizeRoles("admin"), deletePublicTrader);

module.exports = router;
