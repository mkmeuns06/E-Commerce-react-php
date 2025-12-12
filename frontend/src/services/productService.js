import api from './api';

export const productService = {
  async getAll(categoryId = null) {
    const url = categoryId ? `/products?category=${categoryId}` : '/products';
    const response = await api.get(url);
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/products/show?id=${id}`);
    return response.data.data;
  },

  async search(keyword) {
    const response = await api.get(`/products/search?q=${keyword}`);
    return response.data.data;
  },

  async getLatest(limit = 8) {
    const response = await api.get(`/products/latest?limit=${limit}`);
    return response.data.data;
  },
};