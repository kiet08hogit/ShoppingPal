import axios from 'axios';

// Auto-detect environment and use appropriate API URL
const getApiUrl = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Otherwise, detect based on hostname
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  // For production, you need to set your backend URL here or use environment variable
  // Replace this with your actual production backend URL
  return 'https://your-backend-url.com/api';
};

const API_URL = getApiUrl();

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
  getRecommendations: () => api.get('/cart/recommendations'),
};

export const orderAPI = {
  createOrder: () => api.post('/orders'),
  getOrders: () => api.get('/orders'),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  reorder: (orderId) => api.post(`/orders/${orderId}/reorder`),
};

export const productsAPI = {
  getAllProducts: () => api.get('/products'),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  getProductById: (category, id) => api.get(`/products/category/${category}/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
};

export default api;
