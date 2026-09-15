import API from './axios'

/**
 * Send user query to FarmOS Assistant backend
 * @param {string} message - User text query
 * @param {string} language - User language preference ('en' or 'hi')
 */
export const sendChatMessage = async (message, language = 'en') => {
  const response = await API.post('/chat', { message, language })
  return response.data
}
