'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiMapPin, 
  FiMaximize, 
  FiCheck, 
  FiPhone, 
  FiMail,
  FiCalendar,
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiWifi,
  FiDroplet
} from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath, LuWaves, LuSnowflake, LuTv, LuChefHat } from 'react-icons/lu';
import { MdOutlineLocalParking } from 'react-icons/md';
import { MdOutlineBalcony, MdOutlineLocalLaundryService, MdOutlineGarage, MdOutlineGrass } from 'react-icons/md';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';
import ReservationForm from './ReservationForm';

interface PropertyDetailProps {
  slug: string;
}

const PropertyDetail = ({ slug }: PropertyDetailProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log('Fetching property with slug/id:', slug);
        setLoading(true);
        // API returns the property data directly
        // Backend supports both ID and slug
        const data = await propertiesApi.getById(slug);
        console.log('Property data received:', data);
        console.log('Property data type:', typeof data);
        console.log('Property data keys:', data ? Object.keys(data) : 'null');
        
        if (data && typeof data === 'object') {
          console.log('Setting property state with data');
          setProperty(data);
        } else {
          console.error('Property data is null, undefined, or not an object:', data);
          setProperty(null);
        }
      } catch (error: any) {
        console.error('Error fetching property:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error details:', error.response?.data || error.message);
        // Set property to null to show error state
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    } else {
      console.error('No slug/id provided');
      setLoading(false);
    }
  }, [slug]);

  // Keyboard navigation for images
  useEffect(() => {
    if (!property?.images || property.images.length <= 1) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [property?.images]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-96 lg:h-[600px] bg-gradient-to-br from-secondary-200 to-secondary-100 rounded-2xl" />
          <div className="h-64 bg-gradient-to-br from-secondary-200 to-secondary-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-16 lg:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-accent-500" />
            <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
              Erreur
            </span>
            <div className="w-12 h-px bg-accent-500" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-primary-900 mb-6">
            Propriété Non Trouvée
          </h1>
          <p className="text-primary-800/80 mb-10 text-lg leading-relaxed">
            La propriété que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link href="/properties" className="inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all shadow-gold hover:shadow-gold-lg">
            Voir Toutes les Propriétés
          </Link>
        </div>
      </div>
    );
  }

  // Map backend fields to frontend display
  const bedrooms = property.chambres || property.bedrooms;
  const bathrooms = property.sallesDeBain || property.bathrooms;
  const area = property.surface || property.area;
  const location = property.city?.name || property.location || property.address || 'Saidia Bay';
  const isRental = property.listingType === 'LOCATION';
  const isAvailable = property.status === 'AVAILABLE' || property.status === 'DISPONIBLE' || (property.status as any) === 'available';

  // Build amenities list from backend boolean fields
  const amenities = [];
  if (property.wifi) amenities.push({ icon: FiWifi, label: 'WiFi' });
  if (property.piscine) amenities.push({ icon: LuWaves, label: 'Piscine' });
  if (property.climatisation) amenities.push({ icon: LuSnowflake, label: 'Climatisation' });
  if (property.parking) amenities.push({ icon: MdOutlineLocalParking, label: 'Parking' });
  if (property.balcon) amenities.push({ icon: MdOutlineBalcony, label: 'Balcon' });
  if (property.tv) amenities.push({ icon: LuTv, label: 'TV' });
  if (property.cuisine) amenities.push({ icon: LuChefHat, label: 'Cuisine équipée' });
  if (property.machineLaver) amenities.push({ icon: MdOutlineLocalLaundryService, label: 'Machine à laver' });
  if (property.garage && property.garage > 0) amenities.push({ icon: MdOutlineGarage, label: `Garage (${property.garage})` });
  if (property.gazon) amenities.push({ icon: MdOutlineGrass, label: 'Jardin' });

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'LOCATION') {
      return `${price.toLocaleString()} DH/mois`;
    }
    return `${price.toLocaleString()} DH`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800',
      DISPONIBLE: 'bg-green-100 text-green-800',
      available: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      SOLD: 'bg-red-100 text-red-800',
      VENDU: 'bg-red-100 text-red-800',
      sold: 'bg-red-100 text-red-800',
      LOUE: 'bg-blue-100 text-blue-800',
      rented: 'bg-blue-100 text-blue-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      DISPONIBLE: 'Disponible',
      available: 'Disponible',
      PENDING: 'En attente',
      EN_ATTENTE: 'En attente',
      pending: 'En attente',
      SOLD: 'Vendu',
      VENDU: 'Vendu',
      sold: 'Vendu',
      LOUE: 'Loué',
      rented: 'Loué',
    };
    return labels[status] || status;
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-12">
      {/* Back Button - Premium Style */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-primary-800 hover:text-accent-500 mb-8 transition-colors group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Retour aux Propriétés</span>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery - Premium Style with Navigation */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-elegant-lg border border-secondary-100 group">
            {/* Main Image Container */}
            <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <>
                  <Image
                    src={property.images[selectedImage]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  
                  {/* Image Counter - Premium Style */}
                  {property.images.length > 1 && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium shadow-elegant border border-white/20">
                        {selectedImage + 1} / {property.images.length}
                      </div>
                    </div>
                  )}

                  {/* Navigation Arrows - Premium Style */}
                  {property.images.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-elegant-lg border border-white/50 hover:bg-white hover:scale-110 transition-all duration-300 group/btn"
                        aria-label="Image précédente"
                      >
                        <FiChevronLeft className="w-6 h-6 text-primary-900 group-hover/btn:text-accent-500 transition-colors" />
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-elegant-lg border border-white/50 hover:bg-white hover:scale-110 transition-all duration-300 group/btn"
                        aria-label="Image suivante"
                      >
                        <FiChevronRight className="w-6 h-6 text-primary-900 group-hover/btn:text-accent-500 transition-colors" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary-200 to-secondary-100 flex items-center justify-center">
                  <FiMapPin className="text-secondary-400" size={64} />
                </div>
              )}

              {/* Premium Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Badges - Premium Style */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-3 z-10">
                <span className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-elegant backdrop-blur-sm ${
                  isRental ? 'bg-primary-900/95 text-white' : 'bg-accent-500/95 text-white'
                }`}>
                  {isRental ? 'À Louer' : 'À Vendre'}
                </span>
                <span className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-elegant backdrop-blur-sm ${getStatusBadge(property.status)}`}>
                  {getStatusLabel(property.status)}
                </span>
              </div>

              {/* Property Category Badge - Premium */}
              {property.propertyCategory && (
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-full text-sm font-semibold text-primary-900 shadow-elegant border border-white/50">
                    {property.propertyCategory === 'VILLA' ? 'Villa' : 'Appartement'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Grid - Premium Style with Scroll */}
            {property.images && property.images.length > 1 && (
              <div className="p-6 bg-gradient-to-b from-secondary-50/50 to-white border-t border-secondary-100">
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 h-20 lg:h-24 w-20 lg:w-24 rounded-xl overflow-hidden transition-all border-2 ${
                        selectedImage === index 
                          ? 'ring-2 ring-accent-500 border-accent-500 scale-95 shadow-gold' 
                          : 'border-secondary-200 hover:border-accent-300 hover:opacity-90 hover:scale-105'
                      }`}
                    >
                      <Image src={image} alt={`Vue ${index + 1}`} fill className="object-cover" />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-accent-500/20 border-2 border-accent-500 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
                {property.images.length > 5 && (
                  <p className="text-center text-sm text-primary-800/70 mt-3 font-medium">
                    {property.images.length} photos disponibles
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Property Details - Premium Style */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-elegant-lg border border-secondary-100">
            {/* Brand Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                Détails de la Propriété
              </span>
            </div>
            
            <h1 className="font-serif text-4xl lg:text-5xl font-medium text-primary-900 mb-6 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-3 text-primary-800 mb-8">
              <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center">
                <FiMapPin className="text-accent-600" size={18} />
              </div>
              <span className="text-lg font-medium">{location}</span>
            </div>

            {/* Key Features - Premium Style */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 p-8 bg-gradient-to-br from-primary-50 via-accent-50/30 to-secondary-50 rounded-2xl mb-10 border border-secondary-100 shadow-elegant">
              {bedrooms && (
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-secondary-100 shadow-elegant">
                  <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <IoBedOutline className="text-accent-600" size={24} />
                  </div>
                  <div className="font-serif font-medium text-3xl text-primary-900 mb-1">
                    {bedrooms}
                  </div>
                  <div className="text-sm text-primary-800 font-medium">Chambres</div>
                </div>
              )}
              {bathrooms && (
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-secondary-100 shadow-elegant">
                  <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <LuBath className="text-accent-600" size={24} />
                  </div>
                  <div className="font-serif font-medium text-3xl text-primary-900 mb-1">
                    {bathrooms}
                  </div>
                  <div className="text-sm text-primary-800 font-medium">Salles de bain</div>
                </div>
              )}
              {area && (
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-secondary-100 shadow-elegant">
                  <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FiMaximize className="text-accent-600" size={24} />
                  </div>
                  <div className="font-serif font-medium text-3xl text-primary-900 mb-1">
                    {area}
                  </div>
                  <div className="text-sm text-primary-800 font-medium">m²</div>
                </div>
              )}
              {property.anneeCons && (
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-secondary-100 shadow-elegant">
                  <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FiCalendar className="text-accent-600" size={24} />
                  </div>
                  <div className="font-serif font-medium text-3xl text-primary-900 mb-1">
                    {property.anneeCons}
                  </div>
                  <div className="text-sm text-primary-800 font-medium">Année</div>
                </div>
              )}
            </div>

            {/* Description - Premium Style */}
            {property.description && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl lg:text-3xl font-medium text-primary-900 mb-6">
                  Description
                </h2>
                <p className="text-primary-800/80 leading-relaxed whitespace-pre-line text-lg">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities - Premium Style */}
            {amenities.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-medium text-primary-900 mb-6">
                  Équipements & Commodités
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-secondary-100 rounded-xl shadow-elegant hover:shadow-elegant-md hover:border-accent-300 transition-all">
                      <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <amenity.icon className="text-accent-600" size={20} />
                      </div>
                      <span className="text-primary-800 font-medium">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy features array */}
            {property.features && property.features.length > 0 && (
              <div className="mt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-secondary-50 rounded-xl">
                      <FiCheck className="text-primary-600 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Premium Style */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 lg:top-28 space-y-6">
            {/* Price Card - Premium */}
            <div className="bg-white rounded-2xl p-8 shadow-elegant-lg border border-secondary-100 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-accent-500" />
                  <span className="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase">
                    Prix
                  </span>
                </div>
                <div className="font-serif text-4xl lg:text-5xl font-medium text-primary-900 mb-3 bg-gradient-to-br from-primary-900 to-primary-700 bg-clip-text text-transparent">
                  {formatPrice(property.price, property.listingType)}
                </div>
                {isRental && (
                  <p className="text-primary-800/70 text-sm mb-8 font-medium">Prix par mois</p>
                )}
              </div>

              {/* Action based on listing type */}
              <div className="relative z-10">
                {isRental && isAvailable ? (
                  <ReservationForm propertyId={property.id} />
                ) : !isRental && isAvailable ? (
                  <div className="space-y-4">
                    <Link href="/contact" className="w-full text-center block py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all shadow-gold hover:shadow-gold-lg">
                      Demander des Informations
                    </Link>
                    <p className="text-sm text-primary-800/70 text-center font-medium">
                      Contactez-nous pour planifier une visite
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-secondary-50 rounded-xl border border-secondary-200">
                    <span className={`inline-block px-5 py-2.5 rounded-full text-sm font-semibold shadow-elegant ${getStatusBadge(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card - Premium */}
            <div className="bg-gradient-to-br from-primary-900 via-primary-950 to-primary-900 text-white rounded-2xl p-8 shadow-elegant-lg border border-accent-500/20 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-8 h-px bg-accent-400" />
                <span className="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase">
                  Contact
                </span>
              </div>
              <h3 className="font-serif text-2xl font-medium mb-4 relative z-10">Besoin d'aide ?</h3>
              <p className="text-white/80 mb-8 leading-relaxed relative z-10">
                Notre équipe est à votre disposition pour vous accompagner
              </p>
              <div className="space-y-3 relative z-10">
                <a
                  href="tel:+212600000000"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-accent-500/20 hover:border-accent-500/50 border border-white/20 transition-all shadow-elegant"
                >
                  <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                    <FiPhone className="text-accent-400" />
                  </div>
                  <span className="font-medium">+212 6 00 00 00 00</span>
                </a>
                <a
                  href="mailto:contact@saidiabay.com"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-accent-500/20 hover:border-accent-500/50 border border-white/20 transition-all shadow-elegant"
                >
                  <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                    <FiMail className="text-accent-400" />
                  </div>
                  <span className="font-medium">contact@saidiabay.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

