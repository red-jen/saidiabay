'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { Property } from '@/types';
import FavoriteButton from './FavoriteButton';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return (
        <>
          <span className="font-semibold">{price.toLocaleString()} DH</span>
          <span className="text-secondary-500 font-normal"> / month</span>
        </>
      );
    }
    return <span className="font-semibold">{price.toLocaleString()} DH</span>;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Apartment',
      house: 'House',
      villa: 'Villa',
      studio: 'Studio',
      commercial: 'Commercial',
      land: 'Land',
    };
    return labels[type] || type;
  };

  return (
    <div className="group">
      <Link href={`/properties/${property.slug || property.id}`}>
        {/* Image Container - Airbnb style with rounded corners */}
        <div className="img-container aspect-square mb-3 relative">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover rounded-xl img-zoom"
            />
          ) : (
            <div className="w-full h-full bg-secondary-100 rounded-xl flex items-center justify-center">
              <FiMapPin className="text-secondary-300" size={32} />
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 right-3">
            <FavoriteButton propertyId={property._id} />
          </div>

          {/* Badge */}
          {property.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-secondary-900 shadow-sm">
                Featured
              </span>
            </div>
          )}

          {/* Listing Type Tag */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
              property.listingType === 'rent' 
                ? 'bg-primary-900 text-white' 
                : 'bg-accent-500 text-white'
            }`}>
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Location & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-900">
              {property.location}
            </span>
            <div className="flex items-center gap-1">
              <FiStar className="fill-secondary-900 text-secondary-900" size={14} />
              <span className="text-sm font-medium">4.9</span>
            </div>
          </div>

          {/* Property Type */}
          <p className="text-sm text-secondary-500">
            {getTypeLabel(property.type)}
            {property.bedrooms && ` · ${property.bedrooms} beds`}
            {property.area && ` · ${property.area} m²`}
          </p>

          {/* Title */}
          <p className="text-sm text-secondary-500 line-clamp-1">
            {property.title}
          </p>

          {/* Price */}
          <div className="text-base pt-1">
            {formatPrice(property.price, property.listingType)}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
