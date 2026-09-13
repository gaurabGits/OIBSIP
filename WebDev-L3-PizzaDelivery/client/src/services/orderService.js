import api from './api'

export const getMyOrders = async () => {
  const response = await api.get('/order/my-orders')
  return response.data
}

export const cancelMyOrder = async (id) => {
  const response = await api.patch(`/order/${id}/cancel`)
  return response.data
}