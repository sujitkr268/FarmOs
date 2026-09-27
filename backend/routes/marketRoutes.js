const express = require("express");
const router = express.Router();
const { getMarketPrices, getMarketHistory } = require("../controllers/marketController");

// ================= GET MARKET PRICES =================
// Public endpoint for querying Mandi commodity prices
router.get("/prices", getMarketPrices);

// ================= GET HISTORICAL MARKET PRICES =================
// Public endpoint for querying historical commodity trends
router.get("/history", getMarketHistory);

module.exports = router;
