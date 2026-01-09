import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { LeadInput, UpdateLeadInput } from '../../lib/validators/lead';

export class LeadService {
  async getAllLeads(filters?: { status?: string; propertyId?: string }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        property: {
          select: { id: true, title: true, price: true, city: true, propertyType: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads;
  }

  async getLeadById(id: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        property: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    return lead;
  }

  async createLead(data: LeadInput, userId?: string) {
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const lead = await prisma.lead.create({
      data: {
        ...data,
        userId,
        status: 'NEW',
      },
      include: {
        property: {
          select: { id: true, title: true },
        },
      },
    });

    return lead;
  }

  async updateLead(id: string, data: UpdateLeadInput) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const updated = await prisma.lead.update({
      where: { id },
      data,
      include: {
        property: true,
      },
    });

    return updated;
  }

  async deleteLead(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    await prisma.lead.delete({ where: { id } });

    return { message: 'Lead deleted successfully' };
  }
}