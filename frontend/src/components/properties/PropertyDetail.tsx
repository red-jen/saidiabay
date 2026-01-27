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
  FiWifi,
  FiDroplet
} from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath, LuParkingCircle, LuWaves, LuSnowflake, LuTv, LuChefHat } from 'react-icons/lu';
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
        // API returns the property data directly
        const data = await propertiesApi.getById(slug);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-secondary-200 rounded-xl" />
          <div className="h-64 bg-secondary-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Propriété Non Trouvée
        </h1>
        <p className="text-secondary-600 mb-8">
          La propriété que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Link href="/properties" className="btn-primary">
          Voir Toutes les Propriétés
        </Link>
      </div>
    );
  }

  // Map backend fields to frontend display
  const bedrooms = property.chambres || property.bedrooms;
  const bathrooms = property.sallesDeBain || property.bathrooms;
  const area = property.surface || property.area;
  const location = property.city?.name || property.location || property.address || 'Saidia Bay';
  const isRental = property.listingType === 'LOCATION' || property.listingType === 'rent';
  const isAvailable = property.status === 'AVAILABLE' || property.status === 'DISPONIBLE' || property.status === 'available';

  // Build amenities list from backend boolean fields
  const amenities = [];
  if (property.wifi) amenities.push({ icon: FiWifi, label: 'WiFi' });
  if (property.piscine) amenities.push({ icon: LuWaves, label: 'Piscine' });
  if (property.climatisation) amenities.push({ icon: LuSnowflake, label: 'Climatisation' });
  if (property.parking) amenities.push({ icon: LuParkingCircle, label: 'Parking' });
  if (property.balcon) amenities.push({ icon: MdOutlineBalcony, label: 'Balcon' });
  if (property.tv) amenities.push({ icon: LuTv, label: 'TV' });
  if (property.cuisine) amenities.push({ icon: LuChefHat, label: 'Cuisine équipée' });
  if (property.machineLaver) amenities.push({ icon: MdOutlineLocalLaundryService, label: 'Machine à laver' });
  if (property.garage && property.garage > 0) amenities.push({ icon: MdOutlineGarage, label: `Garage (${property.garage})` });
  if (property.gazon) amenities.push({ icon: MdOutlineGrass, label: 'Jardin' });

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'LOCATION' || listingType === 'rent') {
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
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft />
        Retour aux Propriétés
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Main Image */}
            <div className="relative h-[400px] lg:h-[500px]">
              {property.images && property.images.length > 0 ? (
                <Image
                  src={property.images[selectedImage]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-secondary-200 flex items-center justify-center">
                  <FiMapPin className="text-secondary-400" size={64} />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isRental ? 'bg-primary-900 text-white' : 'bg-accent-500 text-white'
                }`}>
                  {isRental ? 'À Louer' : 'À Vendre'}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(property.status)}`}>
                  {getStatusLabel(property.status)}
                </span>
              </div>

              {/* Property Category Badge */}
              {property.propertyCategory && (
                <div className="absolute bottom-4 left-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-secondary-900">
                    {property.propertyCategory === 'VILLA' ? 'Villa' : 'Appartement'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {property.images && property.images.length > 1 && (
              <div className="p-4 grid grid-cols-5 gap-2">
                {property.images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index ? 'ring-2 ring-primary-600 scale-95' : 'hover:opacity-80'
                    }`}
                  >
                    <Image src={image} alt={`Vue ${index + 1}`} fill className="object-cover" />
                    {index === 4 && property.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">+{property.images.length - 5}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-secondary-600 mb-6">
              <FiMapPin className="text-primary-600" />
              <span className="text-lg">{location}</span>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl mb-8">
              {bedrooms && (
                <div className="text-center p-4">
                  <IoBedOutline className="mx-auto mb-2 text-primary-600" size={28} />
                  <div className="font-bold text-2xl text-secondary-900">
                    {bedrooms}
                  </div>
                  <div className="text-sm text-secondary-600">Chambres</div>
                </div>
              )}
              {bathrooms && (
                <div className="text-center p-4">
                  <LuBath className="mx-auto mb-2 text-primary-600" size={28} />
                  <div className="font-bold text-2xl text-secondary-900">
                    {bathrooms}
                  </div>
                  <div className="text-sm text-secondary-600">Salles de bain</div>
                </div>
              )}
              {area && (
                <div className="text-center p-4">
                  <FiMaximize className="mx-auto mb-2 text-primary-600" size={28} />
                  <div className="font-bold text-2xl text-secondary-900">
                    {area}
                  </div>
                  <div className="text-sm text-secondary-600">m²</div>
                </div>
              )}
              {property.anneeCons && (
                <div className="text-center p-4">
                  <FiCalendar className="mx-auto mb-2 text-primary-600" size={28} />
                  <div className="font-bold text-2xl text-secondary-900">
                    {property.anneeCons}
                  </div>
                  <div className="text-sm text-secondary-600">Année</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Description
                </h2>
                <p className="text-secondary-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities from backend boolean fields */}
            {amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Équipements & Commodités
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                      <amenity.icon className="text-primary-600 flex-shrink-0" size={20} />
                      <span className="text-secondary-700 font-medium">{amenity.label}</span>
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

        {/* Sidebar - 1 column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100">
              <div className="text-3xl font-bold text-primary-900 mb-2">
                {formatPrice(property.price, property.listingType)}
              </div>
              {isRental && (
                <p className="text-secondary-500 text-sm mb-6">Prix par mois</p>
              )}

              {/* Action based on listing type */}
              {isRental && isAvailable ? (
                <ReservationForm propertyId={property.id} />
              ) : !isRental && isAvailable ? (
                <div className="space-y-4">
                  <Link href="/contact" className="btn-primary w-full text-center block py-4">
                    Demander des Informations
                  </Link>
                  <p className="text-sm text-secondary-600 text-center">
                    Contactez-nous pour planifier une visite
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 bg-secondary-50 rounded-xl">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(property.status)}`}>
                    {getStatusLabel(property.status)}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-700 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Besoin d'aide ?</h3>
              <p className="text-primary-100 mb-6">
                Notre équipe est à votre disposition pour vous accompagner
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+212600000000"
                  className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <FiPhone />
                  <span>+212 6 00 00 00 00</span>
                </a>
                <a
                  href="mailto:contact@saidiabay.com"
                  className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <FiMail />
                  <span>contact@saidiabay.com</span>
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

