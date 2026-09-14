const express = require("express");
const router = express.Router();
const { getMarketPrices } = require("../controllers/marketController");

// ================= GET MARKET PRICES =================
// Public endpoint for querying Mandi commodity prices
router.get("/prices", getMarketPrices);

module.exports = router;
