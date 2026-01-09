'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/utils/api';
import { formatDate, formatCurrency } from '@/lib/utils/format';

interface Reservation {
  id: string;
  property: {
    id: string;
    title: string;
    thumbnail: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PRE_RESERVED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export default function UserReservationsPage() {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response: any = await api.get('/api/reservations/my');
      setReservations(response.data);
    } catch (error: any) {
      showToast(error.message || 'Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PRE_RESERVED: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      PRE_RESERVED: 'En attente',
      CONFIRMED: 'Confirmée',
      CANCELLED: 'Annulée',
      COMPLETED: 'Terminée',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Mes Réservations
            </h1>
            <div className="flex gap-3">
              <Link href="/user/profile">
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Mon Profil
                </button>
              </Link>
              <Link href="/">
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Accueil
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card padding="none">
          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Vous n'avez aucune réservation</p>
              <Link href="/">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Découvrir nos biens
                </button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bien</TableHead>
                  <TableHead>Période de location</TableHead>
                  <TableHead>Nuits</TableHead>
                  <TableHead>Prix total</TableHead>
                  <TableHead>Date de réservation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={reservation.property.thumbnail}
                          alt={reservation.property.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{reservation.property.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {formatDate(reservation.startDate)}
                        </p>
                        <p className="text-gray-500">↓</p>
                        <p className="font-medium">
                          {formatDate(reservation.endDate)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {calculateNights(reservation.startDate, reservation.endDate)} nuits
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(reservation.totalPrice)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(reservation.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell>
                      <Link href={`/property/${reservation.property.id}`}>
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Voir le bien
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Stats Summary */}
        {reservations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total réservations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.length}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reservations.filter((r) => r.status === 'PRE_RESERVED').length}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Confirmées</p>
                <p className="text-2xl font-bold text-green-600">
                  {reservations.filter((r) => r.status === 'CONFIRMED').length}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total dépensé</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    reservations
                      .filter((r) => r.status === 'CONFIRMED' || r.status === 'COMPLETED')
                      .reduce((sum, r) => sum + r.totalPrice, 0)
                  )}
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}