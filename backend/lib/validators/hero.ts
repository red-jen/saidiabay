import { z } from 'zod';

export const heroSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  subtitle: z.string().optional(),
  imageUrl: z.string().url('Valid image URL is required'),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateHeroSchema = heroSchema.partial();

export type HeroInput = z.infer<typeof heroSchema>;
export type UpdateHeroInput = z.infer<typeof updateHeroSchema>;