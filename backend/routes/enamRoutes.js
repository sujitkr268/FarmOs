const express = require("express");
const router = express.Router();
const { getEnamInfo } = require("../controllers/enamController");

// ================= GET e-NAM MARKET INFORMATION =================
// Public endpoint for retrieving official e-NAM overview & guidance
router.get("/info", getEnamInfo);

module.exports = router;
