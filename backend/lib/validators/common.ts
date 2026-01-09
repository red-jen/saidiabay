import { z } from 'zod';

export const idSchema = z.object({
  id: z.string().cuid('Invalid ID format'),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type IdParam = z.infer<typeof idSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;