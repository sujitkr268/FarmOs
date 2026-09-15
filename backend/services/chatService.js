const generateAgricultureResponse = async (userMessage, contextData = null, contextType = 'general', language = 'en') => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in backend environment configuration.')
  }

  const isHindi = language === 'hi';

  const baseInstruction = isHindi
    ? `आप FarmOS Assistant हैं, जो किसानों और कृषि व्यापारियों के लिए एक विशेषज्ञ AI कृषि सलाहकार हैं।
किसानों के लिए सरल, व्यावहारिक और सटीक उत्तर दें।
सामने दी गई आधिकारिक FarmOS जानकारी के आधार पर उत्तर दें।
मूल्य (₹), संख्या, माप की इकाइयाँ (kg, quintal), मंडी का नाम, राज्य/जिला, फसल का नाम, फोन नंबर और वैबसाइट URL जैसे तथ्यात्मक डेटा को न बदलें।
हिंदी में उत्तर देते समय बहुत कठिन शब्दों के बजाय साधारण, बोलचाल की हिंदी भाषा का प्रयोग करें।
वर्तमान मंडी भाव, मौसम की स्थिति, फसल रिकॉर्ड या ऑर्डर जानकारी को कभी भी मनगढ़ंत या काल्पनिक न बनाएं।`
    : `You are FarmOS Assistant, an expert AI agricultural advisor.
Give practical, clear, and accurate answers for farmers and buyers.
Never invent or hallucinate current market prices, weather conditions, harvest records, or order information.
If real FarmOS data is provided below, base your answer strictly on that data.
If required data is unavailable or not provided in the context, clearly state so.
Keep your answers well-structured, concise, and easy to read.`

  let promptContent = `${baseInstruction}\n\n`

  if (contextData && (contextType === 'market' || contextType === 'weather' || contextType === 'opportunity')) {
    promptContent += `REAL FARMOS DATA CONTEXT (${contextType.toUpperCase()}):\n${JSON.stringify(contextData, null, 2)}\n\n`

    if (contextType === 'opportunity') {
      promptContent += isHindi
        ? `विशेष निर्देश (बाज़ार अवसर व्याख्या):
1. किसान को FarmOS की गणना की गई मंडी सिफारिश को स्पष्ट और सरल हिंदी में समझाएं।
2. सुझाई गई मंडी, मॉडल कीमत (₹/क्विंटल), अनुमानित कुल आय, अनुमानित परिवहन लागत (भाड़ा), और अनुमानित शुद्ध आय का स्पष्ट उल्लेख करें।
3. कीमतों या परिवहन लागतों को मनगढ़ंत न बनाएं; दिए गए नंबरों का उपयोग करें।
4. भाड़े के खर्च को "अनुमानित परिवहन लागत" या "अनुमानित भाड़ा" कहें।\n\n`
        : `SPECIAL INSTRUCTIONS FOR AI OPPORTUNITY EXPLANATION:
The FarmOS Opportunity Engine evaluated real Agmarknet mandi market data and computed the market rankings, estimated gross values, freight logistics costs, net returns, and FarmOS Opportunity Scores (0-100).
1. Explain FarmOS's calculated recommendation clearly to the farmer.
2. State the recommended market, reported benchmark modal price (₹/quintal), estimated gross return, estimated freight cost, and estimated net return.
3. Do NOT invent prices, transport costs, or rankings independently. Refer strictly to the calculated numbers provided.
4. Mention that the FarmOS Opportunity Score and Net Return ranking prioritize maximum profit after road freight expenses.
5. If logistics data (vehicle name, vehicles required, distance, estimated freight cost) is included, explain the transport details clearly. Always label transport costs as "Estimated Freight Cost".
6. Emphasize that recommendations are estimated market opportunities based on reported Agmarknet benchmark prices and standard transport rate models, not guaranteed profits or fixed freight quotes.\n\n`
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
