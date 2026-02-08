import { prisma } from '../config/database';

export class StatsService {
  async getDashboardStats() {
    const [
      totalProperties,
      totalReservations,
      totalLeads,
      confirmedReservationsRevenue,
      closedLeadsRevenue,
      availableRentals,
      availableSales,
      recentReservations,
      recentLeads,
      topProperties,
      revenueByMonth,
      last12MonthsRevenue,
      totalUsers,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.reservation.count({ where: { status: { in: ['CONFIRMED', 'PENDING'] } } }),
      prisma.lead.count(),
      // Only count CONFIRMED reservations for revenue
      prisma.reservation.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalPrice: true }
      }),
      // Only count CLOSED leads for revenue
      prisma.sale.aggregate({
        where: { status: 'closed' },
        _sum: { amount: true }
      }),
      prisma.property.count({ where: { propertyType: 'RENT', status: 'AVAILABLE' } }),
      prisma.property.count({ where: { propertyType: 'SALE', status: 'AVAILABLE' } }),
      this.getRecentReservations(),
      this.getRecentLeads(),
      this.getTopProperties(),
      this.getRevenueByMonth(),
      this.getLast12MonthsRevenue(),
      prisma.user.count(),
    ]);

    // Calculate occupancy rate for rentals
    const totalRentalProperties = await prisma.property.count({ where: { propertyType: 'RENT' } });
    const occupancyRate = totalRentalProperties > 0
      ? ((totalReservations / totalRentalProperties) * 100).toFixed(1)
      : '0';

    // Calculate total net revenue (confirmed reservations + closed leads)
    const totalNetRevenue =
      (confirmedReservationsRevenue._sum.totalPrice || 0) +
      (closedLeadsRevenue._sum.amount || 0);

    return {
      overview: {
        totalProperties,
        totalReservations,
        totalLeads,
        totalRevenue: totalNetRevenue,
        availableRentals,
        availableSales,
        occupancyRate: parseFloat(occupancyRate),
        totalUsers,
      },
      recentReservations,
      recentLeads,
      topProperties,
      revenueByMonth,
      last12MonthsRevenue,
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
      name: lead.guestName,
      email: lead.guestEmail,
      phone: lead.guestPhone,
      status: lead.status,
      createdAt: lead.createdAt,
    }));
  }

  private async getTopProperties() {
    const reservationStats = await prisma.reservation.groupBy({
      by: ['propertyId'],
      where: { status: { in: ['CONFIRMED', 'PENDING'] } },
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

  async getMonthlyRevenue(year: number, month: number) {
    // Create date range for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Get CONFIRMED reservations for the month
    const reservations = await prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        property: {
          select: {
            title: true,
            listingType: true
          }
        }
      }
    });

    // Get CLOSED sales (from Sale model) for the month
    const sales = await prisma.sale.findMany({
      where: {
        status: 'closed',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        propertyId: true,
        amount: true
      }
    });

    // Get property titles for sales
    const propertyIds = [...new Set(sales.map(s => s.propertyId))];
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: { id: true, title: true }
    });
    const propertyMap = new Map(properties.map(p => [p.id, p.title]));

    // Group revenue by property
    const revenueByProperty: Record<string, {
      propertyTitle: string;
      type: string;
      count: number;
      revenue: number;
    }> = {};

    // Add confirmed reservations
    reservations.forEach((reservation) => {
      const key = reservation.propertyId;
      if (!revenueByProperty[key]) {
        revenueByProperty[key] = {
          propertyTitle: reservation.property.title,
          type: 'Réservation',
          count: 0,
          revenue: 0
        };
      }
      revenueByProperty[key].count += 1;
      revenueByProperty[key].revenue += reservation.totalPrice;
    });

    // Add closed sales
    sales.forEach((sale) => {
      const key = `sale_${sale.propertyId}`;
      if (!revenueByProperty[key]) {
        revenueByProperty[key] = {
          propertyTitle: propertyMap.get(sale.propertyId) || 'Propriété inconnue',
          type: 'Vente',
          count: 0,
          revenue: 0
        };
      }
      revenueByProperty[key].count += 1;
      revenueByProperty[key].revenue += sale.amount;
    });

    return Object.values(revenueByProperty);
  }

  private async getLast12MonthsRevenue() {
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Get CONFIRMED reservations from last 12 months
    const reservations = await prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED',
        createdAt: { gte: twelveMonthsAgo }
      },
      select: { createdAt: true, totalPrice: true }
    });

    // Get CLOSED sales (leads) from last 12 months
    const sales = await prisma.sale.findMany({
      where: {
        status: 'closed',
        createdAt: { gte: twelveMonthsAgo }
      },
      select: { createdAt: true, amount: true }
    });

    // Initialize all 12 months with zero revenue
    const monthlyData: Record<string, { month: string; monthName: string; revenue: number }> = {};

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthName = monthNames[date.getMonth()];

      monthlyData[monthKey] = {
        month: monthKey,
        monthName: `${monthName} ${date.getFullYear().toString().slice(-2)}`,
        revenue: 0
      };
    }

    // Add reservation revenue
    reservations.forEach((reservation) => {
      const monthKey = reservation.createdAt.toISOString().substring(0, 7);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += reservation.totalPrice;
      }
    });

    // Add sales revenue
    sales.forEach((sale) => {
      const monthKey = sale.createdAt.toISOString().substring(0, 7);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += sale.amount;
      }
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }
}