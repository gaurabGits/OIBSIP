import api from "./api";

// Get all pizzas
export const getPizzas = async () => {
  const response = await api.get("/pizza");
  return response.data;
};

// Get one pizza
export const getPizzaById = async (id) => {
  const response = await api.get(`/pizza/${id}`);
  return response.data;
};

export const getInventory = async () => {
  const response = await api.get('/inventory');
  return response.data;
};