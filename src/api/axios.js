import axios from 'axios';

const api = axios.create({
  baseURL: 'https://travelitinerarybackend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const documents = {
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  remove: (id) => api.delete(`/documents/${id}`),
};

export const itineraries = {
  generate: (payload) => api.post('/itineraries/generate', payload),
  getAll: () => api.get('/itineraries'),
  getById: (id) => api.get(`/itineraries/${id}`),
  share: (id) => api.post(`/itineraries/${id}/share`),
  disableShare: (id) => api.delete(`/itineraries/${id}/share`),
  remove: (id) => api.delete(`/itineraries/${id}`),
  getShared: (code) => api.get(`/shared/${code}`),
};

export default api;
