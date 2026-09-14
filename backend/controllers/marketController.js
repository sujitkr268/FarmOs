const { fetchMandiPrices } = require("../services/marketService");

// ================= GET MARKET PRICES =================
const getMarketPrices = async (req, res) => {
  try {
    const result = await fetchMandiPrices(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Market Prices Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Mandi market prices",
      error: error.message,
    });
  }
};

module.exports = {
  getMarketPrices,
};
