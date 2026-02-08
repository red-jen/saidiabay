'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/utils/api';
import { formatCurrency } from '@/lib/utils/format';
import { DashboardStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyRevenue {
  month: string;
  revenue: number;
  count: number;
}

interface ExtendedStats extends DashboardStats {
  revenueByMonth: MonthlyRevenue[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<ExtendedStats>({
    overview: {
      totalProperties: 0,
      availableRentals: 0,
      availableSales: 0,
      totalReservations: 0,
      totalLeads: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      totalUsers: 0
    },
    recentReservations: [],
    recentLeads: [],
    topProperties: [],
    revenueByMonth: [],
    last12MonthsRevenue: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadMonthlyRevenue();
  }, [selectedYear, selectedMonth]);

  const loadStats = async () => {
    try {
      const response: any = await api.get('/api/stats/dashboard');
      console.log('Statistics data:', response);

      if (response.data) {
        setStats({
          overview: response.data.overview || {
            totalProperties: 0,
            availableRentals: 0,
            availableSales: 0,
            totalReservations: 0,
            totalLeads: 0,
            totalRevenue: 0,
            occupancyRate: 0,
            totalUsers: 0
          },
          recentReservations: response.data.recentReservations || [],
          recentLeads: response.data.recentLeads || [],
          topProperties: response.data.topProperties || [],
          revenueByMonth: response.data.revenueByMonth || [],
          last12MonthsRevenue: response.data.last12MonthsRevenue || []
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonthlyRevenue = async () => {
    try {
      setLoadingRevenue(true);
      const response: any = await api.get(`/api/stats/revenue?year=${selectedYear}&month=${selectedMonth}`);
      console.log('Monthly revenue:', response);

      if (response.data) {
        setMonthlyRevenue(response.data.revenue || []);
      }
    } catch (error) {
      console.error('Failed to load monthly revenue:', error);
      setMonthlyRevenue([]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Statistiques & Analyses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aperçu des Propriétés</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Propriétés</span>
              <span className="font-semibold text-xl">{stats.overview.totalProperties}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Locations Disponibles</span>
              <span className="font-semibold text-blue-600">{stats.overview.availableRentals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ventes Disponibles</span>
              <span className="font-semibold text-green-600">{stats.overview.availableSales}</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Réservations</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Réservations Actives</span>
              <span className="font-semibold text-xl">{stats.overview.totalReservations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux d'Occupation</span>
              <span className="font-semibold text-purple-600">{stats.overview.occupancyRate}%</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenus & Leads</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenu Net</span>
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

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Utilisateurs</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilisateurs Inscrits</span>
              <span className="font-semibold text-xl text-indigo-600">{stats.overview.totalUsers || 0}</span>
            </div>
          </div>
        </Card> */}
      </div>

      {/* Monthly Revenue Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenus Net pour {months[selectedMonth - 1]} {selectedYear}</CardTitle>
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {loadingRevenue ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriété</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!monthlyRevenue || monthlyRevenue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Aucune donnée disponible pour ce mois
                    </td>
                  </tr>
                ) : (
                  monthlyRevenue.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.propertyTitle || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.type || 'Réservation'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.count || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {formatCurrency(item.revenue || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

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
            <CardTitle>Meilleures Propriétés</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {!stats.topProperties || stats.topProperties.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
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
                        {property.totalBookings} réservations • {property.propertyType}
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
            <CardTitle>Métriques de Performance</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenu Moyen par Propriété</span>
              <span className="font-semibold">
                {formatCurrency(
                  stats.overview.totalProperties > 0
                    ? stats.overview.totalRevenue / stats.overview.totalProperties
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenu Moyen par Réservation</span>
              <span className="font-semibold">
                {formatCurrency(
                  stats.overview.totalReservations > 0
                    ? stats.overview.totalRevenue / stats.overview.totalReservations
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux d'Occupation Location</span>
              <span className="font-semibold text-purple-600">
                {stats.overview.occupancyRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Propriétés en Location Actives</span>
              <span className="font-semibold">{stats.overview.availableRentals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Propriétés à Vendre</span>
              <span className="font-semibold">{stats.overview.availableSales}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leads en Attente</span>
              <span className="font-semibold">{stats.overview.totalLeads}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-900 text-sm">
            <strong className="text-2xl block mb-1">{formatCurrency(stats.overview.totalRevenue)}</strong>
            Revenu total généré
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-purple-900 text-sm">
            <strong className="text-2xl block mb-1">{stats.recentLeads?.length || 0}</strong>
            Leads récents à suivre
          </p>
        </div>
        
<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-900 text-sm">
            <strong className="text-2xl block mb-1">{stats.recentReservations?.length || 0}</strong>
            Réservations récentes dans le système
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
  <p className="text-indigo-900 text-sm">
    <strong className="text-2xl block mb-1">{stats.overview.totalUsers || 0}</strong>
    Utilisateurs inscrits
  </p>
</div>
      </div>
    </div>
  );
}
