const { generateAgricultureResponse } = require("../services/chatService");
const { fetchMandiPrices } = require("../services/marketService");
const { fetchWeatherData } = require("../services/weatherService");
const { evaluateOpportunities } = require("../services/opportunityService");

const INDIAN_STATES = [
  "West Bengal", "Punjab", "Uttar Pradesh", "Maharashtra", "Gujarat",
  "Haryana", "Karnataka", "Tamil Nadu", "Rajasthan", "Bihar",
  "Madhya Pradesh", "Odisha", "Kerala", "Andhra Pradesh", "Telangana", "Assam"
];

const COMMODITY_MAP = {
  "potato": "Potato", "potatoes": "Potato", "आलू": "Potato", "আলু": "Potato",
  "tomato": "Tomato", "tomatoes": "Tomato", "टमाटर": "Tomato", "টমেটো": "Tomato",
  "rice": "Rice", "paddy": "Rice", "चावल": "Rice", "धान": "Rice", "ধান": "Rice",
  "wheat": "Wheat", "गेहूं": "Wheat", "গম": "Wheat",
  "onion": "Onion", "onions": "Onion", "प्याज": "Onion", "পেঁয়াজ": "Onion",
  "jute": "Jute", "पटसन": "Jute", "পাট": "Jute",
  "mustard": "Mustard", "सरसों": "Mustard", "সরষে": "Mustard",
  "tea": "Tea", "चाय": "Tea", "চা": "Tea",
  "brinjal": "Brinjal", "brinjals": "Brinjal", "eggplant": "Brinjal", "eggplants": "Brinjal", "बैंगन": "Brinjal", "বেগুন": "Brinjal",
  "maize": "Maize", "corn": "Maize", "मक्का": "Maize",
  "mango": "Mango", "आम": "Mango", "আম": "Mango"
};

const detectIntent = (text) => {
  const lower = text.toLowerCase();

  const opportunityKeywords = [
    "where should i sell", "where to sell", "best market", "best selling",
    "best opportunity", "best return", "highest price", "highest return",
    "opportunity", "compare market", "compare prices", "which mandi", "which market",
    "freight", "transport", "vehicle", "truck", "logistics", "net return", "shipping cost", "delivery cost",
    "कहाँ बेचूँ", "कहाँ बेचना", "मंडी तुलना", "सबसे अच्छी मंडी"
  ];

  const marketKeywords = [
    "mandi", "market", "price", "rate", "cost", "modal", "cheapest",
    "potato", "onion", "rice", "wheat", "tomato", "commodity", "quintal",
    "bhav", "भाव", "कीमत", "मूल्य", "दर", "dam", "দাম", "कया भाव है", "क्या भाव"
  ];

  const weatherKeywords = [
    "weather", "rain", "rainfall", "temperature", "forecast", "wind",
    "humidity", "precipitation", "climate", "kolkata", "मौसम", "बारिश", "तापमान"
  ];

  const isOpportunity = opportunityKeywords.some((kw) => lower.includes(kw));
  const isMarket = marketKeywords.some((kw) => lower.includes(kw)) || Object.keys(COMMODITY_MAP).some((kw) => lower.includes(kw));
  const isWeather = weatherKeywords.some((kw) => lower.includes(kw));

  if (isOpportunity) return "opportunity";
  if (isMarket) return "market";
  if (isWeather) return "weather";
  return "market"; // Default to market intent for agricultural queries to ensure context availability
};

const extractMarketParams = (text) => {
  const lower = text.toLowerCase();

  let matchedState = "";
  for (const st of INDIAN_STATES) {
    if (lower.includes(st.toLowerCase())) {
      matchedState = st;
      break;
    }
  }

  let matchedCommodity = "";
  for (const [kw, normName] of Object.entries(COMMODITY_MAP)) {
    if (lower.includes(kw)) {
      matchedCommodity = normName;
      break;
    }
  }

  return { state: matchedState, commodity: matchedCommodity };
};

const extractOpportunityParams = (text) => {
  const lower = text.toLowerCase();
  const base = extractMarketParams(text);

  let quantity = 500;
  let unit = "kg";

  const qtyMatch = lower.match(/(\d+(?:\.\d+)?)\s*(kg|kilogram|quintal|qtl|ton|tonne|bags?|crates?)?/i);
  if (qtyMatch) {
    quantity = parseFloat(qtyMatch[1]);
    if (qtyMatch[2]) {
      const uStr = qtyMatch[2].toLowerCase();
      if (uStr.includes("kg") || uStr.includes("kilogram")) unit = "kg";
      else if (uStr.includes("quintal") || uStr.includes("qtl")) unit = "quintal";
      else if (uStr.includes("ton")) unit = "ton";
    }
  }

  return {
    crop: base.commodity,
    quantity: quantity,
    unit: unit,
    state: base.state
  };
};

const processChatMessage = async (req, res) => {
  try {
    const { message, language } = req.body;
    const targetLang = (language === "hi") ? "hi" : "en";

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'User message is required. Example payload: { "message": "What is the current price of tomato?", "language": "en" }'
      });
    }

    const trimmedMsg = message.trim();
    const intentType = detectIntent(trimmedMsg);
    let contextData = null;

    // 1. Handle Opportunity Engine Context
    if (intentType === "opportunity") {
      try {
        const oppParams = extractOpportunityParams(trimmedMsg);
        contextData = await evaluateOpportunities(oppParams);
      } catch (oErr) {
        console.warn("Opportunity context evaluation failed:", oErr.message);
      }
    }

    // 2. Handle Live Mandi Market Context (Default or Market)
    if ((intentType === "market" || !contextData) && intentType !== "weather") {
      try {
        const { state, commodity } = extractMarketParams(trimmedMsg);
        const marketResult = await fetchMandiPrices({ state, commodity, limit: 12 });
        if (marketResult && marketResult.success) {
          contextData = {
            requested_state: state,
            requested_commodity: commodity,
            total_records: marketResult.total || marketResult.count,
            records: marketResult.data || [],
            source: marketResult.source || "agmarknet_record_store",
            warning: marketResult.warning || null
          };
        }
      } catch (mErr) {
        console.warn("Market context fetch failed:", mErr.message);
      }
    }

    // 3. Handle Live Weather Context
    if (intentType === "weather") {
      try {
        const weatherResult = await fetchWeatherData(22.5726, 88.3639);
        if (weatherResult && weatherResult.success) {
          contextData = weatherResult.data;
        }
      } catch (wErr) {
        console.warn("Weather context fetch failed:", wErr.message);
      }
    }

    // 4. Send message + context data to Gemini AI
    const result = await generateAgricultureResponse(trimmedMsg, contextData, intentType, targetLang);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate response from FarmOS Assistant",
      error: error.message
    });
  }
};

module.exports = {
  processChatMessage
};
