const { pool } = require("../config/db");
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

// ================= GET DEMAND VS SUPPLY FOR COMMODITY =================
const getDemandSupply = async (req, res) => {
  try {
    const commodity = (req.query.commodity || "").trim();
    if (!commodity) {
      return res.status(200).json({
        success: true,
        commodity: "",
        supply_kg: 0,
        demand_kg: 0,
        active_harvests_count: 0,
        active_buyers_count: 0
      });
    }

    // 1. Query active harvests for commodity
    const harvestsRes = await pool.query(
      `SELECT quantity, unit FROM harvests WHERE LOWER(crop_name) LIKE LOWER($1) OR LOWER($1) LIKE LOWER(crop_name)`,
      [`%${commodity}%`]
    );

    let totalSupplyKg = 0;
    for (const row of harvestsRes.rows) {
      const q = parseFloat(row.quantity) || 0;
      const u = (row.unit || "kg").toLowerCase().trim();
      if (u === "ton" || u === "tonne" || u === "mt") {
        totalSupplyKg += q * 1000;
      } else if (u === "quintal" || u === "qtl") {
        totalSupplyKg += q * 100;
      } else {
        totalSupplyKg += q;
      }
    }

    // 2. Query registered buyers and public traders matching commodity
    const [buyersRes, tradersRes] = await Promise.all([
      pool.query(
        `SELECT buying_capacity, commodities FROM users WHERE role = 'buyer' AND (LOWER(commodities) LIKE LOWER($1) OR LOWER($1) LIKE LOWER(commodities))`,
        [`%${commodity}%`]
      ),
      pool.query(
        `SELECT buying_capacity, commodities FROM public_traders WHERE LOWER(commodities) LIKE LOWER($1) OR LOWER($1) LIKE LOWER(commodities)`,
        [`%${commodity}%`]
      )
    ]);

    const parseCapacityToKg = (capacityStr) => {
      if (!capacityStr) return 5000;
      const str = String(capacityStr).toLowerCase();
      const numMatch = str.match(/([\d,]+(\.\d+)?)/);
      if (!numMatch) return 5000;
      const val = parseFloat(numMatch[1].replace(/,/g, ""));
      if (isNaN(val)) return 5000;
      if (str.includes("mt") || str.includes("ton") || str.includes("tonne")) {
        return val * 1000;
      }
      if (str.includes("quintal") || str.includes("qtl")) {
        return val * 100;
      }
      return val;
    };

    let totalDemandKg = 0;
    const activeBuyersCount = buyersRes.rows.length + tradersRes.rows.length;

    for (const b of buyersRes.rows) {
      totalDemandKg += parseCapacityToKg(b.buying_capacity);
    }
    for (const t of tradersRes.rows) {
      totalDemandKg += parseCapacityToKg(t.buying_capacity);
    }

    return res.status(200).json({
      success: true,
      commodity,
      supply_kg: Math.round(totalSupplyKg),
      demand_kg: Math.round(totalDemandKg),
      active_harvests_count: harvestsRes.rows.length,
      active_buyers_count: activeBuyersCount
    });
  } catch (error) {
    console.error("Get Demand Supply Controller Error:", error.message);
    return res.status(200).json({
      success: false,
      commodity: req.query.commodity || "",
      supply_kg: 0,
      demand_kg: 0,
      active_harvests_count: 0,
      active_buyers_count: 0
    });
  }
};

module.exports = {
  getMarketPrices,
  getMarketHistory,
  getDemandSupply
};
