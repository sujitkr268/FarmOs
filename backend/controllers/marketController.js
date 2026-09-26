const { fetchMandiPrices } = require("../services/marketService");

// ================= GET MARKET PRICES =================
const getMarketPrices = async (req, res) => {
  try {
    const result = await fetchMandiPrices(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Market Prices Controller Error:", error.message);
    try {
      // Fallback invocation without strict query params if error occurs
      const fallbackResult = await fetchMandiPrices({ limit: 12 });
      return res.status(200).json(fallbackResult);
    } catch (fallbackError) {
      return res.status(500).json({
        success: false,
        message: "Unable to retrieve Mandi market prices",
        error: fallbackError.message || error.message,
      });
    }
  }
};

module.exports = {
  getMarketPrices,
};
