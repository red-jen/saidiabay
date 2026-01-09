import { z } from 'zod';

export const citySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  slug: z.string().min(2, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Le slug doit être en minuscules avec des tirets'),
});

export const updateCitySchema = citySchema.partial();

export type CityInput = z.infer<typeof citySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;