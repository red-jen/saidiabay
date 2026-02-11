'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiMaximize2, FiPlay } from 'react-icons/fi';
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
  const isRental = property.listingType === 'LOCATION';

  const formatPrice = (price: number, isRent: boolean) => {
    const formatted = price.toLocaleString('fr-MA');
    if (isRent) {
      return (
        <>
          <span className="font-bold">{formatted} DH</span>
          <span className="text-secondary-500 font-normal text-sm">/mois</span>
        </>
      );
    }
    return <span className="font-bold">{formatted} DH</span>;
  };

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      VILLA: 'Villa',
      APPARTEMENT: 'Appartement',
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      studio: 'Studio',
    };
    return labels[category || ''] || 'Propriété';
  };

  // Use ID if slug is not available (backend supports both)
  const propertyIdentifier = property.slug || propertyId;
  
  return (
    <Link
      href={`/properties/${propertyIdentifier}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={85}
          />
        ) : (
          <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
            <FiMapPin className="text-secondary-300" size={32} />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Favorite Button */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton propertyId={propertyId} />
        </div>

        {/* Top Left Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Listing Type Badge */}
          <span className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase rounded ${
            isRental 
              ? 'bg-primary-900 text-white' 
              : 'bg-accent-500 text-white'
          }`}>
            {isRental ? 'Location' : 'Vente'}
          </span>

          {/* Featured Badge */}
          {property.isFeatured && (
            <span className="px-3 py-1.5 text-xs font-semibold tracking-wide uppercase bg-white text-primary-900 rounded">
              En Vedette
            </span>
          )}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1.5 text-xs font-medium bg-white/95 backdrop-blur-sm text-primary-800 rounded">
            {getCategoryLabel(property.propertyCategory || property.type)}
          </span>
          
          {/* Video & Image Count */}
          <div className="flex items-center gap-1.5">
            {property.videoUrl && (
              <span className="flex items-center gap-1 px-2 py-1 bg-primary-900/80 backdrop-blur-sm text-white rounded text-[10px] font-semibold uppercase tracking-wide">
                <FiPlay className="w-2.5 h-2.5" />
                Vidéo
              </span>
            )}
            {property.images && property.images.length > 1 && (
              <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded text-[10px] font-medium">
                {property.images.length} photos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-secondary-500 text-sm mb-2">
          <FiMapPin className="w-4 h-4 text-accent-500 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg text-primary-900 mb-3 line-clamp-1 group-hover:text-accent-600 transition-colors">
          {property.title}
        </h3>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-secondary-600 mb-4">
          {bedrooms && (
            <div className="flex items-center gap-1.5">
              <IoBedOutline className="w-4 h-4 text-secondary-400" />
              <span>{bedrooms} ch.</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1.5">
              <LuBath className="w-4 h-4 text-secondary-400" />
              <span>{bathrooms} sdb.</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-1.5">
              <FiMaximize2 className="w-4 h-4 text-secondary-400" />
              <span>{area} m²</span>
            </div>
          )}
        </div>

        {/* Price & View Details */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
          <div className="text-primary-900">
            {formatPrice(property.price, isRental)}
          </div>
          <span className="text-sm font-medium text-accent-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Voir détails →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
