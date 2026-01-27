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
  _id?: string; // Old MongoDB ID for backwards compatibility
  id: string; // Backend uses cuid
  title: string;
  description?: string;
  price: number;
  propertyType?: 'RENT' | 'SALE';
  listingType: 'VENTE' | 'LOCATION';
  propertyCategory?: 'VILLA' | 'APPARTEMENT';
  type?: 'apartment' | 'house' | 'villa' | 'studio' | 'commercial' | 'land';
  status: 'AVAILABLE' | 'PENDING' | 'SOLD' | 'DISPONIBLE' | 'LOUE' | 'VENDU' | 'EN_ATTENTE';
  cityId?: string;
  city?: {
    id: string;
    name: string;
    slug: string;
  };
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  thumbnail?: string;
  videoUrl?: string;
  // Property features - backend field names
  chambres?: number;
  sallesDeBain?: number;
  surface?: number;
  anneeCons?: number;
  garage?: number;
  balcon?: boolean;
  climatisation?: boolean;
  gazon?: boolean;
  machineLaver?: boolean;
  tv?: boolean;
  parking?: boolean;
  piscine?: boolean;
  wifi?: boolean;
  cuisine?: boolean;
  // Frontend field aliases
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  views?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  userId?: string;
  owner?: User;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Hero {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
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
  type?: string; // Maps to propertyCategory in API (VILLA | APPARTEMENT)
  listingType?: string; // LOCATION | VENTE
  status?: string; // AVAILABLE | PENDING | SOLD
  city?: string; // cityId for API
  cityId?: string;
  propertyCategory?: string; // VILLA | APPARTEMENT
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number; // Maps to chambres in API
  chambres?: number;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface City {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}