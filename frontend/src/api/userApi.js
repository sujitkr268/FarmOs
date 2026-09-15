import API from './axios'

export const getProfileApi = async () => {
  const response = await API.get('/auth/profile')
  return response.data
}

export const updateProfileApi = async (profileData) => {
  const response = await API.put('/auth/profile', profileData)
  return response.data
}

export const submitFarmerVerificationApi = async (verificationData) => {
  const response = await API.put('/auth/profile', verificationData)
  return response.data
}
