'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiCalendar, FiHeart, FiSettings, FiLogOut, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { reservationsApi, usersApi } from '@/lib/api';
import { Reservation } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationsApi.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'reservations', label: 'My Reservations', icon: FiCalendar },
    { id: 'favorites', label: 'Saved Properties', icon: FiHeart },
    { id: 'profile', label: 'Profile Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-primary-100">
                Manage your reservations and saved properties
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 text-2xl font-bold mb-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {user.name}
                  </h3>
                  <p className="text-sm text-secondary-600">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                          ${isActive
                            ? 'bg-primary-50 text-primary-900 font-medium'
                            : 'text-secondary-700 hover:bg-secondary-50'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Dashboard Overview
                  </h2>

                  {/* Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                          <FiCalendar className="w-6 h-6 text-primary-700" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                        {reservations.length}
                      </h3>
                      <p className="text-secondary-600">Total Reservations</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                          <FiHeart className="w-6 h-6 text-accent-700" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-1">0</h3>
                      <p className="text-secondary-600">Saved Properties</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-success-100 flex items-center justify-center">
                          <FiSettings className="w-6 h-6 text-success-700" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                        {user.role === 'admin' ? 'Admin' : 'Client'}
                      </h3>
                      <p className="text-secondary-600">Account Type</p>
                    </div>
                  </div>

                  {/* Recent Reservations */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                      Recent Reservations
                    </h3>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton h-20" />
                        ))}
                      </div>
                    ) : reservations.length > 0 ? (
                      <div className="space-y-4">
                        {reservations.slice(0, 5).map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-secondary-900 mb-1">
                                {reservation.property?.title || 'Property'}
                              </h4>
                              <p className="text-sm text-secondary-600">
                                {new Date(reservation.startDate).toLocaleDateString()} -{' '}
                                {new Date(reservation.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reservation.status === 'confirmed'
                                ? 'bg-success-100 text-success-700'
                                : reservation.status === 'pending'
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-danger-100 text-danger-700'
                            }`}>
                              {reservation.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-secondary-600 py-8">
                        You haven't made any reservations yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reservations' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    My Reservations
                  </h2>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-32" />
                      ))}
                    </div>
                  ) : reservations.length > 0 ? (
                    <div className="space-y-6">
                      {reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                  {reservation.property?.title || 'Property'}
                                </h3>
                                {reservation.property?.location && (
                                  <p className="flex items-center gap-1 text-secondary-600">
                                    <FiMapPin className="w-4 h-4" />
                                    {reservation.property.location}
                                  </p>
                                )}
                              </div>
                              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                reservation.status === 'confirmed'
                                  ? 'bg-success-100 text-success-700'
                                  : reservation.status === 'pending'
                                  ? 'bg-warning-100 text-warning-700'
                                  : 'bg-danger-100 text-danger-700'
                              }`}>
                                {reservation.status}
                              </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Check-in</p>
                                <p className="font-semibold text-secondary-900">
                                  {new Date(reservation.startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Check-out</p>
                                <p className="font-semibold text-secondary-900">
                                  {new Date(reservation.endDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Total Price</p>
                                <p className="font-semibold text-primary-900">
                                  ${reservation.totalPrice?.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-secondary-200">
                              <p className="text-sm text-secondary-600">
                                Guests: {reservation.numberOfGuests || 'N/A'} • Booked on{' '}
                                {new Date(reservation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <FiCalendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        No Reservations Yet
                      </h3>
                      <p className="text-secondary-600 mb-6">
                        Start exploring our properties and make your first reservation!
                      </p>
                      <Link href="/properties" className="btn-primary">
                        Browse Properties
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Saved Properties
                  </h2>
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <FiHeart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      No Saved Properties
                    </h3>
                    <p className="text-secondary-600 mb-6">
                      Save properties you're interested in to easily find them later.
                    </p>
                    <Link href="/properties" className="btn-primary">
                      Browse Properties
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Profile Settings
                  </h2>
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <form className="space-y-6">
                      <div>
                        <label className="label">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="input"
                          disabled
                        />
                        <p className="text-xs text-secondary-500 mt-1">
                          Contact support to change your email address
                        </p>
                      </div>
                      <div>
                        <label className="label">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+212 XXX XXX XXX"
                          className="input"
                        />
                      </div>
                      <div className="divider" />
                      <div>
                        <h3 className="font-semibold text-secondary-900 mb-4">
                          Change Password
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="label">Current Password</label>
                            <input type="password" className="input" />
                          </div>
                          <div>
                            <label className="label">New Password</label>
                            <input type="password" className="input" />
                          </div>
                          <div>
                            <label className="label">Confirm New Password</label>
                            <input type="password" className="input" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                        <button type="button" className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

