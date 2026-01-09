import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// Properties API
export const propertiesApi = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  getFeatured: async (limit?: number) => {
    const response = await api.get('/properties/featured', { params: { limit } });
    return response.data;
  },
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
  markAsSold: (id: string) => api.patch(`/properties/${id}/sold`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/properties/${id}/status`, { status }),
};

// Reservations API
export const reservationsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/reservations', { params }),
  getMyReservations: async (params?: Record<string, any>) => {
    const response = await api.get('/reservations/my-reservations', { params });
    return response.data;
  },
  getById: (id: string) => api.get(`/reservations/${id}`),
  create: (data: any) => api.post('/reservations', data),
  confirm: (id: string) => api.patch(`/reservations/${id}/confirm`),
  cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),
  update: (id: string, data: any) => api.put(`/reservations/${id}`, data),
  delete: (id: string) => api.delete(`/reservations/${id}`),
  checkAvailability: (params: { propertyId: string; startDate: string; endDate: string }) =>
    api.get('/reservations/check-availability', { params }),
};

// Blog API
export const blogApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/blog', { params }),
  getPosts: async (params?: Record<string, any>) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },
  getPost: async (slug: string) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  },
  getById: (id: string) => api.get(`/blog/${id}`),
  getRecent: (limit?: number) =>
    api.get('/blog/recent', { params: { limit } }),
  create: (data: any) => api.post('/blog', data),
  update: (id: string, data: any) => api.put(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
  publish: (id: string) => api.patch(`/blog/${id}/publish`),
  unpublish: (id: string) => api.patch(`/blog/${id}/unpublish`),
};

// Ads API
export const adsApi = {
  getActive: (position?: string) =>
    api.get('/ads/active', { params: { position } }),
  getAll: (params?: Record<string, any>) =>
    api.get('/ads', { params }),
  getById: (id: string) => api.get(`/ads/${id}`),
  create: (data: any) => api.post('/ads', data),
  update: (id: string, data: any) => api.put(`/ads/${id}`, data),
  delete: (id: string) => api.delete(`/ads/${id}`),
  activate: (id: string) => api.patch(`/ads/${id}/activate`),
  deactivate: (id: string) => api.patch(`/ads/${id}/deactivate`),
  trackClick: (id: string) => api.post(`/ads/${id}/click`),
};

// Users API (admin)
export const usersApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
