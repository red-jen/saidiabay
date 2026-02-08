export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  propertyType: 'RENT' | 'SALE';
  listingType: 'LOCATION' | 'VENTE';
  propertyCategory: 'VILLA' | 'APPARTEMENT';
  status: 'AVAILABLE' | 'PENDING' | 'SOLD';
  
  // Localisation
  cityId: string;
  city?: City;
  address: string;
  latitude?: number;
  longitude?: number;
  
  // Médias
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  
  // Caractéristiques
  chambres?: number;
  sallesDeBain?: number;
  surface?: number;
  anneeCons?: number;
  garage?: number;
  
  // Équipements
  balcon: boolean;
  climatisation: boolean;
  gazon: boolean;
  machineLaver: boolean;
  tv: boolean;
  parking: boolean;
  piscine: boolean;
  wifi: boolean;
  cuisine: boolean;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Reservation {
  id: string;
  propertyId: string;
  property?: Property;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry?: string;
  message?: string;
  status: 'PENDING' | 'PRE_RESERVED' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
}

export interface Lead {
  id: string;
  propertyId: string;
  property?: Property;
  name?: string;
  email?: string;
  phone?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCountry?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  videoUrl?: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface HeroSection {
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

export interface Sale {
  id: string;
  propertyId: string;
  amount: number;
  type: 'SALE' | 'RENTAL';
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  overview: {
    totalProperties: number;
    totalReservations: number;
    totalLeads: number;
    totalRevenue: number;
    availableRentals: number;
    availableSales: number;
    occupancyRate: number;
    totalUsers?: number;
  };
  recentReservations: Array<{
    id: string;
    propertyTitle: string;
    guestName: string;
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
  }>;
  recentLeads: Array<{
    id: string;
    propertyTitle: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
  }>;
  topProperties: Array<{
    propertyId: string;
    propertyTitle: string;
    propertyType: string;
    totalBookings: number;
    totalRevenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
  last12MonthsRevenue?: Array<{
    month: string;
    monthName: string;
    revenue: number;
  }>;
}