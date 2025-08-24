import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/api/orders', { params }),
  createOrder: (orderData) => api.post('/api/orders', orderData),
  updateOrderStatus: (id, statusData) => api.put(`/api/orders/${id}/status`, statusData),
};

// Videos API
export const videosAPI = {
  getVideos: (params) => api.get('/api/videos', { params }),
  uploadVideo: (videoData) => api.post('/api/videos/upload', videoData),
  getVideo: (id) => api.get(`/api/videos/${id}`),
};

export default api;
