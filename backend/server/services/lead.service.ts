import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { LeadInput, UpdateLeadInput } from '../../lib/validators/lead';
import { EmailService } from './email.service';

const emailService = new EmailService();

export class LeadService {
  /**
   * Get all leads with optional filters
   */
  async getAllLeads(filters?: { status?: string; propertyId?: string; userId?: string }) {
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

    const leads = await prisma.lead.findMany({
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

    return leads;
  }

  /**
   * Get single lead by ID
   */
  async getLeadById(id: string) {
    const lead = await prisma.lead.findUnique({
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

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    return lead;
  }

  /**
   * Get all leads for a specific property
   */
  async getLeadsByProperty(propertyId: string) {
    const leads = await prisma.lead.findMany({
      where: { propertyId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads;
  }

  /**
   * Get all leads for a specific user
   */
  async getLeadsByUser(userId: string) {
    const leads = await prisma.lead.findMany({
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

    return leads;
  }

  /**
   * Create new lead
   */
  async createLead(data: LeadInput, userId?: string) {
    // Validate guest info for non-logged users
    if (!userId && (!data.guestName || !data.guestEmail)) {
      throw new AppError('Guest name and email are required for non-registered users', 400);
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: {
        city: true,
      },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    // Get user details if logged in
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true },
      });
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        propertyId: data.propertyId,
        userId: userId || null,
        guestName: data.guestName || null,
        guestEmail: data.guestEmail || null,
        guestPhone: data.guestPhone || null,
        guestCountry: data.guestCountry || null,
        message: data.message || null,
        status: 'NEW',
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
    await emailService.sendLeadNotification({
      propertyTitle: property.title,
      propertyAddress: property.address,
      propertyType: property.propertyType,
      propertyPrice: property.price,
      cityName: property.city.name,
      guestName: lead.guestName || undefined,
      guestEmail: lead.guestEmail || undefined,
      guestPhone: lead.guestPhone || undefined,
      guestCountry: lead.guestCountry || undefined,
      userName: user?.name,
      userEmail: user?.email,
      message: lead.message || undefined,
      status: lead.status,
    });

    return lead;
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(
    id: string,
    status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED'
  ) {
    const lead = await prisma.lead.findUnique({
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

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const updated = await prisma.lead.update({
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
   * Update lead (general update)
   */
  async updateLead(id: string, data: UpdateLeadInput) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { property: true }
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // If status is changing to CLOSED, update property status to SOLD
    if (data.status === 'CLOSED' && lead.status !== 'CLOSED') {
      // Use transaction to update both lead and property
      const result = await prisma.$transaction(async (tx) => {
        // Update property to SOLD
        await tx.property.update({
          where: { id: lead.propertyId },
          data: { status: 'SOLD' }
        });

        // Update lead status
        const updatedLead = await tx.lead.update({
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

        return updatedLead;
      });

      return result;
    }

    // Normal update without property status change
    const updated = await prisma.lead.update({
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
   * Delete lead
   */
  async deleteLead(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    await prisma.lead.delete({ where: { id } });

    return { message: 'Lead deleted successfully' };
  }
}