import { prisma } from '../config/database';

export class StatsService {
  async getDashboardStats() {
    const [
      totalProperties,
      totalReservations,
      totalLeads,
      totalRevenue,
      availableRentals,
      availableSales,
      recentReservations,
      recentLeads,
      topProperties,
      revenueByMonth,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.reservation.count({ where: { status: { in: ['CONFIRMED', 'PRE_RESERVED'] } } }),
      prisma.lead.count(),
      prisma.sale.aggregate({ _sum: { amount: true } }),
      prisma.property.count({ where: { propertyType: 'RENT', status: 'AVAILABLE' } }),
      prisma.property.count({ where: { propertyType: 'SALE', status: 'AVAILABLE' } }),
      this.getRecentReservations(),
      this.getRecentLeads(),
      this.getTopProperties(),
      this.getRevenueByMonth(),
    ]);

    // Calculate occupancy rate for rentals
    const totalRentalProperties = await prisma.property.count({ where: { propertyType: 'RENT' } });
    const occupancyRate = totalRentalProperties > 0 
      ? ((totalReservations / totalRentalProperties) * 100).toFixed(1)
      : '0';

    return {
      overview: {
        totalProperties,
        totalReservations,
        totalLeads,
        totalRevenue: totalRevenue._sum.amount || 0,
        availableRentals,
        availableSales,
        occupancyRate: parseFloat(occupancyRate),
      },
      recentReservations,
      recentLeads,
      topProperties,
      revenueByMonth,
    };
  }

  private async getRecentReservations() {
    const reservations = await prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { title: true } },
      },
    });

    return reservations.map((res) => ({
      id: res.id,
      propertyTitle: res.property.title,
      guestName: res.guestName,
      startDate: res.startDate,
      endDate: res.endDate,
      status: res.status,
      totalPrice: res.totalPrice,
    }));
  }

  private async getRecentLeads() {
    const leads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { title: true } },
      },
    });

    return leads.map((lead) => ({
      id: lead.id,
      propertyTitle: lead.property.title,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      createdAt: lead.createdAt,
    }));
  }

  private async getTopProperties() {
    const reservationStats = await prisma.reservation.groupBy({
      by: ['propertyId'],
      where: { status: { in: ['CONFIRMED', 'PRE_RESERVED'] } },
      _count: { id: true },
      _sum: { totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 5,
    });

    const topProperties = await Promise.all(
      reservationStats.map(async (stat) => {
        const property = await prisma.property.findUnique({
          where: { id: stat.propertyId },
          select: { title: true, propertyType: true },
        });

        return {
          propertyId: stat.propertyId,
          propertyTitle: property?.title || 'Unknown',
          propertyType: property?.propertyType || 'RENT',
          totalBookings: stat._count.id,
          totalRevenue: stat._sum.totalPrice || 0,
        };
      })
    );

    return topProperties;
  }

  private async getRevenueByMonth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sales = await prisma.sale.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, amount: true },
    });

    const monthlyData: Record<string, { month: string; revenue: number; count: number }> = {};

    sales.forEach((sale) => {
      const monthKey = sale.createdAt.toISOString().substring(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0, count: 0 };
      }
      monthlyData[monthKey].revenue += sale.amount;
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }
}