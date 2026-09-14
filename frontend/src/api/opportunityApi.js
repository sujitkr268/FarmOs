import API from './axios'

/**
 * Compare Market Opportunities for a harvest produce
 * @param {Object} params - { commodity/crop, quantity, unit, state, district, location }
 */
export const compareMarketOpportunities = async (params = {}) => {
  const response = await API.post('/opportunities/compare', params)
  return response.data
}
