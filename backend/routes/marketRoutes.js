const express = require("express");
const router = express.Router();
const { getMarketPrices, getMarketHistory, getDemandSupply } = require("../controllers/marketController");

// ================= GET MARKET PRICES =================
// Public endpoint for querying Mandi commodity prices
router.get("/prices", getMarketPrices);

// ================= GET HISTORICAL MARKET PRICES =================
// Public endpoint for querying historical commodity trends
router.get("/history", getMarketHistory);

// ================= GET REGIONAL DEMAND & SUPPLY =================
// Public endpoint for calculating regional buyer demand vs harvest supply
router.get("/demand-supply", getDemandSupply);

module.exports = router;
