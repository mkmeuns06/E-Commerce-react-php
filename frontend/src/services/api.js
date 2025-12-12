import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Intercepteur corrigé - NE PAS rediriger automatiquement sur 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ NE PLUS FAIRE ÇA :
    // if (error.response?.status === 401) {
    //   window.location.href = '/login';
    // }
    
    // ✅ À LA PLACE : Laisser les composants gérer les 401
    return Promise.reject(error);
  }
);

export default api;