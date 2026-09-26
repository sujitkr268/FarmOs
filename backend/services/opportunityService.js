const { pool } = require("../config/db");
const { fetchMandiPrices } = require("./marketService");
const { geocodeLocation, getRoadRoute, calculateFreight } = require("./logisticsService");

/**
 * FarmOS Opportunity Engine Service with Smart Freight Logistics
 * & Potential Buyer / Relevant Trader Matching
 */

const convertToQuintals = (quantity, unit = "kg") => {
  const qty = parseFloat(quantity) || 1;
  const u = (unit || "kg").toLowerCase().trim();

  if (u === "kg" || u === "kilogram") return qty / 100;
  if (u === "ton" || u === "tonne") return qty * 10;
  if (u === "quintal" || u === "qtl") return qty;
  
  return qty > 50 ? qty / 100 : qty;
};

const normalizeCommodity = (commodityStr) => {
  const c = (commodityStr || "").toLowerCase().trim();
  if (c.includes("potato")) return "Potato";
  if (c.includes("rice") || c.includes("paddy") || c.includes("basmati")) return "Rice";
  if (c.includes("wheat") || c.includes("flour")) return "Wheat";
  if (c.includes("jute")) return "Jute";
  if (c.includes("tea")) return "Tea";
  if (c.includes("mango")) return "Mango";
  if (c.includes("mustard") || c.includes("oil")) return "Mustard";
  if (c.includes("ginger") || c.includes("spice")) return "Spices";
  return commodityStr.trim();
};

const findPotentialBuyers = async (crop, state = "", district = "") => {
  try {
    const normCrop = normalizeCommodity(crop);

    // 1. Fetch public traders
    const publicTradersRes = await pool.query(
      `SELECT
        id, business_name, business_type, state, district, city, mandi,
        commodities, buying_capacity, official_website, official_contact_url,
        public_phone, public_email, verification_source, source_url, source_type,
        verification_status, 'public_trader' AS category
       FROM public_traders
       WHERE verification_status IN ('source_verified', 'website_verified', 'unverified')`
    );

    // 2. Fetch verified registered FarmOS buyers
    const registeredBuyersRes = await pool.query(
      `SELECT
        id, name, business_name, role, location, state, district, mandi,
        commodities, buying_capacity, official_website, enam_reference, udyam_reference,
        show_contact_publicly, phone, email, verification_status, 'registered_buyer' AS category
       FROM users
       WHERE role = 'buyer' AND verification_status = 'verified'`
    );

    const candidates = [];

    // Process public traders
    for (const pt of publicTradersRes.rows) {
      const traderCommodities = (pt.commodities || "").toLowerCase();
      if (traderCommodities.includes(normCrop.toLowerCase()) || traderCommodities.includes(crop.toLowerCase())) {
        let score = 0;

        if (district && pt.district && pt.district.toLowerCase() === district.toLowerCase()) {
          score += 50;
        } else if (state && pt.state && pt.state.toLowerCase() === state.toLowerCase()) {
          score += 30;
        } else {
          score += 10;
        }

        if (pt.verification_status === 'source_verified') score += 30;
        else if (pt.verification_status === 'website_verified') score += 20;
        else score += 10;

        if (pt.buying_capacity) score += 10;

        candidates.push({
          id: pt.id,
          category: 'public_trader',
          business_name: pt.business_name,
          business_type: pt.business_type,
          location: `${pt.district || pt.city || pt.state}, ${pt.state}`,
          state: pt.state,
          district: pt.district,
          mandi: pt.mandi || 'N/A',
          commodities: pt.commodities,
          buying_capacity: pt.buying_capacity || 'Not specified',
          official_website: pt.official_website,
          official_contact_url: pt.official_contact_url,
          public_phone: pt.public_phone,
          public_email: pt.public_email,
          verification_source: pt.verification_source,
          source_url: pt.source_url,
          source_type: pt.source_type,
          verification_status: pt.verification_status,
          badge_label: pt.verification_status === 'source_verified'
            ? '🟢 FarmOS Verified Business'
            : (pt.verification_status === 'website_verified' ? '🌐 Public Business Info' : '🏢 Public Listing'),
          match_score: score,
          wording_label: 'Potential Buyer / Relevant Trader'
        });
      }
    }

    // Process registered buyers
    for (const rb of registeredBuyersRes.rows) {
      const buyerCommodities = (rb.commodities || "").toLowerCase();
      if (buyerCommodities.includes(normCrop.toLowerCase()) || buyerCommodities.includes(crop.toLowerCase())) {
        let score = 20;

        const buyerDistrict = rb.district || rb.location || "";
        const buyerState = rb.state || rb.location || "";

        if (district && buyerDistrict.toLowerCase().includes(district.toLowerCase())) {
          score += 50;
        } else if (state && buyerState.toLowerCase().includes(state.toLowerCase())) {
          score += 30;
        } else {
          score += 10;
        }

        score += 30; // Verified buyer

        const showContact = Boolean(rb.show_contact_publicly);

        candidates.push({
          id: rb.id,
          category: 'registered_buyer',
          business_name: rb.business_name || rb.name + " Traders",
          contact_person: rb.name,
          location: `${rb.district || rb.location}, ${rb.state || ''}`,
          state: rb.state || rb.location,
          district: rb.district || '',
          mandi: rb.mandi || 'N/A',
          commodities: rb.commodities,
          buying_capacity: rb.buying_capacity || 'Not specified',
          official_website: rb.official_website || null,
          has_enam_ref: Boolean(rb.enam_reference),
          has_udyam_ref: Boolean(rb.udyam_reference),
          verification_status: 'verified',
          badge_label: '🔵 FarmOS Registered Buyer',
          public_phone: showContact ? rb.phone : null,
          public_email: showContact ? rb.email : null,
          show_contact_publicly: showContact,
          match_score: score,
          wording_label: 'Potential Buyer / Relevant Trader'
        });
      }
    }

    // Sort candidates by match score
    candidates.sort((a, b) => b.match_score - a.match_score);

    return candidates.slice(0, 6);
  } catch (err) {
    console.error("Error finding potential buyers:", err.message);
    return [];
  }
};

const opportunityCache = new Map();
const OPP_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL

const evaluateOpportunities = async (params = {}) => {
  const crop = params.crop || params.commodity || "Potato";
  const quantityInput = params.quantity !== undefined ? params.quantity : 500;
  const unitInput = params.unit || "kg";
  const state = params.state || "West Bengal";
  const district = params.district || "";
  const farmerLocation = params.location || params.origin || "";
  const requestedVehicleType = params.vehicle_type || "";

  const cacheKey = `${crop.toLowerCase()}_${quantityInput}_${unitInput}_${state.toLowerCase()}_${district.toLowerCase()}_${farmerLocation.toLowerCase()}`;
  const now = Date.now();

  if (opportunityCache.has(cacheKey)) {
    const cached = opportunityCache.get(cacheKey);
    if (now - cached.timestamp < OPP_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const qtyInQuintals = convertToQuintals(quantityInput, unitInput);
  const qtyInKg = Math.round(qtyInQuintals * 100);

  // Fetch real market records from data.gov.in service
  let marketResult = await fetchMandiPrices({
    state: state,
    district: district,
    commodity: crop,
    limit: 15
  });

  if ((!marketResult.data || marketResult.data.length === 0) && district) {
    marketResult = await fetchMandiPrices({
      state: state,
      commodity: crop,
      limit: 15
    });
  }

  if (!marketResult.data || marketResult.data.length === 0) {
    marketResult = await fetchMandiPrices({
      commodity: crop,
      limit: 15
    });
  }

  const rawRecords = marketResult.data || [];

  // Find potential buyers matching this crop and region
  const potentialBuyers = await findPotentialBuyers(crop, state, district);

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
      potential_buyers: potentialBuyers,
      message: `No active mandi price records found matching crop "${crop}".`
    };
  }

  const originInput = farmerLocation || (district ? `${district}, ${state}` : state);
  const originCoords = await geocodeLocation(originInput);

  const maxModalPrice = Math.max(...rawRecords.map((r) => Number(r.modal_price) || 0), 1);

  const processedMarkets = await Promise.all(
    rawRecords.map(async (item) => {
      const modalPrice = Number(item.modal_price) || 0;
      const minPrice = Number(item.min_price) || 0;
      const maxPrice = Number(item.max_price) || 0;

      const estimatedGrossValue = Math.round(qtyInQuintals * modalPrice);

      const priceScore = maxModalPrice > 0 ? (modalPrice / maxModalPrice) * 70 : 0;
      const consistencyRatio = (maxPrice > 0 && minPrice > 0) ? Math.min(1, minPrice / maxPrice) : 0.8;
      const rangeConsistencyScore = consistencyRatio * 30;

      const farmosOpportunityScore = Math.min(
        100,
        Math.max(0, Math.round(priceScore + rangeConsistencyScore))
      );

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

  const hasLogisticsData = processedMarkets.some((m) => m.distance_km !== null);

  if (hasLogisticsData) {
    processedMarkets.sort((a, b) => {
      if (b.estimated_net_return !== a.estimated_net_return) {
        return b.estimated_net_return - a.estimated_net_return;
      }
      return b.farmos_opportunity_score - a.farmos_opportunity_score;
    });
  } else {
    processedMarkets.sort((a, b) => b.farmos_opportunity_score - a.farmos_opportunity_score);
  }

  const recommended = processedMarkets[0];
  const hasLocation = Boolean(farmerLocation || district);

  const warnings = [
    "Estimated opportunity based on reported Agmarknet benchmark prices, not a guaranteed profit.",
    "Potential buyers/traders listed below are matching relevant businesses based on commodity and location. FarmOS does not guarantee transactions."
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

  const finalResult = {
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
    potential_buyers: potentialBuyers,
    scoring_documentation: {
      score_name: "FarmOS Opportunity Score & Net Return Ranking",
      scale: "0 - 100",
      price_ratio_points: "Up to 70 points based on modal price relative to peak regional market.",
      price_range_consistency_points: "Up to 30 points based on min/max price range consistency indicator.",
      net_return_formula: "Estimated Net Return = Estimated Gross Revenue - Estimated Freight Cost"
    }
  };

  opportunityCache.set(cacheKey, { timestamp: Date.now(), data: finalResult });
  return finalResult;
};

module.exports = {
  evaluateOpportunities,
  convertToQuintals,
  findPotentialBuyers
};
