import api from './api'

export const getMyOrders = async () => {
  const response = await api.get('/order/my-orders')
  return response.data
}