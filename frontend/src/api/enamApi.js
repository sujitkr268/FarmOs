import API from './axios'

/**
 * Fetch e-NAM Platform Information & Trade Guidance from FarmOS Backend API
 */
export const getEnamInfo = async () => {
  const response = await API.get('/enam/info')
  return response.data
}
