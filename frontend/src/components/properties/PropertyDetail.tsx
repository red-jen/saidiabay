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
  FiArrowLeft
} from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
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
        const response = await propertiesApi.getById(slug);
        setProperty(response.data.data);
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
          Property Not Found
        </h1>
        <p className="text-secondary-600 mb-8">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/properties" className="btn-primary">
          Browse All Properties
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `${price.toLocaleString()} DH/month`;
    }
    return `${price.toLocaleString()} DH`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      available: 'badge-available',
      rented: 'badge-rented',
      sold: 'badge-sold',
      pending: 'badge-pending',
    };
    return badges[status as keyof typeof badges] || 'badge';
  };

  return (
    <div className="container mx-auto py-8">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft />
        Back to Properties
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Main Image */}
            <div className="relative h-96">
              {property.images && property.images.length > 0 ? (
                <Image
                  src={property.images[selectedImage]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary-200 flex items-center justify-center">
                  <FiMapPin className="text-secondary-400" size={64} />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={property.listingType === 'rent' ? 'badge-rent' : 'badge-sale'}>
                  {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className={getStatusBadge(property.status)}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {property.images && property.images.length > 1 && (
              <div className="p-4 grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary-600' : ''
                    }`}
                  >
                    <Image src={image} alt={`View ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-secondary-600 mb-6">
              <FiMapPin />
              <span>{property.location}</span>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-6 p-6 bg-secondary-50 rounded-xl mb-6">
              {property.bedrooms && (
                <div className="text-center">
                  <IoBedOutline className="mx-auto mb-2 text-primary-600" size={24} />
                  <div className="font-semibold text-secondary-900">
                    {property.bedrooms}
                  </div>
                  <div className="text-sm text-secondary-600">Bedrooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center">
                  <div className="mx-auto mb-2 text-primary-600 font-bold text-2xl">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-secondary-600">Bathrooms</div>
                </div>
              )}
              {property.area && (
                <div className="text-center">
                  <FiMaximize className="mx-auto mb-2 text-primary-600" size={24} />
                  <div className="font-semibold text-secondary-900">
                    {property.area} m²
                  </div>
                  <div className="text-sm text-secondary-600">Area</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Description
              </h2>
              <p className="text-secondary-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Features & Amenities
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-6">
                {formatPrice(property.price, property.listingType)}
              </div>

              {/* Action based on listing type */}
              {property.listingType === 'rent' && property.status === 'available' ? (
                <ReservationForm propertyId={property.id} />
              ) : property.listingType === 'sale' && property.status === 'available' ? (
                <div className="space-y-3">
                  <Link href="/contact" className="btn-primary w-full text-center">
                    Request Purchase Info
                  </Link>
                  <p className="text-sm text-secondary-600 text-center">
                    Contact us to schedule a viewing or request more information
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className={getStatusBadge(property.status) + ' text-base'}>
                    This property is {property.status}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="bg-primary-600 text-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <p className="text-primary-100 mb-6">
                Contact our team for personalized assistance
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+212600000000"
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FiPhone />
                  <span>+212 6 00 00 00 00</span>
                </a>
                <a
                  href="mailto:contact@saidiabay.com"
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
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

