import API from './axios';

export const getPublicTraders = async (params = {}) => {
  const response = await API.get('/traders', { params });
  return response.data;
};

export const getPublicTraderById = async (id) => {
  const response = await API.get(`/traders/${id}`);
  return response.data;
};

export const createPublicTrader = async (traderData) => {
  const response = await API.post('/traders', traderData);
  return response.data;
};

export const updatePublicTrader = async (id, traderData) => {
  const response = await API.put(`/traders/${id}`, traderData);
  return response.data;
};

export const deletePublicTrader = async (id) => {
  const response = await API.delete(`/traders/${id}`);
  return response.data;
};
