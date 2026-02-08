'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/utils/api';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import { DashboardStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const response: any = await api.get('/api/stats/dashboard');
      console.log('Dashboard stats:', response);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Set empty stats as fallback
      setStats({
        overview: {
          totalProperties: 0,
          availableRentals: 0,
          availableSales: 0,
          totalReservations: 0,
          totalLeads: 0,
          totalRevenue: 0,
          occupancyRate: 0
        },
        recentReservations: [],
        recentLeads: [],
        topProperties: [],
        revenueByMonth: [],
        last12MonthsRevenue: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Impossible de charger les statistiques</p>
        <button onClick={loadStats} className="text-blue-600 hover:underline">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-blue-600">{stats.overview.totalProperties}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.overview.availableRentals} rentals • {stats.overview.availableSales} sales
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Active Reservations</p>
            <p className="text-3xl font-bold text-purple-600">{stats.overview.totalReservations}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.overview.occupancyRate}% occupancy rate
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-green-600">{stats.overview.totalLeads}</p>
            <p className="text-xs text-gray-500 mt-1">Sales inquiries</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Revenu Net</p>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(stats.overview.totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Réservations confirmées + Ventes fermées</p>
          </div>
        </Card>
      </div>

      {/* Revenue Chart - Last 12 Months */}
      {stats.last12MonthsRevenue && stats.last12MonthsRevenue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenu Net - 12 derniers mois</CardTitle>
          </CardHeader>
          <div className="h-80 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.last12MonthsRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="monthName"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value?: number) => [formatCurrency(value ?? 0), 'Revenu Net']}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {stats.recentReservations.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent reservations</p>
            ) : (
              stats.recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{reservation.propertyTitle}</p>
                    <p className="text-sm text-gray-500">
                      {reservation.guestName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(reservation.totalPrice)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      reservation.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800' 
                        : reservation.status === 'PRE_RESERVED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {stats.recentLeads.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent leads</p>
            ) : (
              stats.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.propertyTitle}</p>
                    <p className="text-xs text-gray-400">{lead.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      lead.status === 'NEW' 
                        ? 'bg-blue-100 text-blue-800' 
                        : lead.status === 'CONTACTED'
                        ? 'bg-purple-100 text-purple-800'
                        : lead.status === 'QUALIFIED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(lead.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Properties</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {stats.topProperties.length === 0 ? (
            <p className="text-gray-500 text-sm">No property data yet</p>
          ) : (
            stats.topProperties.map((property) => (
              <div key={property.propertyId} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{property.propertyTitle}</p>
                  <p className="text-sm text-gray-500">
                    {property.totalBookings} bookings • {property.propertyType}
                  </p>
                </div>
                <p className="font-semibold text-green-600">
                  {formatCurrency(property.totalRevenue)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}