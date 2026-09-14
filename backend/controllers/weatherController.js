const { fetchWeatherData } = require('../services/weatherService')

// ================= GET WEATHER DATA =================
const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and Longitude (lon) query parameters are required. Example: /api/weather?lat=22.5726&lon=88.3639'
      })
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude parameter. Latitude must be a valid number between -90 and 90.'
      })
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude parameter. Longitude must be a valid number between -180 and 180.'
      })
    }

    const result = await fetchWeatherData(latitude, longitude)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Get Weather Error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve weather forecast data',
      error: error.message
    })
  }
}

module.exports = {
  getWeather
}
