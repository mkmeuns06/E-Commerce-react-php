import api from './api';

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/categories/show?id=${id}`);
    return response.data.data;
  },
};