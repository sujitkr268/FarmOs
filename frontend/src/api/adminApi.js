import API from './axios'

export const getPendingFarmersApi = async () => {
  const response = await API.get('/admin/farmers/pending')
  return response.data
}

export const verifyFarmerApi = async (id, verification_notes) => {
  const response = await API.put(`/admin/farmers/${id}/verify`, { verification_notes })
  return response.data
}

export const rejectFarmerApi = async (id, verification_notes) => {
  const response = await API.put(`/admin/farmers/${id}/reject`, { verification_notes })
  return response.data
}
