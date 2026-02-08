import { z } from 'zod';

export const blockedDateSchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
  reason: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => {
  const start = new Date(data.startDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return start >= now;
}, {
  message: 'Start date cannot be in the past',
  path: ['startDate'],
});

export const updateBlockedDateSchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }).optional(),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }).optional(),
  reason: z.string().optional(),
});

export type BlockedDateInput = z.infer<typeof blockedDateSchema>;
export type UpdateBlockedDateInput = z.infer<typeof updateBlockedDateSchema>;
