const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllHarvests,
  getAllOrders,
  getDashboardStats,
  getPendingFarmers,
  verifyFarmer,
  rejectFarmer
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

// Registered Farmer Approvals
router.get("/farmers/pending", getPendingFarmers);
router.put("/farmers/:id/verify", verifyFarmer);
router.put("/farmers/:id/reject", rejectFarmer);

// Public Trader Directory Management
router.post("/traders", createPublicTrader);
router.put("/traders/:id", updatePublicTrader);
router.delete("/traders/:id", deletePublicTrader);

module.exports = router;
