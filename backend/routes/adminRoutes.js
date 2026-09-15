const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllHarvests,
  getAllOrders,
  getDashboardStats
} = require("../controllers/adminController");

const {
  getPendingBuyers,
  verifyBuyer,
  rejectBuyer
} = require("../controllers/buyerController");

const {
  createPublicTrader,
  updatePublicTrader,
  deletePublicTrader
} = require("../controllers/traderController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// All routes require Admin role
router.use(protect, authorizeRoles("admin"));

// Dashboard Stats & Lists
router.get("/users", getAllUsers);
router.get("/harvests", getAllHarvests);
router.get("/orders", getAllOrders);
router.get("/dashboard", getDashboardStats);

// Registered Buyer Approvals
router.get("/buyers/pending", getPendingBuyers);
router.put("/buyers/:id/verify", verifyBuyer);
router.put("/buyers/:id/reject", rejectBuyer);

// Public Trader Directory Management
router.post("/traders", createPublicTrader);
router.put("/traders/:id", updatePublicTrader);
router.delete("/traders/:id", deletePublicTrader);

module.exports = router;
