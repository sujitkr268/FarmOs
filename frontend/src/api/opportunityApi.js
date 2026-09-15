import API from './axios'

/**
 * Compare Market Opportunities for a harvest produce
 * @param {Object} params - { commodity/crop, quantity, unit, state, district, location, vehicle_type }
 */
export const compareMarketOpportunities = async (params = {}) => {
  const response = await API.post('/opportunities/compare', params)
  return response.data
}

/**
 * Estimate Freight Logistics for road transport
 * @param {Object} params - { origin, destination, quantity_kg, vehicle_type }
 */
export const estimateFreightLogistics = async (params = {}) => {
  const response = await API.post('/logistics/estimate', params)
  return response.data
}

/**
 * Fetch available vehicle categories & transport rates
 */
export const getLogisticsVehicles = async () => {
  const response = await API.get('/logistics/vehicles')
  return response.data
}
