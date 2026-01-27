'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiMapPin, FiMaximize2 } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';
import { Property } from '@/types';
import FavoriteButton from './FavoriteButton';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  // Map backend fields to frontend display
  const propertyId = property.id || property._id || '';
  const location = property.city?.name || property.location || property.address || 'Saidia Bay';
  const bedrooms = property.chambres || property.bedrooms;
  const bathrooms = property.sallesDeBain || property.bathrooms;
  const area = property.surface || property.area;
  const isRental = property.listingType === 'LOCATION' || property.listingType === 'rent';

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'LOCATION' || listingType === 'rent') {
      return (
        <>
          <span className="font-semibold">{price.toLocaleString()} DH</span>
          <span className="text-secondary-500 font-normal"> /mois</span>
        </>
      );
    }
    return <span className="font-semibold">{price.toLocaleString()} DH</span>;
  };

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      VILLA: 'Villa',
      APPARTEMENT: 'Appartement',
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      studio: 'Studio',
      commercial: 'Commercial',
      land: 'Terrain',
    };
    return labels[category || ''] || category || 'Propriété';
  };

  return (
    <div className="group">
      <Link href={`/properties/${property.slug || propertyId}`}>
        {/* Image Container - Airbnb style with rounded corners */}
        <div className="img-container aspect-square mb-3 relative overflow-hidden rounded-xl">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
              <FiMapPin className="text-secondary-300" size={32} />
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton propertyId={propertyId} />
          </div>

          {/* Featured Badge */}
          {property.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-accent-500 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm">
                En Vedette
              </span>
            </div>
          )}

          {/* Listing Type Tag */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
              isRental 
                ? 'bg-primary-900 text-white' 
                : 'bg-accent-500 text-white'
            }`}>
              {isRental ? 'À Louer' : 'À Vendre'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          {/* Location & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-secondary-900">
              <FiMapPin size={14} className="text-primary-600" />
              <span className="text-sm font-medium truncate max-w-[150px]">
                {location}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiStar className="fill-accent-500 text-accent-500" size={14} />
              <span className="text-sm font-medium">4.9</span>
            </div>
          </div>

          {/* Property Type & Features */}
          <div className="flex items-center gap-3 text-sm text-secondary-500">
            <span>{getCategoryLabel(property.propertyCategory || property.type)}</span>
            {bedrooms && (
              <span className="flex items-center gap-1">
                <IoBedOutline size={14} />
                {bedrooms}
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">
                <LuBath size={14} />
                {bathrooms}
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1">
                <FiMaximize2 size={14} />
                {area}m²
              </span>
            )}
          </div>

          {/* Title */}
          <p className="text-sm text-secondary-700 font-medium line-clamp-1 group-hover:text-primary-700 transition-colors">
            {property.title}
          </p>

          {/* Price */}
          <div className="text-base text-primary-900 pt-1">
            {formatPrice(property.price, property.listingType)}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
