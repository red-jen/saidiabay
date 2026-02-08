'use client';

import { useState } from 'react';
import PropertyCalendar from './PropertyCalendar';

interface Property {
  id: string;
  title: string;
  price: number;
  [key: string]: any;
}

interface SelectedDates {
  startDate: Date;
  endDate: Date;
  nights: number;
  totalPrice: number;
}

interface PropertyReservationFormProps {
  property: Property;
}

export default function PropertyReservationForm({ property }: PropertyReservationFormProps) {
  const [selectedDates, setSelectedDates] = useState<SelectedDates | null>(null);
  const [guestInfo, setGuestInfo] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestCountry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDates) {
      setError('Veuillez sélectionner des dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          startDate: selectedDates.startDate.toISOString(),
          endDate: selectedDates.endDate.toISOString(),
          ...guestInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setSuccess(true);
      setGuestInfo({ guestName: '', guestEmail: '', guestPhone: '', guestCountry: '' });

      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div>
          <PropertyCalendar
            property={property}
            onDatesSelected={(dates) => setSelectedDates(dates)}
          />
        </div>

        {/* Reservation Form Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Informations de réservation
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guest Name */}
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="guestName"
                required
                value={guestInfo.guestName}
                onChange={(e) => setGuestInfo({ ...guestInfo, guestName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom"
              />
            </div>

            {/* Guest Email */}
            <div>
              <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="guestEmail"
                required
                value={guestInfo.guestEmail}
                onChange={(e) => setGuestInfo({ ...guestInfo, guestEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            {/* Guest Phone */}
            <div>
              <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="guestPhone"
                required
                value={guestInfo.guestPhone}
                onChange={(e) => setGuestInfo({ ...guestInfo, guestPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+212 6XX XXX XXX"
              />
            </div>

            {/* Guest Country */}
            <div>
              <label htmlFor="guestCountry" className="block text-sm font-medium text-gray-700 mb-2">
                Pays (optionnel)
              </label>
              <input
                type="text"
                id="guestCountry"
                value={guestInfo.guestCountry}
                onChange={(e) => setGuestInfo({ ...guestInfo, guestCountry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Maroc"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Réservation créée avec succès ! Vous recevrez un email de confirmation.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedDates || loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                !selectedDates || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </button>

            {/* Price Display */}
            {selectedDates && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  {selectedDates.nights} nuit{selectedDates.nights > 1 ? 's' : ''} • {' '}
                  {property.price.toLocaleString('fr-MA')} DH / nuit
                </div>
                <div className="text-lg font-bold text-gray-900">
                  Total: {selectedDates.totalPrice.toLocaleString('fr-MA')} DH
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
