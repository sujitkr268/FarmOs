const express = require("express");
const router = express.Router();
const { compareOpportunities } = require("../controllers/opportunityController");

// ================= COMPARE MARKET OPPORTUNITIES =================
// Accepts GET or POST queries for comparing mandi market opportunities
router.get("/compare", compareOpportunities);
router.post("/compare", compareOpportunities);

module.exports = router;
