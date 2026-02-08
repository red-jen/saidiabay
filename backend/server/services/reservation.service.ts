import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { ReservationInput, UpdateReservationInput } from '../../lib/validators/reservation';
import { EmailService } from './email.service';

const emailService = new EmailService();

export class ReservationService {
  /**
   * Helper: Calculate number of nights between two dates
   */
  private calculateNights(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Helper: Check if date range is available (checks both reservations and blocked dates)
   */
  private async isDateRangeAvailable(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    excludeReservationId?: string
  ): Promise<boolean> {
    // Check for overlapping reservations
    const whereCondition: any = {
      propertyId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    };

    // Exclude specific reservation (useful for updates)
    if (excludeReservationId) {
      whereCondition.id = { not: excludeReservationId };
    }

    const overlappingReservation = await prisma.reservation.findFirst({
      where: whereCondition,
    });

    if (overlappingReservation) {
      return false;
    }

    // Check for blocked dates
    const blockedDate = await prisma.blockedDate.findFirst({
      where: {
        propertyId,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (blockedDate) {
      return false;
    }

    return true;
  }

  /**
   * Check if dates are available for booking
   */
  async checkDateAvailability(
    propertyId: string,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<{ available: boolean; message?: string }> {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    // Validate dates
    if (start >= end) {
      return { available: false, message: 'End date must be after start date' };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (start < now) {
      return { available: false, message: 'Start date cannot be in the past' };
    }

    // Check property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { available: false, message: 'Property not found' };
    }

    if (property.propertyType !== 'RENT') {
      return { available: false, message: 'Property is not available for rent' };
    }

    if (property.status !== 'AVAILABLE') {
      return { available: false, message: 'Property is not currently available' };
    }

    const isAvailable = await this.isDateRangeAvailable(propertyId, start, end);

    if (!isAvailable) {
      return { available: false, message: 'Selected dates are not available' };
    }

    return { available: true };
  }

  /**
   * Get all reservations with optional filters
   */
  async getAllReservations(filters?: { status?: string; propertyId?: string; userId?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }
    if (filters?.userId) {
      where.userId = filters.userId;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        property: {
          include: {
            city: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }

  /**
   * Get single reservation by ID
   */
  async getReservationById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            city: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    return reservation;
  }

  /**
   * Get all reservations for a specific property
   */
  async getReservationsByProperty(propertyId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { propertyId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return reservations;
  }

  /**
   * Get all reservations for a specific user
   */
  async getReservationsByUser(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }

  /**
   * Create new reservation
   */
  async createReservation(data: ReservationInput, userId?: string) {
    // Parse and validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // Validate date range
    if (startDate >= endDate) {
      throw new AppError('End date must be after start date', 400);
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (startDate < now) {
      throw new AppError('Start date cannot be in the past', 400);
    }

    // Validate guest info for non-logged users
    if (!userId && (!data.guestName || !data.guestEmail || !data.guestPhone)) {
      throw new AppError('Guest information is required for non-registered users', 400);
    }

    // Check if property exists and is available for rent
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: {
        city: true,
        user: true,
      },
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

    // Check date availability
    const isAvailable = await this.isDateRangeAvailable(data.propertyId, startDate, endDate);
    if (!isAvailable) {
      throw new AppError('Property is already booked for selected dates or dates are blocked', 400);
    }

    // Calculate nights and total price
    const nights = this.calculateNights(startDate, endDate);
    const totalPrice = property.price * nights;

    // Get user details if logged in
    const user =
      userId != null
        ? await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, phone: true },
          }) ?? null
        : null;

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        propertyId: data.propertyId,
        userId: userId || null,
        // For logged-in users, populate guest fields with user data if not provided
        guestName: data.guestName || user?.name || null,
        guestEmail: data.guestEmail || user?.email || null,
        guestPhone: data.guestPhone || user?.phone || null,
        guestCountry: data.guestCountry || null,
        startDate,
        endDate,
        nights,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        property: {
          include: {
            city: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    // Send email notification to admin
    await emailService.sendReservationNotification({
      propertyTitle: property.title,
      propertyAddress: property.address,
      cityName: property.city.name,
      guestName: reservation.guestName || undefined,
      guestEmail: reservation.guestEmail || undefined,
      guestPhone: reservation.guestPhone || undefined,
      guestCountry: reservation.guestCountry || undefined,
      userName: reservation.user?.name,
      userEmail: reservation.user?.email,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      nights: reservation.nights,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
    });

    return reservation;
  }

  /**
   * Update reservation status
   */
  async updateReservationStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            city: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    // If changing to CANCELLED, unblock the dates in a transaction
    if (status === 'CANCELLED' && reservation.status !== 'CANCELLED') {
      const result = await prisma.$transaction(async (tx) => {
        // Delete any blocked dates for this reservation
        await tx.blockedDate.deleteMany({
          where: {
            propertyId: reservation.propertyId,
            startDate: {
              gte: reservation.startDate,
            },
            endDate: {
              lte: reservation.endDate,
            },
          },
        });

        // Update reservation status
        const updated = await tx.reservation.update({
          where: { id },
          data: { status },
          include: {
            property: {
              include: {
                city: true,
              },
            },
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        });

        return updated;
      });

      return result;
    }

    // Normal status update
    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        property: {
          include: {
            city: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return updated;
  }

  /**
   * Update reservation (general update)
   */
  async updateReservation(id: string, data: UpdateReservationInput) {
    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data,
      include: {
        property: {
          include: {
            city: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return updated;
  }

  /**
   * Delete reservation
   */
  async deleteReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      throw new AppError('Reservation not found', 404);
    }

    await prisma.reservation.delete({ where: { id } });

    return { message: 'Reservation deleted successfully' };
  }

  /**
   * Cancel reservation (updates status to CANCELLED)
   */
  async cancelReservation(id: string) {
    return this.updateReservationStatus(id, 'CANCELLED');
  }

  /**
   * Get user's own reservations
   */
  async getMyReservations(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  }
}