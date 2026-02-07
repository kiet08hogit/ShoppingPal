import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userAPI = {
  createOrUpdateProfile: (data) => api.post('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, category, quantity) => api.post('/cart', { productId, category, quantity }),
  updateQuantity: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const productsAPI = {
  getAllProducts: () => api.get('/products'),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  getProductById: (category, id) => api.get(`/products/category/${category}/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
};

export default api;
