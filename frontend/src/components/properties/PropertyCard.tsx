import Link from 'next/link';
import { FiMapPin, FiBed, FiMaximize, FiHeart } from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  type: string;
  listingType: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  isFeatured?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-56 bg-secondary-200 overflow-hidden">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <span className="text-white/30 text-6xl font-bold">
            {property.type.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            property.listingType === 'rent'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {property.isFeatured && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500 text-white">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <FiHeart className="text-secondary-600 hover:text-red-500" />
        </button>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white px-4 py-2 rounded-lg font-bold text-secondary-800 shadow-lg">
            {formatPrice(property.price, property.listingType)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-secondary-500 text-sm mb-2">
          <FiMapPin size={14} />
          <span>{property.location}</span>
        </div>

        <Link href={`/properties/${property.slug}`}>
          <h3 className="text-lg font-semibold text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Features */}
        <div className="flex items-center gap-4 text-secondary-600 text-sm border-t border-secondary-100 pt-4">
          <div className="flex items-center gap-1">
            <FiBed />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚿</span>
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <FiMaximize />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
