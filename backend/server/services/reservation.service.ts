import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { ReservationInput, UpdateReservationInput } from '../../lib/validators/reservation';

export class ReservationService {
  async getAllReservations(filters?: { status?: string; propertyId?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        property: {
          select: { id: true, title: true, price: true, city: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }

  async getReservationById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        property: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    return reservation;
  }

  async createReservation(data: ReservationInput, userId?: string) {
    // Check if property exists and is available for rent
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.propertyType !== 'RENT') {
      throw new AppError('This property is not available for rent', 400);
    }

    if (property.status !== 'AVAILABLE') {
      throw new AppError('This property is not currently available', 400);
    }

    // Check for overlapping reservations
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const overlapping = await prisma.reservation.findFirst({
      where: {
        propertyId: data.propertyId,
        status: { in: ['CONFIRMED', 'PRE_RESERVED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping) {
      throw new AppError('Property is already booked for selected dates', 400);
    }

    // Calculate total price (days * daily rate)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * days;

    const reservation = await prisma.reservation.create({
      data: {
        ...data,
        startDate,
        endDate,
        totalPrice,
        userId,
        status: 'PRE_RESERVED',
      },
      include: {
        property: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return reservation;
  }

  async updateReservation(id: string, data: UpdateReservationInput) {
    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data,
      include: {
        property: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updated;
  }

  async cancelReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return updated;
  }

  async getMyReservations(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        property: {
          select: { id: true, title: true, city: true, thumbnail: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }
}