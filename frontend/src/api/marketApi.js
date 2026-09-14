import API from './axios'

/**
 * Fetch Mandi Market Prices from FarmOS Backend API
 * @param {Object} params - Query parameters (state, district, market, commodity, variety, grade, limit, offset)
 */
export const getMarketPrices = async (params = {}) => {
  const response = await API.get('/market/prices', { params })
  return response.data
}
