import axios from 'axios';
import { Property, Booking, Contact, AuthResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Properties
export const getProperties = async (filters?: { type?: string; city?: string; status?: string }) => {
  const response = await api.get<Property[]>('/properties', { params: filters });
  return response.data;
};

export const getPropertyById = async (id: number) => {
  const response = await api.get<Property>(`/properties/${id}`);
  return response.data;
};

export const getFeaturedProperties = async () => {
  const response = await api.get<Property[]>('/properties/featured');
  return response.data;
};

export const createProperty = async (property: Property) => {
  const response = await api.post<Property>('/properties', property);
  return response.data;
};

export const updateProperty = async (id: number, property: Partial<Property>) => {
  const response = await api.put<Property>(`/properties/${id}`, property);
  return response.data;
};

export const deleteProperty = async (id: number) => {
  await api.delete(`/properties/${id}`);
};

// Bookings
export const getBookings = async () => {
  const response = await api.get<Booking[]>('/bookings');
  return response.data;
};

export const createBooking = async (booking: Booking) => {
  const response = await api.post<Booking>('/bookings', booking);
  return response.data;
};

export const updateBooking = async (id: number, booking: Partial<Booking>) => {
  const response = await api.put<Booking>(`/bookings/${id}`, booking);
  return response.data;
};

export const deleteBooking = async (id: number) => {
  await api.delete(`/bookings/${id}`);
};

// Contacts
export const getContacts = async () => {
  const response = await api.get<Contact[]>('/contacts');
  return response.data;
};

export const createContact = async (contact: Contact) => {
  const response = await api.post<Contact>('/contacts', contact);
  return response.data;
};

export const updateContact = async (id: number, contact: Partial<Contact>) => {
  const response = await api.put<Contact>(`/contacts/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id: number) => {
  await api.delete(`/contacts/${id}`);
};

// Auth
export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, name: string) => {
  const response = await api.post<AuthResponse>('/auth/register', { email, password, name });
  return response.data;
};
