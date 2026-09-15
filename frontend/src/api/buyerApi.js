import API from './axios';

export const getRegisteredBuyers = async (params = {}) => {
  const response = await API.get('/buyers', { params });
  return response.data;
};

export const getRegisteredBuyerById = async (id) => {
  const response = await API.get(`/buyers/${id}`);
  return response.data;
};

export const updateBuyerProfile = async (profileData) => {
  const response = await API.put('/buyers/profile', profileData);
  return response.data;
};

export const getPendingBuyers = async () => {
  const response = await API.get('/admin/buyers/pending');
  return response.data;
};

export const verifyBuyer = async (id, notes = '') => {
  const response = await API.put(`/admin/buyers/${id}/verify`, { notes });
  return response.data;
};

export const rejectBuyer = async (id, notes = '') => {
  const response = await API.put(`/admin/buyers/${id}/reject`, { notes });
  return response.data;
};
