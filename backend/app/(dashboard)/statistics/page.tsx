'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/utils/api';
import { formatCurrency } from '@/lib/utils/format';
import { DashboardStats } from '@/types';

export default function StatisticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response: any = await api.get('/api/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load statistics</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Properties Overview</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Properties</span>
              <span className="font-semibold text-xl">{stats.overview.totalProperties}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Rentals</span>
              <span className="font-semibold text-blue-600">{stats.overview.availableRentals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Sales</span>
              <span className="font-semibold text-green-600">{stats.overview.availableSales}</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reservations</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Reservations</span>
              <span className="font-semibold text-xl">{stats.overview.totalReservations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="font-semibold text-purple-600">{stats.overview.occupancyRate}%</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue & Leads</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats.overview.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Leads</span>
              <span className="font-semibold text-orange-600">{stats.overview.totalLeads}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Month</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.revenueByMonth.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                stats.revenueByMonth.map((month) => (
                  <tr key={month.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{month.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{month.count}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {formatCurrency(month.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {stats.topProperties.length === 0 ? (
              <p className="text-gray-500 text-sm">No property data available</p>
            ) : (
              stats.topProperties.map((property, index) => (
                <div key={property.propertyId} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{property.propertyTitle}</p>
                      <p className="text-sm text-gray-500">
                        {property.totalBookings} bookings • {property.propertyType}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(property.totalRevenue)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Revenue per Property</span>
              <span className="font-semibold">
                {formatCurrency(
                  stats.overview.totalProperties > 0 
                    ? stats.overview.totalRevenue / stats.overview.totalProperties 
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Revenue per Reservation</span>
              <span className="font-semibold">
                {formatCurrency(
                  stats.overview.totalReservations > 0 
                    ? stats.overview.totalRevenue / stats.overview.totalReservations 
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rental Occupancy Rate</span>
              <span className="font-semibold text-purple-600">
                {stats.overview.occupancyRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Rental Properties</span>
              <span className="font-semibold">{stats.overview.availableRentals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Properties for Sale</span>
              <span className="font-semibold">{stats.overview.availableSales}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Leads</span>
              <span className="font-semibold">{stats.overview.totalLeads}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-900 text-sm">
            <strong className="text-2xl block mb-1">{stats.recentReservations.length}</strong>
            Recent reservations in the system
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-900 text-sm">
            <strong className="text-2xl block mb-1">{formatCurrency(stats.overview.totalRevenue)}</strong>
            Total revenue generated
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-purple-900 text-sm">
            <strong className="text-2xl block mb-1">{stats.recentLeads.length}</strong>
            Recent leads to follow up
          </p>
        </div>
      </div>
    </div>
  );
}