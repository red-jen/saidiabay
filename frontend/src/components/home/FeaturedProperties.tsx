import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiBed, FiMaximize } from 'react-icons/fi';
import PropertyCard from '@/components/properties/PropertyCard';

// Mock data - will be replaced with API call
const featuredProperties = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa',
    slug: 'luxury-beachfront-villa',
    price: 850000,
    type: 'villa',
    listingType: 'sale',
    location: 'Saidia Bay Marina',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images: ['/images/property-1.jpg'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Modern Sea View Apartment',
    slug: 'modern-sea-view-apartment',
    price: 1500,
    type: 'apartment',
    listingType: 'rent',
    location: 'Saidia Beach',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    images: ['/images/property-2.jpg'],
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Cozy Studio Near Golf Course',
    slug: 'cozy-studio-golf-course',
    price: 95000,
    type: 'studio',
    listingType: 'sale',
    location: 'Saidia Golf Resort',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: ['/images/property-3.jpg'],
    isFeatured: true,
  },
];

const FeaturedProperties = () => {
  return (
    <section className="section bg-secondary-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-subtitle">
            Discover our hand-picked selection of premium properties available for rent and sale
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/properties" className="btn-outline inline-flex items-center gap-2">
            View All Properties
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
