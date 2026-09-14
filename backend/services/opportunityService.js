const { fetchMandiPrices } = require("./marketService");

/**
 * FarmOS Opportunity Engine Service
 * 
 * Computes deterministic market comparisons, gross value estimates,
 * and FarmOS Opportunity Scores (0-100) based on real Agmarknet mandi data.
 */

/**
 * Helper to normalize harvest quantity to standard quintals (1 quintal = 100 kg)
 */
const convertToQuintals = (quantity, unit = "kg") => {
  const qty = parseFloat(quantity) || 1;
  const u = (unit || "kg").toLowerCase().trim();

  if (u === "kg" || u === "kilogram") return qty / 100;
  if (u === "ton" || u === "tonne") return qty * 10;
  if (u === "quintal" || u === "qtl") return qty;
  
  // Default heuristic: if quantity > 50, assume kg, else assume quintal
  return qty > 50 ? qty / 100 : qty;
};

/**
 * Evaluate Market Opportunities for a given crop harvest
 */
const evaluateOpportunities = async (params = {}) => {
  const crop = params.crop || params.commodity || "Potato";
  const quantityInput = params.quantity !== undefined ? params.quantity : 500;
  const unitInput = params.unit || "kg";
  const state = params.state || "West Bengal";
  const district = params.district || "";
  const farmerLocation = params.location || "";

  const qtyInQuintals = convertToQuintals(quantityInput, unitInput);

  // Fetch real market records from data.gov.in service
  let marketResult = await fetchMandiPrices({
    state: state,
    district: district,
    commodity: crop,
    limit: 15
  });

  // Fallback: If no records for specific district, fetch state-wide
  if ((!marketResult.data || marketResult.data.length === 0) && district) {
    marketResult = await fetchMandiPrices({
      state: state,
      commodity: crop,
      limit: 15
    });
  }

  // Second Fallback: If no records for state/crop, search crop only
  if (!marketResult.data || marketResult.data.length === 0) {
    marketResult = await fetchMandiPrices({
      commodity: crop,
      limit: 15
    });
  }

  const rawRecords = marketResult.data || [];

  if (rawRecords.length === 0) {
    return {
      success: true,
      data_source: "Govt of India Agmarknet (data.gov.in)",
      commodity: crop,
      quantity_quintals: qtyInQuintals,
      user_quantity: quantityInput,
      user_unit: unitInput,
      user_location: farmerLocation || state,
      has_location: Boolean(farmerLocation || district),
      total_markets_analyzed: 0,
      recommended: null,
      comparison: [],
      message: `No active mandi price records found matching crop "${crop}".`
    };
  }

  // Find peak modal price in dataset for relative scoring
  const maxModalPrice = Math.max(...rawRecords.map((r) => Number(r.modal_price) || 0), 1);

  // Process & Score each market deterministically
  const processedMarkets = rawRecords.map((item) => {
    const modalPrice = Number(item.modal_price) || 0;
    const minPrice = Number(item.min_price) || 0;
    const maxPrice = Number(item.max_price) || 0;

    const estimatedGrossValue = Math.round(qtyInQuintals * modalPrice);

    /**
     * FarmOS Opportunity Score Formula (0 - 100):
     * 1. Price Ratio Score (0 to 70 points):
     *    Relative strength of modal price vs highest modal price in dataset.
     *    Formula: (modal_price / maxModalPrice) * 70
     * 
     * 2. Price-Range Consistency Indicator (0 to 30 points):
     *    Measures price spread consistency (min_price / max_price).
     *    Higher ratio means narrower spread and consistent price floor.
     *    Formula: (min_price / max_price) * 30
     */
    const priceScore = maxModalPrice > 0 ? (modalPrice / maxModalPrice) * 70 : 0;
    const consistencyRatio = (maxPrice > 0 && minPrice > 0) ? Math.min(1, minPrice / maxPrice) : 0.8;
    const rangeConsistencyScore = consistencyRatio * 30;

    const farmosOpportunityScore = Math.min(
      100,
      Math.max(0, Math.round(priceScore + rangeConsistencyScore))
    );

    return {
      market: item.market || "Unknown APMC Mandi",
      district: item.district || item.state || "N/A",
      state: item.state || "India",
      commodity: item.commodity || crop,
      variety: item.variety || "Standard",
      grade: item.grade || "FAQ",
      arrival_date: item.arrival_date || "Today",
      modal_price: modalPrice,
      min_price: minPrice,
      max_price: maxPrice,
      estimated_gross_value: estimatedGrossValue,
      
      // Fields unavailable from data.gov.in API must be explicitly marked "Not available"
      arrival_quantity: "Not available",
      traded_quantity: "Not available",
      estimated_distance: "Not available",
      estimated_transport_cost: "Not available",
      estimated_net_value: estimatedGrossValue, // Noted as gross before transport
      
      farmos_opportunity_score: farmosOpportunityScore
    };
  });

  // Sort markets by FarmOS Opportunity Score (highest first)
  processedMarkets.sort((a, b) => b.farmos_opportunity_score - a.farmos_opportunity_score);

  const recommended = processedMarkets[0];
  const hasLocation = Boolean(farmerLocation || district);

  const warnings = [
    "Estimated opportunity based on reported Agmarknet benchmark prices, not a guaranteed profit.",
    "Transportation freight costs and local APMC mandi fees are marked as 'Not available' and may vary."
  ];

  if (!hasLocation) {
    warnings.push("Current price comparison is available. Add your location to estimate location-dependent factors.");
  }

  const whyBullets = [
    `Highest reported benchmark modal price of ₹${recommended.modal_price.toLocaleString()}/quintal in the region.`,
    `High price-range consistency indicator (Min ₹${recommended.min_price.toLocaleString()} to Max ₹${recommended.max_price.toLocaleString()}/qtl).`,
    `Estimated gross return of ₹${recommended.estimated_gross_value.toLocaleString()} for ${qtyInQuintals} quintal (${quantityInput} ${unitInput}).`
  ];

  return {
    success: true,
    data_source: "Govt of India Agmarknet (data.gov.in)",
    commodity: crop,
    quantity_quintals: qtyInQuintals,
    user_quantity: quantityInput,
    user_unit: unitInput,
    user_location: farmerLocation || district || state,
    has_location: hasLocation,
    total_markets_analyzed: processedMarkets.length,
    recommended: {
      market: recommended.market,
      district: recommended.district,
      state: recommended.state,
      commodity: recommended.commodity,
      variety: recommended.variety,
      grade: recommended.grade,
      modal_price: recommended.modal_price,
      estimated_gross_value: recommended.estimated_gross_value,
      farmos_opportunity_score: recommended.farmos_opportunity_score,
      why: whyBullets,
      warnings: warnings
    },
    comparison: processedMarkets,
    scoring_documentation: {
      score_name: "FarmOS Opportunity Score",
      scale: "0 - 100",
      price_ratio_points: "Up to 70 points based on modal price relative to peak regional market.",
      price_range_consistency_points: "Up to 30 points based on min/max price range consistency indicator."
    }
  };
};

module.exports = {
  evaluateOpportunities,
  convertToQuintals
};
