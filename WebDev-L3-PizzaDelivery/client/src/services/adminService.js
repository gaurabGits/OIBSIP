import api from "./api";

export const getAdminInventory = async () => {
  const response = await api.get("/inventory/admin");
  return response.data;
};

export const updateInventoryItem = async (id, updates) => {
  const response = await api.patch(`/inventory/${id}`, updates);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get("/order/all-orders");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/order/${id}/status`, { status });
  return response.data;
};

export const markCashPaymentPaid = async (id) => {
  const response = await api.patch(`/order/${id}/cash-payment`);
  return response.data;
};

export const getStoreStatus = async () => {
  const response = await api.get("/store");
  return response.data;
};

export const updateStoreStatus = async (isOpen) => {
  const response = await api.patch("/store", { isOpen });
  return response.data;
};