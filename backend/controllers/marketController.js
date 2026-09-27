const { fetchMandiPrices } = require("../services/marketService");
const { getHistoricalPrices } = require("../models/MarketPriceHistory");

// High-performance query cache for historical price trends (TTL: 10 mins)
const historyCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

// ================= GET CURRENT MARKET PRICES =================
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

// ================= GET HISTORICAL MARKET PRICES =================
const getMarketHistory = async (req, res) => {
  try {
    const { commodity, state, district, market, from, to } = req.query;

    const commName = (commodity || "").trim();
    const stateName = (state || "").trim();
    const mktName = (market || "").trim();

    const cacheKey = `hist_${commName.toLowerCase()}_${stateName.toLowerCase()}_${(district || "").toLowerCase()}_${mktName.toLowerCase()}_${from || ""}_${to || ""}`;
    const now = Date.now();

    if (historyCache.has(cacheKey)) {
      const cached = historyCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        return res.status(200).json(cached.data);
      }
    }

    const rows = await getHistoricalPrices({
      commodity: commName,
      state: stateName,
      district,
      market: mktName,
      from,
      to
    });

    const response = {
      commodity: commName || "All Commodities",
      state: stateName || "All States",
      market: mktName || null,
      unit: "₹/quintal",
      source: "Agmarknet",
      records: rows || []
    };

    historyCache.set(cacheKey, { timestamp: now, data: response });
    return res.status(200).json(response);
  } catch (error) {
    console.error("Get Market History Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch historical market prices",
      commodity: req.query.commodity || null,
      state: req.query.state || null,
      market: req.query.market || null,
      unit: "₹/quintal",
      source: "Agmarknet",
      records: []
    });
  }
};

module.exports = {
  getMarketPrices,
  getMarketHistory
};
