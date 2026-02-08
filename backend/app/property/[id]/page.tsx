'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import PropertyCalendar from '@/components/PropertyCalendar';
import ReservationModal from '@/components/ReservationModal';

interface SelectedDates {
  startDate: Date;
  endDate: Date;
  nights: number;
  totalPrice: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<SelectedDates | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reservationMade, setReservationMade] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadProperty();
    checkIfAlreadyReserved();
  }, [params.id]);

  const loadProperty = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/properties/${params.id}`
      );

      if (!response.ok) {
        throw new Error('Property not found');
      }

      const data = await response.json();
      console.log('Property data:', data);
      setProperty(data.data);
    } catch (error) {
      console.error('Error loading property:', error);
      showToast('Propriété non trouvée', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfAlreadyReserved = () => {
    const reservation = localStorage.getItem(`reservation_${params.id}`);
    if (reservation) {
      try {
        const data = JSON.parse(reservation);

        // Check if 24 hours have passed since reservation
        const reservationTime = new Date(data.timestamp).getTime();
        const currentTime = Date.now();
        const hoursPassed = (currentTime - reservationTime) / (1000 * 60 * 60);

        if (hoursPassed >= 24) {
          // Expired - remove and show normal view
          localStorage.removeItem(`reservation_${params.id}`);
          setReservationMade(false);
          return;
        }

        // Still valid - show success message
        setReservationMade(true);
        // Convert date strings back to Date objects if they exist
        if (data.dates) {
          const dates = {
            startDate: new Date(data.dates.startDate),
            endDate: new Date(data.dates.endDate),
            nights: data.dates.nights,
            totalPrice: data.dates.totalPrice,
          };
          setSelectedDates(dates);
        }
      } catch (error) {
        console.error('Error loading reservation from localStorage:', error);
        // If error parsing, remove the corrupted data
        localStorage.removeItem(`reservation_${params.id}`);
      }
    }
  };

  const handleReserveClick = () => {
    if (!selectedDates && property?.listingType === 'LOCATION') {
      showToast('Veuillez sélectionner des dates', 'error');
      return;
    }
    setShowModal(true);
  };

  const handleReservationSuccess = () => {
    // Store dates as ISO strings for localStorage compatibility
    const dataToStore = {
      timestamp: new Date().toISOString(),
      dates: selectedDates ? {
        startDate: selectedDates.startDate.toISOString(),
        endDate: selectedDates.endDate.toISOString(),
        nights: selectedDates.nights,
        totalPrice: selectedDates.totalPrice,
      } : null,
    };
    localStorage.setItem(`reservation_${params.id}`, JSON.stringify(dataToStore));
    setReservationMade(true);
    setShowModal(false);
    showToast('Réservation envoyée avec succès!', 'success');
  };

  const getWhatsAppLink = () => {
    if (!property) return '';
    const phone = '212605911322';
    let message = `Bonjour, je suis intéressé(e) par votre propriété "${property.title}".`;
    if (property.listingType === 'LOCATION' && selectedDates) {
      message += `\n\nDates: ${selectedDates.startDate.toLocaleDateString('fr-FR')} - ${selectedDates.endDate.toLocaleDateString('fr-FR')}\nTotal: ${selectedDates.totalPrice.toLocaleString('fr-MA')} DH`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Propriété non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette propriété n'existe pas ou a été supprimée.</p>
          <Button onClick={() => router.push('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push('/')}>
            ← Retour
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Property Info */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={property.thumbnail}
                alt={property.title}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Additional Images */}
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {property.images.slice(0, 3).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`${property.title} ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    property.listingType === 'LOCATION'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {property.listingType === 'LOCATION' ? 'Location' : 'Vente'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <p className="text-gray-600 mb-4 flex items-center gap-2">
                📍 {property.city?.name || 'Ville non spécifiée'}
              </p>

              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatCurrency(property.price)}
                {property.listingType === 'LOCATION' && (
                  <span className="text-lg text-gray-500 ml-2">/nuit</span>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex gap-4 text-sm text-gray-600">
                {property.chambres && <span>🛏️ {property.chambres} ch</span>}
                {property.sallesDeBain && <span>🚿 {property.sallesDeBain} sdb</span>}
                {property.surface && <span>📐 {property.surface}m²</span>}
              </div>
            </div>
          </div>

          {/* Right Column - Reservation */}
          <div>
            <div className="sticky top-24">
              {!reservationMade ? (
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">
                    {property.listingType === 'LOCATION' ? 'Réserver ce bien' : 'Je suis intéressé'}
                  </h2>

                  {/* For LOCATION - Show Calendar Toggle & Calendar */}
                  {property.listingType === 'LOCATION' && (
                    <>
                      {!showCalendar ? (
                        <Button
                          className="w-full mb-4"
                          size="lg"
                          variant="ghost"
                          onClick={() => setShowCalendar(true)}
                        >
                          📅 Choisir les dates
                        </Button>
                      ) : (
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700">Sélectionnez vos dates</h3>
                            <button
                              onClick={() => setShowCalendar(false)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Masquer
                            </button>
                          </div>
                          <PropertyCalendar
                            property={property}
                            onDatesSelected={(dates) => setSelectedDates(dates)}
                          />
                        </div>
                      )}

                      {selectedDates && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                          <p className="text-gray-700">
                            <strong>Dates sélectionnées:</strong>
                          </p>
                          <p className="text-gray-600">
                            Du {selectedDates.startDate.toLocaleDateString('fr-FR')} au {selectedDates.endDate.toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-blue-600 font-semibold mt-1">
                            {selectedDates.nights} nuit(s) • {selectedDates.totalPrice.toLocaleString('fr-MA')} DH
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleReserveClick}
                    disabled={property.listingType === 'LOCATION' && !selectedDates}
                  >
                    {property.listingType === 'LOCATION' ? 'Confirmer la réservation' : 'Envoyer ma demande'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    {property.listingType === 'LOCATION'
                      ? selectedDates ? 'Cliquez pour continuer' : 'Veuillez choisir vos dates'
                      : 'Nous vous contacterons dans les plus brefs délais'}
                  </p>
                </div>
              ) : (
                /* Success State */
                <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.listingType === 'LOCATION' ? 'Réservation envoyée!' : 'Demande envoyée!'}
                  </h3>

                  {property.listingType === 'LOCATION' && selectedDates && (
                    <p className="text-gray-600 mb-4">
                      Du {selectedDates.startDate.toLocaleDateString('fr-FR')}<br />
                      au {selectedDates.endDate.toLocaleDateString('fr-FR')}
                    </p>
                  )}

                  <p className="text-gray-600 mb-6">
                    Le propriétaire vous contactera bientôt.
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Ou contactez directement :
                    </p>

                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                    >
                      💬 WhatsApp
                    </a>

                    <a
                      href="tel:0605911322"
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                      📞 0605911322
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={property.listingType === 'LOCATION' ? 'rent' : 'sale'}
        property={property}
        selectedDates={selectedDates || undefined}
        onSuccess={handleReservationSuccess}
      />
    </div>
  );
}
