const { estimateFreightLogistics, LOGISTICS_RATES } = require("../services/logisticsService");

/**
 * POST /api/logistics/estimate
 * GET /api/logistics/estimate
 * Calculates road routing distance, vehicle selection, and estimated freight costs.
 */
const estimateFreight = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body };
    const result = await estimateFreightLogistics(params);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error("Error in estimateFreight controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error calculating freight logistics.",
      error: error.message
    });
  }
};

/**
 * GET /api/logistics/vehicles
 * Returns available vehicle categories and rates.
 */
const getLogisticsVehicles = (req, res) => {
  return res.json({
    success: true,
    data: LOGISTICS_RATES
  });
};

module.exports = {
  estimateFreight,
  getLogisticsVehicles
};
