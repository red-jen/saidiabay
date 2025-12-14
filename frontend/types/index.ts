export interface Property {
  id?: number;
  title: string;
  description?: string;
  type: string;
  status?: string;
  price: number;
  address: string;
  city: string;
  country: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  amenities?: string[];
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id?: number;
  property_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  start_date: string;
  end_date: string;
  status?: string;
  message?: string;
  property_title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  property_id?: number;
  status?: string;
  property_title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id?: number;
  email: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
