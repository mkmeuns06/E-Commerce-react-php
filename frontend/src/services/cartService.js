import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },

  async updateCart(productId, quantity) {
    const response = await api.post('/cart/update', { product_id: productId, quantity });
    return response.data;
  },

  async removeFromCart(productId) {
    const response = await api.post('/cart/remove', { product_id: productId });
    return response.data;
  },

  async clearCart() {
    const response = await api.post('/cart/clear');
    return response.data;
  },
};