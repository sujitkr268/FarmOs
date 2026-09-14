const { generateAgricultureResponse } = require('../services/chatService')
const { fetchMandiPrices } = require('../services/marketService')
const { fetchWeatherData } = require('../services/weatherService')

const INDIAN_STATES = [
  'West Bengal', 'Punjab', 'Uttar Pradesh', 'Maharashtra', 'Gujarat',
  'Haryana', 'Karnataka', 'Tamil Nadu', 'Rajasthan', 'Bihar',
  'Madhya Pradesh', 'Odisha', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Assam'
]

const COMMODITIES = [
  'Potato', 'Onion', 'Rice', 'Wheat', 'Tomato', 'Garlic', 'Ginger',
  'Apple', 'Banana', 'Mango', 'Maize', 'Cotton', 'Mustard', 'Soyabean'
]

// Determine if question relates to market prices or weather forecast
const detectIntent = (text) => {
  const lower = text.toLowerCase()

  const marketKeywords = [
    'mandi', 'market', 'price', 'rate', 'cost', 'modal', 'cheapest',
    'potato', 'onion', 'rice', 'wheat', 'tomato', 'commodity', 'quintal'
  ]

  const weatherKeywords = [
    'weather', 'rain', 'rainfall', 'temperature', 'forecast', 'wind',
    'humidity', 'precipitation', 'climate', 'kolkata'
  ]

  const isMarket = marketKeywords.some((kw) => lower.includes(kw))
  const isWeather = weatherKeywords.some((kw) => lower.includes(kw))

  if (isMarket) return 'market'
  if (isWeather) return 'weather'
  return 'general'
}

// Extract state and commodity parameters for Mandi search
const extractMarketParams = (text) => {
  const lower = text.toLowerCase()

  let matchedState = 'West Bengal' // Default for Phase 2
  for (const st of INDIAN_STATES) {
    if (lower.includes(st.toLowerCase())) {
      matchedState = st
      break
    }
  }

  let matchedCommodity = 'Potato' // Default for Phase 2
  for (const cmd of COMMODITIES) {
    if (lower.includes(cmd.toLowerCase())) {
      matchedCommodity = cmd
      break
    }
  }

  return { state: matchedState, commodity: matchedCommodity }
}

// ================= POST CHAT MESSAGE =================
const processChatMessage = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'User message is required. Example payload: { "message": "What is the potato price in West Bengal?" }'
      })
    }

    const trimmedMsg = message.trim()
    const intentType = detectIntent(trimmedMsg)
    let contextData = null

    // 1. Fetch Market Context if intent === 'market'
    if (intentType === 'market') {
      try {
        const { state, commodity } = extractMarketParams(trimmedMsg)
        const marketResult = await fetchMandiPrices({ state, commodity, limit: 10 })
        if (marketResult && marketResult.success) {
          contextData = {
            requested_state: state,
            requested_commodity: commodity,
            total_records: marketResult.total || marketResult.count,
            records: marketResult.data || []
          }
        }
      } catch (mErr) {
        console.warn('Market context fetch failed:', mErr.message)
      }
    }

    // 2. Fetch Weather Context if intent === 'weather'
    if (intentType === 'weather') {
      try {
        // Temporary default for Phase 2: Kolkata (22.5726, 88.3639)
        const weatherResult = await fetchWeatherData(22.5726, 88.3639)
        if (weatherResult && weatherResult.success) {
          contextData = weatherResult.data
        }
      } catch (wErr) {
        console.warn('Weather context fetch failed:', wErr.message)
      }
    }

    // 3. Send message + real context to Gemini AI
    const result = await generateAgricultureResponse(trimmedMsg, contextData, intentType)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Chat Controller Error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to generate response from FarmOS Assistant',
      error: error.message
    })
  }
}

module.exports = {
  processChatMessage
}
