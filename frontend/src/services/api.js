// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  }
};

export const articleService = {
  getAll: async () => {
    const response = await api.get('/articles');
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },
  create: async (article) => {
    const response = await api.post('/articles', article);
    return response.data;
  },
  update: async (id, article) => {
    const response = await api.put(`/articles/${id}`, article);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

export default api;