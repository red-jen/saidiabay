'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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

  useEffect(() => {
    loadProperty();
    checkIfAlreadyReserved();
  }, [params.id]);

  const loadProperty = async () => {
    try {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/properties/${params.id}`
      );
      const data = await response.json();
      setProperty(data.data);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfAlreadyReserved = () => {
    // Check localStorage for reservation status
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
    // Save to localStorage
    localStorage.setItem(`reservation_${params.id}`, JSON.stringify({
      timestamp: new Date().toISOString(),
      dates: selectedDates,
    }));
    setReservationMade(true);
    setShowModal(false);
    showToast('Réservation envoyée avec succès!', 'success');
  };

  const getWhatsAppLink = () => {
    if (!property) return '';

    const phone = '212605911322'; // Format international
    let message = `Bonjour, je suis intéressé(e) par votre propriété "${property.title}" située à ${property.address}.`;

    if (property.listingType === 'LOCATION' && selectedDates) {
      message += `\n\nDates souhaitées:\nArrivée: ${selectedDates.startDate.toLocaleDateString('fr-FR')}\nDépart: ${selectedDates.endDate.toLocaleDateString('fr-FR')}\nTotal: ${selectedDates.nights} nuit(s) - ${selectedDates.totalPrice.toLocaleString('fr-MA')} DH`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!property) {
    return <div className="text-center py-12">Propriété non trouvée</div>;
  }

  const features = [];
  if (property.chambres) features.push({ icon: '🛏️', text: `${property.chambres} chambres` });
  if (property.sallesDeBain) features.push({ icon: '🚿', text: `${property.sallesDeBain} salles de bain` });
  if (property.surface) features.push({ icon: '📐', text: `${property.surface}m²` });
  if (property.anneeCons) features.push({ icon: '📅', text: `Année ${property.anneeCons}` });
  if (property.garage) features.push({ icon: '🚗', text: 'Garage' });

  const amenities = [];
  if (property.balcon) amenities.push({ icon: '🌅', text: 'Balcon' });
  if (property.climatisation) amenities.push({ icon: '❄️', text: 'Climatisation' });
  if (property.gazon) amenities.push({ icon: '🌳', text: 'Jardin' });
  if (property.machineLaver) amenities.push({ icon: '🧺', text: 'Machine à laver' });
  if (property.tv) amenities.push({ icon: '📺', text: 'Télévision' });
  if (property.parking) amenities.push({ icon: '🅿️', text: 'Parking' });
  if (property.piscine) amenities.push({ icon: '🏊', text: 'Piscine' });
  if (property.wifi) amenities.push({ icon: '📶', text: 'Wi-Fi' });
  if (property.cuisine) amenities.push({ icon: '🍳', text: 'Cuisine équipée' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/')}>
              ← Retour
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Détails du bien</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={property.thumbnail}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Additional Images */}
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`${property.title} ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}

            {/* Title and Location */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    property.listingType === 'LOCATION'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {property.listingType === 'LOCATION' ? 'Location' : 'Vente'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                  {property.propertyCategory}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                📍 {property.city?.name}
              </p>
            </div>

            {/* Price */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prix</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(property.price)}
                    {property.listingType === 'LOCATION' && (
                      <span className="text-lg text-gray-500 ml-2">/nuit</span>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card>
              <h3 className="text-xl font-bold mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <h3 className="text-xl font-bold mb-4">Équipements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-2xl">{amenity.icon}</span>
                      <span className="text-gray-700">{amenity.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Description */}
            {property.description && (
              <Card>
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </Card>
            )}
          </div>

          {/* Right Column - Reservation/Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {!reservationMade ? (
                <>
                  {/* For LOCATION properties - Show Calendar */}
                  {property.listingType === 'LOCATION' && (
                    <>
                      <PropertyCalendar
                        property={property}
                        onDatesSelected={(dates) => setSelectedDates(dates)}
                      />
                      <Button
                        className="w-full"
                        onClick={handleReserveClick}
                        disabled={!selectedDates}
                      >
                        Réserver
                      </Button>
                    </>
                  )}

                  {/* For VENTE properties - Show Interest Button */}
                  {property.listingType === 'VENTE' && (
                    <Card>
                      <h3 className="text-xl font-bold mb-4">Intéressé par ce bien ?</h3>
                      <p className="text-gray-600 mb-4">
                        Contactez-nous pour plus d'informations ou pour organiser une visite.
                      </p>
                      <Button className="w-full" onClick={handleReserveClick}>
                        Je suis intéressé
                      </Button>
                    </Card>
                  )}
                </>
              ) : (
                /* Show after successful reservation/interest */
                <Card>
                  <div className="text-center space-y-4">
                    <div className="text-green-600 text-5xl">✓</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {property.listingType === 'LOCATION' ? 'Réservation envoyée!' : 'Intérêt enregistré!'}
                      </h3>
                      {property.listingType === 'LOCATION' && selectedDates && (
                        <p className="text-sm text-gray-600 mb-2">
                          Du {selectedDates.startDate.toLocaleDateString('fr-FR')} au {selectedDates.endDate.toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      <p className="text-gray-600">
                        Le propriétaire vous contactera bientôt.
                      </p>
                    </div>

                    {/* Contact Buttons */}
                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-700">
                        Contactez directement :
                      </p>

                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </a>

                      <a
                        href={`mailto:contact@example.com?subject=Propriété: ${encodeURIComponent(property.title)}`}
                        className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>

                      <a
                        href="tel:0605911322"
                        className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        0605911322
                      </a>
                    </div>
                  </div>
                </Card>
              )}

              {/* Contact Info Card (always visible) */}
              {!reservationMade && (
                <Card>
                  <h4 className="font-semibold mb-3">Contactez-nous directement</h4>
                  <div className="space-y-2">
                    <a
                      href="tel:0605911322"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      📞 0605911322
                    </a>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:underline"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </Card>
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
