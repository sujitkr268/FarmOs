const { fetchMandiPrices } = require("../services/marketService");

// ================= GET MARKET PRICES =================
const getMarketPrices = async (req, res) => {
  try {
    const result = await fetchMandiPrices(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Market Prices Controller Error:", error.message);
    const fallbackResult = await fetchMandiPrices({ limit: 12 });
    return res.status(200).json(fallbackResult);
  }
};

module.exports = {
  getMarketPrices,
};
