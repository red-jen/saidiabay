import { z } from 'zod';

export const reservationSchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
  guestName: z.string().min(2, 'Guest name is required').optional(),
  guestEmail: z.string().email('Valid email is required').optional(),
  guestPhone: z.string().min(8, 'Valid phone number is required').optional(),
  guestCountry: z.string().optional(),
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

export const updateReservationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
});

export const updateReservationSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
});

export const checkAvailabilitySchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
