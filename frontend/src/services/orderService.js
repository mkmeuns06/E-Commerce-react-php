import api from './api';

export const orderService = {
  async createOrder(shippingData) {
    const response = await api.post('/orders/create', shippingData);
    return response.data;
  },

  async getOrderHistory() {
    const response = await api.get('/orders/history');
    return response.data.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/show?id=${id}`);
    return response.data.data;
  },
};