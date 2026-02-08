import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send session cookies with every request
});

// Log API URL in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API Base URL:', API_URL);
}

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
      // Don't auto-redirect on dashboard or profile pages - let the page handle it
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const protectedPaths = ['/dashboard', '/profile', '/login', '/register'];
        const isProtectedPath = protectedPaths.some(p => currentPath.startsWith(p));
        
        if (!isProtectedPath) {
          Cookies.remove('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) => {
    // Backend expects 'identifier' instead of 'email'
    return api.post('/auth/login', {
      identifier: data.email,
      password: data.password,
    });
  },
  verifyOtp: (data: { userId: string; otpCode: string }) =>
    api.post('/auth/login/verify-otp', data),
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
    // API returns { data: { properties: [], pagination: {} } }
    return response.data.data || response.data;
  },
  getById: async (id: string) => {
    try {
      console.log('API: Fetching property with ID:', id);
      const response = await api.get(`/properties/${encodeURIComponent(id)}`);
      console.log('API: Response status:', response.status);
      console.log('API: Response data:', response.data);
      
      // API returns { success: true, data: property }
      if (response.data && response.data.success !== undefined) {
        const property = response.data.data;
        console.log('API: Extracted property:', property);
        return property;
      }
      
      // Fallback for different response formats
      const property = response.data.data || response.data;
      console.log('API: Fallback property:', property);
      return property;
    } catch (error: any) {
      // If error, log it for debugging
      console.error('API Error fetching property:', id);
      console.error('API Error response:', error.response);
      console.error('API Error data:', error.response?.data);
      console.error('API Error message:', error.message);
      throw error;
    }
  },
  getFeatured: async (limit?: number) => {
    const response = await api.get('/properties/featured', { params: { limit } });
    return response.data.data || response.data;
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
    const response = await api.get('/reservations/my', { params });
    return response.data.data || response.data;
  },
  getById: (id: string) => api.get(`/reservations/${id}`),
  getByProperty: async (propertyId: string) => {
    const response = await api.get(`/reservations/property/${propertyId}`);
    return response.data.data || response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/reservations', data);
    return response.data.data || response.data;
  },
  confirm: (id: string) => api.patch(`/reservations/${id}/confirm`),
  cancel: (id: string) => api.post(`/reservations/${id}/cancel`),
  update: (id: string, data: any) => api.put(`/reservations/${id}`, data),
  delete: (id: string) => api.delete(`/reservations/${id}`),
  checkAvailability: (params: { propertyId: string; startDate: string; endDate: string }) =>
    api.get('/reservations/check-availability', { params }),
};

// Blog API
export const blogApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/blogs', { params }),
  getPosts: async (params?: Record<string, any>) => {
    const response = await api.get('/blogs', { params });
    return response.data.data || response.data;
  },
  getPost: async (slug: string) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data.data || response.data;
  },
  getById: (id: string) => api.get(`/blogs/${id}`),
  getRecent: (limit?: number) =>
    api.get('/blogs/recent', { params: { limit } }),
  create: (data: any) => api.post('/blogs', data),
  update: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
  publish: (id: string) => api.patch(`/blogs/${id}/publish`),
  unpublish: (id: string) => api.patch(`/blogs/${id}/unpublish`),
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

// Heroes API (for hero section advertisements)
export const heroesApi = {
  getAll: async () => {
    const response = await api.get('/heroes');
    return response.data.data || response.data;
  },
  getActive: async () => {
    const response = await api.get('/heroes');
    // API might return { data: [...] } or just [...]
    const heroes = response.data.data || response.data;
    return Array.isArray(heroes)
      ? heroes.filter((h: any) => h.isActive).sort((a: any, b: any) => a.order - b.order)
      : [];
  },
  getById: (id: string) => api.get(`/heroes/${id}`),
  create: (data: any) => api.post('/heroes', data),
  update: (id: string, data: any) => api.put(`/heroes/${id}`, data),
  delete: (id: string) => api.delete(`/heroes/${id}`),
  reorder: (orderedIds: string[]) => api.post('/heroes/reorder', { orderedIds }),
};

// Cities API
export const citiesApi = {
  getAll: async () => {
    const response = await api.get('/cities');
    // API might return { data: [...] } or just [...]
    return response.data.data || response.data;
  },
  getById: (id: string) => api.get(`/cities/${id}`),
  create: (data: any) => api.post('/cities', data),
  update: (id: string, data: any) => api.put(`/cities/${id}`, data),
  delete: (id: string) => api.delete(`/cities/${id}`),
};

// Leads API (buy requests / contact inquiries)
export const leadsApi = {
  create: async (data: {
    propertyId: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    guestCountry?: string;
    message?: string;
  }) => {
    const response = await api.post('/leads', data);
    return response.data.data || response.data;
  },
  getMyLeads: async () => {
    const response = await api.get('/leads/my');
    return response.data.data || response.data;
  },
  getAll: (params?: Record<string, any>) =>
    api.get('/leads', { params }),
  getById: (id: string) => api.get(`/leads/${id}`),
  update: (id: string, data: any) => api.put(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
};

export default api;
