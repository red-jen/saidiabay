import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().optional(),
  price: z.number().positive('Le prix doit être positif'),
  propertyType: z.enum(['RENT', 'SALE']),
  listingType: z.enum(['LOCATION', 'VENTE']),
  propertyCategory: z.enum(['VILLA', 'APPARTEMENT']),
  status: z.enum(['AVAILABLE', 'PENDING', 'SOLD']).optional(),
  
  // Localisation
  cityId: z.string().cuid('ID de ville invalide'),
  address: z.string().min(5, "L'adresse est requise"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Médias
  images: z.array(z.string().url()).max(30, 'Maximum 30 images autorisées'),
  thumbnail: z.string().url('Image miniature requise'),
  videoUrl: z.string().url('URL vidéo invalide').optional().or(z.literal('')),
  
  // Caractéristiques numériques
  chambres: z.number().int().min(0).optional(),
  sallesDeBain: z.number().int().min(0).optional(),
  surface: z.number().positive().optional(),
  anneeCons: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  garage: z.number().int().min(0).optional(),
  
  // Équipements
  balcon: z.boolean().optional(),
  climatisation: z.boolean().optional(),
  gazon: z.boolean().optional(),
  machineLaver: z.boolean().optional(),
  tv: z.boolean().optional(),
  parking: z.boolean().optional(),
  piscine: z.boolean().optional(),
  wifi: z.boolean().optional(),
  cuisine: z.boolean().optional(),
  
  isActive: z.boolean().optional(),
});

export const updatePropertySchema = propertySchema.partial();

export type PropertyInput = z.infer<typeof propertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;