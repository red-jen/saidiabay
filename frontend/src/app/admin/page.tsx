'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiImage,
  FiTrendingUp,
  FiDollarSign,
  FiEye,
  FiBarChart2,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { propertiesApi, usersApi, reservationsApi } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    reservations: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch stats from APIs - use type assertion for the fallback objects
      type PaginatedResponse = { pagination?: { total: number } };

      const [propertiesRes, usersRes, reservationsRes] = await Promise.all([
        propertiesApi.getAll({ page: 1, limit: 1 }).catch((): PaginatedResponse => ({ pagination: { total: 0 } })),
        usersApi.getAll({ page: 1, limit: 1 }).catch((): PaginatedResponse => ({ pagination: { total: 0 } })),
        reservationsApi.getAll({ page: 1, limit: 1 }).catch((): PaginatedResponse => ({ pagination: { total: 0 } })),
      ]);

      setStats({
        properties: (propertiesRes as PaginatedResponse).pagination?.total || 0,
        users: (usersRes as PaginatedResponse).pagination?.total || 0,
        reservations: (reservationsRes as PaginatedResponse).pagination?.total || 0,
        revenue: 0, // Calculate from reservations
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock data for development
      setStats({
        properties: 45,
        users: 128,
        reservations: 67,
        revenue: 145000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  const managementCards = [
    {
      title: 'Properties',
      description: 'Manage all property listings',
      icon: FiHome,
      href: '/admin/properties',
      color: 'primary',
      count: stats.properties,
    },
    {
      title: 'Users',
      description: 'Manage user accounts and roles',
      icon: FiUsers,
      href: '/admin/users',
      color: 'accent',
      count: stats.users,
    },
    {
      title: 'Reservations',
      description: 'View and manage bookings',
      icon: FiCalendar,
      href: '/admin/reservations',
      color: 'success',
      count: stats.reservations,
    },
    {
      title: 'Blog Posts',
      description: 'Create and edit blog content',
      icon: FiFileText,
      href: '/admin/blog',
      color: 'warning',
      count: 0,
    },
    {
      title: 'Ads & Banners',
      description: 'Manage hero sliders and ads',
      icon: FiImage,
      href: '/admin/ads',
      color: 'danger',
      count: 0,
    },
    {
      title: 'Analytics',
      description: 'View insights and reports',
      icon: FiBarChart2,
      href: '/admin/analytics',
      color: 'secondary',
      count: null,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-primary-100">
            Manage your real estate platform
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="section">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Properties */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                  <FiHome className="w-7 h-7 text-primary-700" />
                </div>
                <span className="text-sm font-medium text-success-600">
                  +12%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                {loading ? '...' : stats.properties}
              </h3>
              <p className="text-secondary-600">Total Properties</p>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-accent-100 flex items-center justify-center">
                  <FiUsers className="w-7 h-7 text-accent-700" />
                </div>
                <span className="text-sm font-medium text-success-600">
                  +28%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                {loading ? '...' : stats.users}
              </h3>
              <p className="text-secondary-600">Total Users</p>
            </div>

            {/* Total Reservations */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-success-100 flex items-center justify-center">
                  <FiCalendar className="w-7 h-7 text-success-700" />
                </div>
                <span className="text-sm font-medium text-success-600">
                  +15%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                {loading ? '...' : stats.reservations}
              </h3>
              <p className="text-secondary-600">Total Reservations</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-warning-100 flex items-center justify-center">
                  <FiDollarSign className="w-7 h-7 text-warning-700" />
                </div>
                <span className="text-sm font-medium text-success-600">
                  +24%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                ${loading ? '...' : stats.revenue.toLocaleString()}
              </h3>
              <p className="text-secondary-600">Total Revenue</p>
            </div>
          </div>

          {/* Management Cards */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
              Management Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-${card.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 text-${card.color}-700`} />
                      </div>
                      {card.count !== null && (
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold">
                          {card.count}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-secondary-600 mb-4">
                      {card.description}
                    </p>
                    <span className="text-primary-700 font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                      Manage
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-secondary-900 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  action: 'New property listed',
                  details: 'Luxury Beachfront Villa in Saidia',
                  time: '2 hours ago',
                  icon: FiHome,
                  color: 'primary',
                },
                {
                  action: 'New reservation',
                  details: 'Modern Apartment - 7 nights',
                  time: '5 hours ago',
                  icon: FiCalendar,
                  color: 'success',
                },
                {
                  action: 'New user registered',
                  details: 'john.doe@example.com',
                  time: '1 day ago',
                  icon: FiUsers,
                  color: 'accent',
                },
                {
                  action: 'Blog post published',
                  details: 'Top 10 Investment Tips for 2024',
                  time: '2 days ago',
                  icon: FiFileText,
                  color: 'warning',
                },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${activity.color}-700`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-secondary-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-secondary-600 truncate">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-sm text-secondary-500 flex-shrink-0">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

