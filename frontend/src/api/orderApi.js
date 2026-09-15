import API from './axios'

export const createOrderApi = async (orderData) => {
  const response = await API.post('/orders', orderData)
  return response.data
}

export const getBuyerOrdersApi = async () => {
  const response = await API.get('/orders/my-orders')
  return response.data
}

export const getFarmerOrdersApi = async () => {
  const response = await API.get('/orders/incoming')
  return response.data
}

export const updateOrderStatusApi = async (orderId, status) => {
  const response = await API.put(`/orders/${orderId}/status`, { status })
  return response.data
}
