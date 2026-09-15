const { fetchMandiPrices } = require("./marketService");
const { geocodeLocation, getRoadRoute, calculateFreight } = require("./logisticsService");

/**
 * FarmOS Opportunity Engine Service with Smart Freight Logistics
 * 
 * Computes deterministic market comparisons, gross value estimates,
 * road transport freight cost estimates, net return calculation,
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
  const farmerLocation = params.location || params.origin || "";
  const requestedVehicleType = params.vehicle_type || "";

  const qtyInQuintals = convertToQuintals(quantityInput, unitInput);
  const qtyInKg = Math.round(qtyInQuintals * 100);

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

  // Determine origin coordinates for freight logistics calculation if location is provided
  const originInput = farmerLocation || (district ? `${district}, ${state}` : state);
  const originCoords = await geocodeLocation(originInput);

  // Find peak modal price in dataset for relative scoring
  const maxModalPrice = Math.max(...rawRecords.map((r) => Number(r.modal_price) || 0), 1);

  // Process & Score each market deterministically
  const processedMarkets = await Promise.all(
    rawRecords.map(async (item) => {
      const modalPrice = Number(item.modal_price) || 0;
      const minPrice = Number(item.min_price) || 0;
      const maxPrice = Number(item.max_price) || 0;

      const estimatedGrossValue = Math.round(qtyInQuintals * modalPrice);

      /**
       * FarmOS Opportunity Score Formula (0 - 100):
       * 1. Price Ratio Score (0 to 70 points):
       *    Relative strength of modal price vs highest modal price in dataset.
       * 2. Price-Range Consistency Indicator (0 to 30 points):
       *    Measures price spread consistency (min_price / max_price).
       */
      const priceScore = maxModalPrice > 0 ? (modalPrice / maxModalPrice) * 70 : 0;
      const consistencyRatio = (maxPrice > 0 && minPrice > 0) ? Math.min(1, minPrice / maxPrice) : 0.8;
      const rangeConsistencyScore = consistencyRatio * 30;

      const farmosOpportunityScore = Math.min(
        100,
        Math.max(0, Math.round(priceScore + rangeConsistencyScore))
      );

      // Freight Calculation
      let freight = null;
      if (originCoords) {
        const destInput = `${item.market}, ${item.district || item.state}`;
        let destCoords = await geocodeLocation(destInput);
        if (!destCoords && item.market) {
          destCoords = await geocodeLocation(item.market);
        }

        if (destCoords) {
          const routeInfo = await getRoadRoute(originCoords, destCoords);
          if (routeInfo) {
            freight = calculateFreight(
              routeInfo.distance_km,
              routeInfo.duration_minutes,
              qtyInKg,
              requestedVehicleType
            );
          }
        }
      }

      const estimatedFreightCost = freight ? freight.estimated_freight_cost : null;
      const estimatedNetReturn = freight ? (estimatedGrossValue - estimatedFreightCost) : estimatedGrossValue;

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
        
        // Logistics & Freight fields
        estimated_distance: freight ? `${freight.distance_km} km` : "Not available",
        distance_km: freight ? freight.distance_km : null,
        travel_time_mins: freight ? freight.duration_minutes : null,
        estimated_freight_cost: estimatedFreightCost !== null ? estimatedFreightCost : null,
        estimated_transport_cost: estimatedFreightCost !== null ? estimatedFreightCost : "Not available",
        estimated_net_return: estimatedNetReturn,
        estimated_net_value: estimatedNetReturn,
        vehicle_type: freight ? freight.vehicle_type : null,
        vehicle_name: freight ? freight.vehicle_name : null,
        vehicles_required: freight ? freight.vehicles_required : null,
        cost_per_kg: freight ? freight.cost_per_kg : null,
        
        arrival_quantity: "Not available",
        traded_quantity: "Not available",
        farmos_opportunity_score: farmosOpportunityScore
      };
    })
  );

  // Check if logistics estimates were calculated
  const hasLogisticsData = processedMarkets.some((m) => m.distance_km !== null);

  if (hasLogisticsData) {
    // Re-rank candidate markets by Estimated Net Return (highest profit after freight transport cost)
    processedMarkets.sort((a, b) => {
      if (b.estimated_net_return !== a.estimated_net_return) {
        return b.estimated_net_return - a.estimated_net_return;
      }
      return b.farmos_opportunity_score - a.farmos_opportunity_score;
    });
  } else {
    // Fallback: Sort markets by FarmOS Opportunity Score
    processedMarkets.sort((a, b) => b.farmos_opportunity_score - a.farmos_opportunity_score);
  }

  const recommended = processedMarkets[0];
  const hasLocation = Boolean(farmerLocation || district);

  const warnings = [
    "Estimated opportunity based on reported Agmarknet benchmark prices, not a guaranteed profit.",
    "Estimated Freight Costs are calculated using standard transport rates and road distance models; actual quotes may vary."
  ];

  if (!hasLocation) {
    warnings.push("Location not specified. Provide your location to compute estimated road distance and freight cost.");
  }

  const whyBullets = [];
  if (recommended.estimated_freight_cost !== null) {
    whyBullets.push(
      `Highest estimated net return of ₹${recommended.estimated_net_return.toLocaleString()} after deducting Estimated Freight Cost of ₹${recommended.estimated_freight_cost.toLocaleString()}.`,
      `Benchmark modal price of ₹${recommended.modal_price.toLocaleString()}/quintal in ${recommended.market}.`,
      `Estimated transport via ${recommended.vehicles_required} ${recommended.vehicle_name} (${recommended.estimated_distance}, approx ${recommended.travel_time_mins} mins).`
    );
  } else {
    whyBullets.push(
      `Highest reported benchmark modal price of ₹${recommended.modal_price.toLocaleString()}/quintal in the region.`,
      `High price-range consistency indicator (Min ₹${recommended.min_price.toLocaleString()} to Max ₹${recommended.max_price.toLocaleString()}/qtl).`,
      `Estimated gross return of ₹${recommended.estimated_gross_value.toLocaleString()} for ${qtyInQuintals} quintal (${quantityInput} ${unitInput}).`
    );
  }

  return {
    success: true,
    data_source: "Govt of India Agmarknet (data.gov.in)",
    commodity: crop,
    quantity_quintals: qtyInQuintals,
    quantity_kg: qtyInKg,
    user_quantity: quantityInput,
    user_unit: unitInput,
    user_location: farmerLocation || district || state,
    has_location: hasLocation,
    logistics_enabled: hasLogisticsData,
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
      estimated_freight_cost: recommended.estimated_freight_cost,
      estimated_net_return: recommended.estimated_net_return,
      estimated_distance: recommended.estimated_distance,
      travel_time_mins: recommended.travel_time_mins,
      vehicle_name: recommended.vehicle_name,
      vehicles_required: recommended.vehicles_required,
      farmos_opportunity_score: recommended.farmos_opportunity_score,
      why: whyBullets,
      warnings: warnings
    },
    comparison: processedMarkets,
    scoring_documentation: {
      score_name: "FarmOS Opportunity Score & Net Return Ranking",
      scale: "0 - 100",
      price_ratio_points: "Up to 70 points based on modal price relative to peak regional market.",
      price_range_consistency_points: "Up to 30 points based on min/max price range consistency indicator.",
      net_return_formula: "Estimated Net Return = Estimated Gross Revenue - Estimated Freight Cost"
    }
  };
};

module.exports = {
  evaluateOpportunities,
  convertToQuintals
};
