'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/utils/api';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Reservation } from '@/types';
import { useToast } from '@/components/ui/Toast';

// Status mapping for display
const STATUS_DISPLAY: Record<string, string> = {
  'PENDING': 'Pré-réservée',
  'CONFIRMED': 'Confirmée',
  'CANCELLED': 'Annulée',
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('PENDING');
  const { showToast } = useToast();

  useEffect(() => {
    loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadReservations = async () => {
    try {
      const url = filter === 'ALL' 
        ? '/api/reservations' 
        : `/api/reservations?status=${filter}`;
      const response: any = await api.get(url);
      setReservations(response.data);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/reservations/${id}`, { status });
      showToast(`Réservation ${status.toLowerCase()}`, 'success');
      loadReservations();
    } catch (error) {
      showToast('Erreur de mise à jour', 'error');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Annuler cette réservation ?')) return;

    try {
      await api.post(`/api/reservations/${id}/cancel`, {});
      showToast('Réservation annulée', 'success');
      loadReservations();
    } catch (error) {
      showToast('Erreur d\'annulation', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
      </div>

      <div className="flex gap-2">
        
        <Button
          variant={filter === 'PENDING' ? 'primary' : 'ghost'}
          onClick={() => setFilter('PENDING')}
          size="sm"
        >
          Pré-réservées
        </Button>
        <Button
          variant={filter === 'CONFIRMED' ? 'primary' : 'ghost'}
          onClick={() => setFilter('CONFIRMED')}
          size="sm"
        >
          Confirmées
        </Button>
        <Button
          variant={filter === 'CANCELLED' ? 'primary' : 'ghost'}
          onClick={() => setFilter('CANCELLED')}
          size="sm"
        >
          Annulées
        </Button>
        <Button
          variant={filter === 'ALL' ? 'primary' : 'ghost'}
          onClick={() => setFilter('ALL')}
          size="sm"
        >
          Toutes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reservations.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-500">
              Aucune réservation trouvée
            </div>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id}>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {reservation.property?.title || 'Propriété'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {reservation.property?.city?.name || 'N/A'} • {reservation.property?.address || ''}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <strong>Client:</strong> {reservation.guestName}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {reservation.guestEmail}
                    </p>
                    <p className="text-gray-700">
                      <strong>Tél:</strong> {reservation.guestPhone}
                    </p>
                    {reservation.message && (
                      <p className="text-gray-700">
                        <strong>Message:</strong> {reservation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Dates</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(reservation.startDate)}
                  </p>
                  <p className="text-gray-500 text-sm">au</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(reservation.endDate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Total:</strong> {formatCurrency(reservation.totalPrice)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 text-sm rounded text-center ${
                    reservation.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : reservation.status === 'PRE_RESERVED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {STATUS_DISPLAY[reservation.status] || reservation.status}
                  </span>

                  {reservation.status !== 'CANCELLED' && (
                    <>
                      <p className="text-xs text-gray-600 mb-1">Changer le statut</p>
                      <select
                        value={reservation.status}
                        onChange={(e) => {
                          if (e.target.value === 'CANCELLED') {
                            if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ? Les dates seront débloquées.')) {
                              handleCancel(reservation.id);
                            }
                          } else {
                            handleUpdateStatus(reservation.id, e.target.value);
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">Pré-réservée</option>
                        <option value="CONFIRMED">Confirmée</option>
                        <option value="CANCELLED">Annulée</option>
                      </select>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}