import { z } from 'zod';

export const reservationSchema = z.object({
  propertyId: z.string().cuid(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date',
  }),
  guestName: z.string().min(2, 'Guest name is required'),
  guestEmail: z.string().email('Valid email is required'),
  guestPhone: z.string().min(10, 'Valid phone number is required'),
  message: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateReservationSchema = z.object({
  status: z.enum(['PRE_RESERVED', 'CONFIRMED', 'CANCELLED']),
  notes: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
