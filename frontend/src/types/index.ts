export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'client';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'apartment' | 'house' | 'villa' | 'studio' | 'commercial' | 'land';
  status: 'available' | 'rented' | 'sold' | 'pending';
  listingType: 'rent' | 'sale';
  location: string;
  address?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  features: string[];
  isFeatured: boolean;
  views: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  userId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  totalPrice?: number;
  notes?: string;
  numberOfGuests?: number;
  propertyId: string;
  userId?: string;
  property?: Property;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  featuredImage?: string;
  tags: string[];
  views: number;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Ad {
  id: string;
  imageUrl: string;
  link?: string;
  active: boolean;
  title?: string;
  position: 'header' | 'sidebar' | 'footer' | 'inline';
  startDate?: string;
  endDate?: string;
  clicks: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit?: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PropertyFilters {
  type?: string;
  listingType?: string;
  status?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}