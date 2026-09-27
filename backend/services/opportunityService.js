const { pool } = require("../config/db");
const { fetchMandiPrices } = require("./marketService");
const { geocodeLocation, getRoadRoute, calculateFreight } = require("./logisticsService");

/**
 * FarmOS Opportunity Engine Service
 * Provides performance-optimized, grade-aware buyer matching
 * & explainable multi-factor Opportunity Scoring (0-100)
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

/**
 * Grade Compatibility Checker
 * Evaluates farmer's harvest grade vs buyer's required grade
 */
const checkGradeCompatibility = (farmerGradeStr, buyerRequiredGradeStr) => {
  const fGrade = (farmerGradeStr || "FAQ Grade").trim();
  const bGrade = (buyerRequiredGradeStr || "Any").trim();
  const fLower = fGrade.toLowerCase();
  const bLower = bGrade.toLowerCase();

  // If buyer does not specify grade requirement (Any, All, None, N/A, empty) -> Farmer is NOT rejected
  if (!bLower || bLower === "any" || bLower === "all" || bLower === "none" || bLower === "n/a") {
    return {
      compatible: true,
      matchType: "any_accepted",
      reason: "Buyer accepts any grade"
    };
  }

  // Exact match (e.g. Grade A vs Grade A)
  if (fLower === bLower) {
    return {
      compatible: true,
      matchType: "exact_match",
      reason: `Farmer grade (${fGrade}) matches buyer required grade (${bGrade})`
    };
  }

  // Buyer accepts A/B or Grade A/B
  if ((bLower.includes("a") && bLower.includes("b")) || bLower === "a/b" || bLower === "grade a/b") {
    if (fLower.includes("a") || fLower.includes("b") || fLower.includes("faq") || fLower.includes("super")) {
      return {
        compatible: true,
        matchType: "range_match",
        reason: `Farmer grade (${fGrade}) is within buyer's accepted range (${bGrade})`
      };
    }
  }

  // Superior farmer grade (e.g., Grade A vs Grade B / FAQ Grade)
  if ((fLower.includes("a") || fLower.includes("super")) && (fLower !== bLower) && (bLower.includes("b") || bLower.includes("faq"))) {
    return {
      compatible: true,
      matchType: "superior_grade",
      reason: `Farmer grade (${fGrade}) exceeds buyer required grade (${bGrade})`
    };
  }

  // FAQ Grade standard match
  if (fLower.includes("faq") && bLower.includes("faq")) {
    return {
      compatible: true,
      matchType: "faq_match",
      reason: "FAQ Grade standard match"
    };
  }

  // Incompatible grade match
  return {
    compatible: false,
    matchType: "grade_mismatch",
    reason: `Farmer grade (${fGrade}) does not meet buyer required grade (${bGrade})`
  };
};

/**
 * Find potential buyers for crop, region, and optional farmer grade
 */
const findPotentialBuyers = async (crop, state = "", district = "", farmerGrade = "FAQ Grade") => {
  try {
    const normCrop = normalizeCommodity(crop);

    // Parallel query database for public traders and registered buyers
    const [publicTradersRes, registeredBuyersRes] = await Promise.all([
      pool.query(
        `SELECT
          id, business_name, business_type, state, district, city, mandi,
          commodities, buying_capacity, official_website, official_contact_url,
          public_phone, public_email, verification_source, source_url, source_type,
          verification_status, 'public_trader' AS category
         FROM public_traders
         WHERE verification_status IN ('source_verified', 'website_verified', 'unverified')`
      ),
      pool.query(
        `SELECT
          id, name, business_name, role, location, state, district, mandi,
          commodities, buying_capacity, required_grade, official_website, enam_reference, udyam_reference,
          show_contact_publicly, phone, email, verification_status, 'registered_buyer' AS category
         FROM users
         WHERE role = 'buyer' AND verification_status = 'verified'`
      )
    ]);

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

        // Public traders default to accepting standard grades
        const gradeComp = checkGradeCompatibility(farmerGrade, "Any");

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
          required_grade: 'Any',
          grade_compatible: gradeComp.compatible,
          grade_match_reason: gradeComp.reason,
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

    // Process registered buyers with Grade-Aware Matching
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

        score += 30; // Verified buyer base score

        // Grade compatibility evaluation
        const buyerRequiredGrade = rb.required_grade || "Any";
        const gradeComp = checkGradeCompatibility(farmerGrade, buyerRequiredGrade);

        if (gradeComp.compatible) {
          score += 20; // Grade compatible bonus
        } else {
          score -= 30; // Grade mismatch penalty
        }

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
          required_grade: buyerRequiredGrade,
          grade_compatible: gradeComp.compatible,
          grade_match_reason: gradeComp.reason,
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
  const farmerGrade = params.grade || params.quality || "FAQ Grade";
  const state = params.state || "West Bengal";
  const district = params.district || "";
  const farmerLocation = params.location || params.origin || "";
  const requestedVehicleType = params.vehicle_type || "";

  const cacheKey = `${crop.toLowerCase()}_${quantityInput}_${unitInput}_${farmerGrade.toLowerCase()}_${state.toLowerCase()}_${district.toLowerCase()}_${farmerLocation.toLowerCase()}`;
  const now = Date.now();

  if (opportunityCache.has(cacheKey)) {
    const cached = opportunityCache.get(cacheKey);
    if (now - cached.timestamp < OPP_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const qtyInQuintals = convertToQuintals(quantityInput, unitInput);
  const qtyInKg = Math.round(qtyInQuintals * 100);

  // Parallelize market prices query and potential buyer search
  const [marketResult, potentialBuyers] = await Promise.all([
    (async () => {
      let res = await fetchMandiPrices({ state, district, commodity: crop, limit: 15 });
      if ((!res.data || res.data.length === 0) && district) {
        res = await fetchMandiPrices({ state, commodity: crop, limit: 15 });
      }
      if (!res.data || res.data.length === 0) {
        res = await fetchMandiPrices({ commodity: crop, limit: 15 });
      }
      return res;
    })(),
    findPotentialBuyers(crop, state, district, farmerGrade)
  ]);

  const rawRecords = marketResult.data || [];

  // INSUFFICIENT DATA HANDLING (STEP 13)
  if (rawRecords.length === 0) {
    const insufficientResult = {
      success: true,
      data_source: "Govt of India Agmarknet (data.gov.in)",
      commodity: crop,
      farmer_grade: farmerGrade,
      quantity_quintals: qtyInQuintals,
      user_quantity: quantityInput,
      user_unit: unitInput,
      user_location: farmerLocation || state,
      has_location: Boolean(farmerLocation || district),
      total_markets_analyzed: 0,
      score_status: "insufficient_data",
      opportunityScore: null,
      recommendation: false,
      reasons: [`No active mandi price records found matching crop "${crop}". Score unavailable due to insufficient market data.`],
      recommended: null,
      comparison: [],
      potential_buyers: potentialBuyers,
      message: `No active mandi price records found matching crop "${crop}".`
    };
    opportunityCache.set(cacheKey, { timestamp: Date.now(), data: insufficientResult });
    return insufficientResult;
  }

  const originInput = farmerLocation || (district ? `${district}, ${state}` : state);
  const originCoords = await geocodeLocation(originInput);

  const maxModalPrice = Math.max(...rawRecords.map((r) => Number(r.modal_price) || 0), 1);

  // Parallelize destination geocodings and freight calculations
  const processedMarkets = await Promise.all(
    rawRecords.map(async (item) => {
      const modalPrice = Number(item.modal_price) || 0;
      const minPrice = Number(item.min_price) || 0;
      const maxPrice = Number(item.max_price) || 0;

      const estimatedGrossValue = Math.round(qtyInQuintals * modalPrice);

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

      // EXPLAINABLE MULTI-FACTOR OPPORTUNITY SCORING (0 - 100)
      // Factor 1: Price Competitiveness (up to 35 pts)
      const priceFactor = maxModalPrice > 0 ? Math.round((modalPrice / maxModalPrice) * 35) : 0;

      // Factor 2: Net Return Ratio (up to 35 pts)
      const maxGrossPotential = qtyInQuintals * maxModalPrice;
      const netReturnRatio = maxGrossPotential > 0 ? Math.max(0, estimatedNetReturn / maxGrossPotential) : 0;
      const netReturnFactor = Math.round(Math.min(35, netReturnRatio * 35));

      // Factor 3: Price Range Stability (up to 15 pts)
      const consistencyRatio = (maxPrice > 0 && minPrice > 0) ? Math.min(1, minPrice / maxPrice) : 0.8;
      const stabilityFactor = Math.round(consistencyRatio * 15);

      // Factor 4: Logistics & Distance Efficiency (up to 10 pts)
      let logisticsFactor = 5; // Neutral default if coords unavailable
      if (freight && freight.distance_km !== null) {
        const dist = freight.distance_km;
        if (dist <= 50) logisticsFactor = 10;
        else if (dist <= 150) logisticsFactor = 7;
        else if (dist <= 300) logisticsFactor = 4;
        else logisticsFactor = 2;
      }

      // Factor 5: Grade & Buyer Match Factor (up to 5 pts)
      const gradeComp = checkGradeCompatibility(farmerGrade, item.grade || "FAQ");
      const gradeFactor = gradeComp.compatible ? 5 : 1;

      // Total Explainable Score (0 - 100)
      const totalOpportunityScore = Math.min(
        100,
        Math.max(0, priceFactor + netReturnFactor + stabilityFactor + logisticsFactor + gradeFactor)
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
        farmos_opportunity_score: totalOpportunityScore,
        score_factors: {
          price_competitiveness: priceFactor,
          net_return_ratio: netReturnFactor,
          price_range_stability: stabilityFactor,
          logistics_efficiency: logisticsFactor,
          grade_and_buyer_match: gradeFactor
        }
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
    "Potential buyers/traders listed below are matching relevant businesses based on commodity, location, and grade requirement. FarmOS does not guarantee transactions."
  ];

  if (!hasLocation) {
    warnings.push("Location not specified. Provide your location to compute estimated road distance and freight cost.");
  }

  // Generate clear explainable recommendation reasons (STEP 11 & 12)
  const whyBullets = [];
  if (recommended.estimated_freight_cost !== null) {
    whyBullets.push(
      `Strong expected net return of ₹${recommended.estimated_net_return.toLocaleString()} after deducting freight cost of ₹${recommended.estimated_freight_cost.toLocaleString()}.`,
      `Benchmark modal price of ₹${recommended.modal_price.toLocaleString()}/quintal in ${recommended.market} APMC Mandi.`,
      `Farmer grade (${farmerGrade}) matches Mandi benchmark standard (${recommended.grade}).`,
      `Road transport via ${recommended.vehicles_required} ${recommended.vehicle_name} (${recommended.estimated_distance}, approx ${recommended.travel_time_mins} mins).`
    );
  } else {
    whyBullets.push(
      `Highest reported benchmark modal price of ₹${recommended.modal_price.toLocaleString()}/quintal in the region.`,
      `Price range stability indicator (Min ₹${recommended.min_price.toLocaleString()} to Max ₹${recommended.max_price.toLocaleString()}/qtl).`,
      `Farmer grade (${farmerGrade}) matches Mandi standard (${recommended.grade}).`,
      `Estimated gross return of ₹${recommended.estimated_gross_value.toLocaleString()} for ${qtyInQuintals} quintal (${quantityInput} ${unitInput}).`
    );
  }

  const finalResult = {
    success: true,
    data_source: "Govt of India Agmarknet (data.gov.in)",
    commodity: crop,
    farmer_grade: farmerGrade,
    quantity_quintals: qtyInQuintals,
    quantity_kg: qtyInKg,
    user_quantity: quantityInput,
    user_unit: unitInput,
    user_location: farmerLocation || district || state,
    has_location: hasLocation,
    logistics_enabled: hasLogisticsData,
    total_markets_analyzed: processedMarkets.length,
    score_status: "available",
    opportunityScore: recommended.farmos_opportunity_score,
    recommendation: Boolean(recommended.farmos_opportunity_score >= 50 && recommended.estimated_net_return > 0),
    reasons: whyBullets,
    score_factors: recommended.score_factors,
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
      score_name: "FarmOS Explainable Multi-Factor Opportunity Score",
      scale: "0 - 100",
      price_competitiveness_pts: "Up to 35 points based on modal price relative to peak regional market.",
      net_return_pts: "Up to 35 points based on net revenue after freight deductions.",
      stability_pts: "Up to 15 points based on min/max price range consistency.",
      logistics_pts: "Up to 10 points based on road distance efficiency.",
      grade_and_buyer_pts: "Up to 5 points based on farmer grade & buyer requirement compatibility."
    }
  };

  opportunityCache.set(cacheKey, { timestamp: Date.now(), data: finalResult });
  return finalResult;
};

module.exports = {
  evaluateOpportunities,
  convertToQuintals,
  findPotentialBuyers,
  checkGradeCompatibility
};
