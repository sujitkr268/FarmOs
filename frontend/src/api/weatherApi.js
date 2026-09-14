import API from './axios'

/**
 * Fetch Weather Intelligence data from FarmOS Backend
 * @param {number|string} lat - Latitude (-90 to 90)
 * @param {number|string} lon - Longitude (-180 to 180)
 */
export const getWeatherForecast = async (lat, lon) => {
  const response = await API.get('/weather', {
    params: { lat, lon }
  })
  return response.data
}
