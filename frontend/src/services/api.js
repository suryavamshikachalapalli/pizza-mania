import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const pizzaAPI = {
  getAll: () => api.get('/pizzas'),
  getById: (id) => api.get(`/pizzas/${id}`),
};

export const orderAPI = {
  place: (orderData) => api.post('/orders', orderData),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  getAll: () => api.get('/orders'),
  updateStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
};

export default api;
