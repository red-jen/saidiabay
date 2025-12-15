'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { FiGrid, FiList } from 'react-icons/fi';

// Mock data - will be replaced with API call
const mockProperties = [
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
  {
    id: '4',
    title: 'Family Home with Garden',
    slug: 'family-home-garden',
    price: 320000,
    type: 'house',
    listingType: 'sale',
    location: 'Saidia Center',
    bedrooms: 4,
    bathrooms: 2,
    area: 200,
    images: ['/images/property-4.jpg'],
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Penthouse with Panoramic View',
    slug: 'penthouse-panoramic-view',
    price: 2500,
    type: 'apartment',
    listingType: 'rent',
    location: 'Saidia Marina',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    images: ['/images/property-5.jpg'],
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Commercial Space Downtown',
    slug: 'commercial-space-downtown',
    price: 180000,
    type: 'commercial',
    listingType: 'sale',
    location: 'Saidia Downtown',
    bedrooms: 0,
    bathrooms: 1,
    area: 120,
    images: ['/images/property-6.jpg'],
    isFeatured: false,
  },
];

const PropertyList = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-secondary-600">
          Showing <span className="font-semibold">{properties.length}</span> properties
        </p>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input py-2"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-secondary-200 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-secondary-600'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={20} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-secondary-600'}`}
              onClick={() => setViewMode('list')}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <div className="flex gap-2">
          <button className="btn-secondary px-4 py-2">Previous</button>
          <button className="btn-primary px-4 py-2">1</button>
          <button className="btn-secondary px-4 py-2">2</button>
          <button className="btn-secondary px-4 py-2">3</button>
          <button className="btn-secondary px-4 py-2">Next</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
