import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-300 relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image
          </div>
        )}
        {property.is_featured && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {property.city}, {property.country}
        </p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            {property.bedrooms && <span>{property.bedrooms} beds</span>}
            {property.bathrooms && <span> • {property.bathrooms} baths</span>}
            {property.area && <span> • {property.area}m²</span>}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </span>
          <Link
            href={`/properties/${property.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
