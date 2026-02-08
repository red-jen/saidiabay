import { z } from 'zod';

export const heroSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  ctaLink: z.string().url('Valid link URL is required').or(
    z.string().regex(/^\//, 'Link must start with / for internal links or be a valid URL')
  ),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateHeroSchema = heroSchema.partial().refine(
  (data) => {
    // At least imageUrl or ctaLink must be provided for update
    return data.imageUrl !== undefined || data.ctaLink !== undefined;
  },
  { message: 'At least one field must be provided' }
);

export type HeroInput = z.infer<typeof heroSchema>;
export type UpdateHeroInput = z.infer<typeof updateHeroSchema>;