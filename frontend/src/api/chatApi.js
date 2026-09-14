import API from './axios'

/**
 * Send user query to FarmOS Assistant backend
 * @param {string} message - User text query
 */
export const sendChatMessage = async (message) => {
  const response = await API.post('/chat', { message })
  return response.data
}
