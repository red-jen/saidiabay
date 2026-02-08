import { z } from 'zod';

export const leadSchema = z.object({
  propertyId: z.string().cuid(),
  guestName: z.string().min(2, 'Name is required').optional(),
  guestEmail: z.string().email('Valid email is required').optional(),
  guestPhone: z.string().min(8, 'Valid phone number is required').optional(),
  guestCountry: z.string().optional(),
  message: z.string().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST']),
});

export const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST']),
  notes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;