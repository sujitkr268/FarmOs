const generateAgricultureResponse = async (userMessage, contextData = null, contextType = 'general') => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in backend environment configuration.')
  }

  const systemInstruction = `You are FarmOS Assistant, an expert AI agricultural advisor.
Give practical, clear, and accurate answers for farmers and buyers.
Never invent or hallucinate current market prices, weather conditions, harvest records, or order information.
If real FarmOS data is provided below, base your answer strictly on that data.
If required data is unavailable or not provided in the context, clearly state so.
Keep your answers well-structured, concise, and easy to read.`

  let promptContent = `${systemInstruction}\n\n`

  if (contextData && (contextType === 'market' || contextType === 'weather' || contextType === 'opportunity')) {
    promptContent += `REAL FARMOS DATA CONTEXT (${contextType.toUpperCase()}):\n${JSON.stringify(contextData, null, 2)}\n\n`

    if (contextType === 'opportunity') {
      promptContent += `SPECIAL INSTRUCTIONS FOR AI OPPORTUNITY EXPLANATION:
The FarmOS Opportunity Engine evaluated real Agmarknet mandi market data and computed the market rankings, estimated gross values, and FarmOS Opportunity Scores (0-100).
1. Explain FarmOS's calculated recommendation clearly to the farmer.
2. State the recommended market, reported benchmark modal price (₹/quintal), and estimated gross return.
3. Do NOT invent prices, transport costs, or rankings independently. Refer strictly to the calculated numbers provided.
4. Mention that the FarmOS Opportunity Score is calculated by FarmOS based on price relative to regional peaks and price-range consistency.
5. Emphasize that recommendations are estimated market opportunities based on reported Agmarknet prices, not guaranteed profits.\n\n`
    }
  }

  promptContent += `User Question: ${userMessage}`

  const models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-2.5-flash']
  let lastError = null

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: promptContent }]
            }
          ]
        })
      })

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}))
        const errorMsg = errJson.error?.message || `Gemini API HTTP status ${response.status}`
        throw new Error(errorMsg)
      }

      const json = await response.json()
      const aiResponse = json.candidates?.[0]?.content?.parts?.[0]?.text

      if (aiResponse) {
        return {
          success: true,
          message: aiResponse,
          context: {
            type: contextType,
            data: contextData
          }
        }
      }
    } catch (err) {
      lastError = err
    }
  }

  throw new Error(`Gemini API Error: ${lastError ? lastError.message : 'Unable to obtain AI response'}`)
}

module.exports = {
  generateAgricultureResponse
}
