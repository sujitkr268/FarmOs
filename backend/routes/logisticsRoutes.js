const express = require("express");
const router = express.Router();
const { estimateFreight, getLogisticsVehicles } = require("../controllers/logisticsController");

// Freight estimation endpoints (supports both POST and GET)
router.post("/estimate", estimateFreight);
router.get("/estimate", estimateFreight);

// Available vehicle categories & rate lookup endpoint
router.get("/vehicles", getLogisticsVehicles);

module.exports = router;
