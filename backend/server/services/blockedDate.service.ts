import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

interface BlockedDateInput {
  propertyId: string;
  startDate: Date | string;
  endDate: Date | string;
  reason?: string;
}

export class BlockedDateService {
  /**
   * Create blocked date range for a property
   */
  async createBlockedDate(data: BlockedDateInput) {
    // Parse dates
    const startDate = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
    const endDate = typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate;

    // Validate dates
    if (startDate >= endDate) {
      throw new AppError('End date must be after start date', 400);
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (startDate < now) {
      throw new AppError('Start date cannot be in the past', 400);
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    // Check for overlapping blocked dates
    const overlapping = await prisma.blockedDate.findFirst({
      where: {
        propertyId: data.propertyId,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping) {
      throw new AppError('There is already a blocked date range overlapping with the selected dates', 400);
    }

    // Check for overlapping reservations
    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        propertyId: data.propertyId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlappingReservation) {
      throw new AppError('Cannot block dates that have existing reservations', 400);
    }

    // Create blocked date
    const blockedDate = await prisma.blockedDate.create({
      data: {
        propertyId: data.propertyId,
        startDate,
        endDate,
        reason: data.reason || null,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    });

    return blockedDate;
  }

  /**
   * Get single blocked date by ID
   */
  async getBlockedDateById(id: string) {
    const blockedDate = await prisma.blockedDate.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    });

    if (!blockedDate) {
      throw new AppError('Blocked date not found', 404);
    }

    return blockedDate;
  }

  /**
   * Get all blocked dates for a specific property
   */
  async getBlockedDatesByProperty(propertyId: string) {
    const blockedDates = await prisma.blockedDate.findMany({
      where: { propertyId },
      orderBy: { startDate: 'asc' },
    });

    return blockedDates;
  }

  /**
   * Get blocked dates within a specific date range
   */
  async getBlockedDatesInRange(
    propertyId: string,
    startDate: Date | string,
    endDate: Date | string
  ) {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        propertyId,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
      orderBy: { startDate: 'asc' },
    });

    return blockedDates;
  }

  /**
   * Check if any dates in range are blocked
   */
  async checkIfDateBlocked(
    propertyId: string,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<{ blocked: boolean; blockedDate?: any }> {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const blockedDate = await prisma.blockedDate.findFirst({
      where: {
        propertyId,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (blockedDate) {
      return { blocked: true, blockedDate };
    }

    return { blocked: false };
  }

  /**
   * Delete blocked date
   */
  async deleteBlockedDate(id: string) {
    const blockedDate = await prisma.blockedDate.findUnique({
      where: { id },
    });

    if (!blockedDate) {
      throw new AppError('Blocked date not found', 404);
    }

    await prisma.blockedDate.delete({
      where: { id },
    });

    return { message: 'Blocked date deleted successfully' };
  }

  /**
   * Update blocked date
   */
  async updateBlockedDate(id: string, data: Partial<BlockedDateInput>) {
    const blockedDate = await prisma.blockedDate.findUnique({
      where: { id },
    });

    if (!blockedDate) {
      throw new AppError('Blocked date not found', 404);
    }

    // Parse dates if provided
    const updateData: any = {};

    if (data.startDate) {
      updateData.startDate = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
    }

    if (data.endDate) {
      updateData.endDate = typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate;
    }

    if (data.reason !== undefined) {
      updateData.reason = data.reason;
    }

    // Validate dates if both are being updated
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        throw new AppError('End date must be after start date', 400);
      }
    }

    const updated = await prisma.blockedDate.update({
      where: { id },
      data: updateData,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Get all blocked dates (admin only)
   */
  async getAllBlockedDates() {
    const blockedDates = await prisma.blockedDate.findMany({
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blockedDates;
  }
}
