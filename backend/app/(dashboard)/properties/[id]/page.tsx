'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { api } from '@/lib/utils/api';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<Value>([null, null]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Guest form data
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    loadProperty();
    checkAuth();
  }, [params.id]);

  useEffect(() => {
    if (property && dateRange && Array.isArray(dateRange)) {
      const [start, end] = dateRange;
      if (start && end) {
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        setTotalPrice(property.price * days);
      }
    }
  }, [dateRange, property]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setIsLoggedIn(!!(response as any).data);
    } catch {
      setIsLoggedIn(false);
    }
  };

  const loadProperty = async () => {
    try {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/properties/${params.id}`
      );
      const data = await response.json();
      setProperty(data.data);

      // Load blocked dates if it's a rental property
      if (data.data.listingType === 'LOCATION') {
        loadBlockedDates(params.id as string);
      }
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlockedDates = async (propertyId: string) => {
    try {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/properties/${propertyId}/availability`
      );
      const data = await response.json();
      
      // Convert blocked dates to Date objects
      const blocked: Date[] = [];
      data.data.blockedDates?.forEach((range: any) => {
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          blocked.push(new Date(d));
        }
      });
      setBlockedDates(blocked);
    } catch (error) {
      console.error('Erreur chargement disponibilité:', error);
    }
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable blocked dates
    return blockedDates.some(
      (blocked) =>
        blocked.getFullYear() === date.getFullYear() &&
        blocked.getMonth() === date.getMonth() &&
        blocked.getDate() === date.getDate()
    );
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const isBlocked = blockedDates.some(
      (blocked) =>
        blocked.getFullYear() === date.getFullYear() &&
        blocked.getMonth() === date.getMonth() &&
        blocked.getDate() === date.getDate()
    );
    return isBlocked ? 'blocked-date' : '';
  };

  const handleReserveClick = () => {
    if (!dateRange || !Array.isArray(dateRange) || !dateRange[0] || !dateRange[1]) {
      showToast('Veuillez sélectionner des dates', 'error');
      return;
    }

    if (isLoggedIn) {
      setShowReservationModal(true);
    } else {
      setShowAuthChoice(true);
    }
  };

  const handleContinueWithoutAccount = () => {
    setShowAuthChoice(false);
    setShowReservationModal(true);
  };

  const handleContinueWithAccount = () => {
    router.push(`/login?redirect=/property/${params.id}`);
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateRange || !Array.isArray(dateRange) || !dateRange[0] || !dateRange[1]) {
      showToast('Dates invalides', 'error');
      return;
    }

    try {
      const reservationData = {
        propertyId: params.id,
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString(),
        totalPrice,
        ...(isLoggedIn ? {} : guestData),
      };

      await api.post('/api/reservations', reservationData);
      showToast('Demande de réservation envoyée !', 'success');
      setShowReservationModal(false);
      
      // Show contact options after reservation
      setTimeout(() => {
        showContactOptions();
      }, 1000);
    } catch (error: any) {
      showToast(error.message || 'Erreur de réservation', 'error');
    }
  };

  const showContactOptions = () => {
    if (!property) return;

    const propertyLink = window.location.href;
    const whatsappMessage = `Bonjour, je souhaite réserver ce bien : ${propertyLink}`;
    const whatsappUrl = `https://wa.me/212605911322?text=${encodeURIComponent(whatsappMessage)}`;

    if (confirm('Voulez-vous contacter le propriétaire maintenant ?\n\nCliquez OK pour WhatsApp ou Annuler pour appeler.')) {
      window.open(whatsappUrl, '_blank');
    } else {
      window.location.href = 'tel:+212605911322';
    }
  };

  const handleSaleInquiry = () => {
    if (!property) return;

    const propertyLink = window.location.href;
    const whatsappMessage = `Bonjour, je suis intéressé par ce bien : ${propertyLink}`;
    const whatsappUrl = `https://wa.me/212605911322?text=${encodeURIComponent(whatsappMessage)}`;

    if (confirm('Voulez-vous nous contacter maintenant ?\n\nCliquez OK pour WhatsApp ou Annuler pour appeler.')) {
      window.open(whatsappUrl, '_blank');
    } else {
      window.location.href = 'tel:+212605911322';
    }
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
            <div className="sticky top-24">
              {property.listingType === 'LOCATION' ? (
                <Card>
                  <h3 className="text-xl font-bold mb-4">Réserver ce bien</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionnez vos dates
                    </label>
                    <Calendar
                      selectRange
                      onChange={setDateRange}
                      value={dateRange}
                      tileDisabled={tileDisabled}
                      tileClassName={tileClassName}
                      minDate={new Date()}
                      className="w-full border rounded-lg"
                    />
                  </div>

                  {dateRange && Array.isArray(dateRange) && dateRange[0] && dateRange[1] && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between mb-2">
                        <span>Arrivée:</span>
                        <span className="font-semibold">
                          {dateRange[0].toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Départ:</span>
                        <span className="font-semibold">
                          {dateRange[1].toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleReserveClick}
                    disabled={!dateRange || !Array.isArray(dateRange) || !dateRange[0] || !dateRange[1]}
                  >
                    Réserver maintenant
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Vous ne serez pas débité immédiatement
                  </p>
                </Card>
              ) : (
                <Card>
                  <h3 className="text-xl font-bold mb-4">Intéressé par ce bien ?</h3>
                  <p className="text-gray-600 mb-4">
                    Contactez-nous pour plus d'informations ou pour organiser une visite.
                  </p>
                  <Button className="w-full" onClick={handleSaleInquiry}>
                    Nous contacter
                  </Button>
                </Card>
              )}

              {/* Contact Info */}
              <Card className="mt-4">
                <h4 className="font-semibold mb-3">Contactez-nous directement</h4>
                <div className="space-y-2">
                  <a
                    href="tel:+212605911322"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    📞 0605911322
                  </a>
                  <a
                    href={`https://wa.me/212605911322?text=${encodeURIComponent(
                      property.listingType === 'LOCATION'
                        ? `Bonjour, je souhaite réserver ce bien : ${window.location.href}`
                        : `Bonjour, je suis intéressé par ce bien : ${window.location.href}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:underline"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Choice Modal */}
      {showAuthChoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Comment souhaitez-vous continuer ?</h3>
            <div className="space-y-3">
              <Button className="w-full" onClick={handleContinueWithAccount}>
                Continuer avec un compte
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleContinueWithoutAccount}
              >
                Continuer sans compte
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowAuthChoice(false)}
              >
                Annuler
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-md w-full my-8">
            <h3 className="text-xl font-bold mb-4">Confirmer la réservation</h3>

            <form onSubmit={handleSubmitReservation} className="space-y-4">
              {!isLoggedIn && (
                <>
                  <Input
                    label="Nom complet"
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Téléphone"
                    type="tel"
                    value={guestData.phone}
                    onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                    required
                  />
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={guestData.message}
                  onChange={(e) => setGuestData({ ...guestData, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Questions ou demandes spéciales..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Dates:</span>
                  <span className="font-semibold">
                    {dateRange && Array.isArray(dateRange) && dateRange[0]
                      ? `${dateRange[0].toLocaleDateString('fr-FR')} - ${dateRange[1]?.toLocaleDateString('fr-FR')}`
                      : ''}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Confirmer
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowReservationModal(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .blocked-date {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
        }
        .react-calendar__tile--active {
          background-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}