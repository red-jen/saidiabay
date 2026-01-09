import { z } from 'zod';

export const leadSchema = z.object({
  propertyId: z.string().cuid(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  message: z.string().optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST']),
  notes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;