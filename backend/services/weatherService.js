const weatherCache = new Map()
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes TTL

const getCacheKey = (lat, lon) => {
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)
  return `${latitude.toFixed(2)}_${longitude.toFixed(2)}`
}

const getWeatherDescription = (code) => {
  const codes = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Fog', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    71: { description: 'Slight snow', icon: '🌨️' },
    73: { description: 'Moderate snow', icon: '🌨️' },
    75: { description: 'Heavy snow', icon: '🌨️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
  }
  return codes[code] || { description: 'Variable Weather', icon: '🌡️' }
}

const fetchWeatherData = async (lat, lon) => {
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude. Must be a number between -90 and 90.')
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('Invalid longitude. Must be a number between -180 and 180.')
  }

  const cacheKey = getCacheKey(latitude, longitude)
  const now = Date.now()
  const cachedEntry = weatherCache.get(cacheKey)

  // 1. Return fresh cached data if available (age < 15 minutes)
  if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_TTL_MS) {
    return cachedEntry.data
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum&timezone=auto`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FarmOS-Backend/1.0'
      }
    })

    if (!response.ok) {
      // 2. Handle HTTP 429 or upstream errors gracefully
      if (cachedEntry) {
        // Return stale cache if present
        return {
          ...cachedEntry.data,
          is_fallback: true
        }
      }

      // No cached data exists - return clean unavailable indicator without inventing values
      return {
        success: false,
        is_fallback: true,
        status: response.status,
        message: response.status === 429
          ? 'Weather service is temporarily rate-limited by upstream provider. Please try again shortly.'
          : `Weather service error (HTTP ${response.status}). Please try again shortly.`,
        error: `Open-Meteo API returned HTTP status ${response.status}`
      }
    }

    const json = await response.json()
    const currentCondition = getWeatherDescription(json.current?.weather_code)

    // Map daily forecast items
    const dailyForecast = []
    if (json.daily && json.daily.time) {
      for (let i = 0; i < json.daily.time.length; i++) {
        const wCode = json.daily.weather_code[i]
        const condition = getWeatherDescription(wCode)
        dailyForecast.push({
          date: json.daily.time[i],
          weather_code: wCode,
          weather_description: condition.description,
          icon: condition.icon,
          max_temp: json.daily.temperature_2m_max[i],
          min_temp: json.daily.temperature_2m_min[i],
          precipitation_sum: json.daily.precipitation_sum[i],
          rain_sum: json.daily.rain_sum ? json.daily.rain_sum[i] : 0
        })
      }
    }

    const formattedPayload = {
      success: true,
      data: {
        latitude: json.latitude,
        longitude: json.longitude,
        timezone: json.timezone || 'UTC',
        elevation: json.elevation || 0,
        current: {
          temperature: json.current?.temperature_2m ?? 0,
          apparent_temperature: json.current?.apparent_temperature ?? 0,
          humidity: json.current?.relative_humidity_2m ?? 0,
          precipitation: json.current?.precipitation ?? 0,
          rain: json.current?.rain ?? 0,
          weather_code: json.current?.weather_code ?? 0,
          weather_description: currentCondition.description,
          icon: currentCondition.icon,
          wind_speed: json.current?.wind_speed_10m ?? 0
        },
        daily_forecast: dailyForecast
      }
    }

    // Save fresh response in cache
    weatherCache.set(cacheKey, {
      timestamp: now,
      data: formattedPayload
    })

    return formattedPayload
  } catch (err) {
    // Handle network level exceptions
    if (cachedEntry) {
      return {
        ...cachedEntry.data,
        is_fallback: true
      }
    }

    return {
      success: false,
      is_fallback: true,
      status: 503,
      message: 'Weather service is currently unavailable. Please try again shortly.',
      error: err.message
    }
  }
}

module.exports = {
  fetchWeatherData
}

