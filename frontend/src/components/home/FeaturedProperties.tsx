'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiHome, FiStar, FiTrendingUp, FiKey } from 'react-icons/fi';
import PropertyCard from '@/components/properties/PropertyCard';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';

const categories = [
  { id: 'featured', label: 'Featured', icon: FiStar },
  { id: 'all', label: 'All Properties', icon: FiHome },
  { id: 'rent', label: 'For Rent', icon: FiKey },
  { id: 'sale', label: 'For Sale', icon: FiTrendingUp },
];

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('featured');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let response;
        if (activeCategory === 'featured') {
          response = await propertiesApi.getFeatured(8);
          setProperties(response.data.data || []);
        } else if (activeCategory === 'all') {
          response = await propertiesApi.getAll({ limit: 8, status: 'available' });
          setProperties(response.data.data.properties || []);
        } else {
          response = await propertiesApi.getAll({ listingType: activeCategory, limit: 8, status: 'available' });
          setProperties(response.data.data.properties || []);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeCategory]);

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-secondary-900 mb-3">
              Explore Our Collection
            </h2>
            <p className="text-lg text-secondary-500">
              Handpicked properties that define luxury living in Saidia Bay
            </p>
          </div>
          <Link 
            href="/properties" 
            className="inline-flex items-center gap-2 text-primary-900 font-semibold hover:gap-3 transition-all group"
          >
            <span>View All Properties</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-900 text-white shadow-lg'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              <cat.icon size={18} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="skeleton aspect-square rounded-xl" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary-50 rounded-2xl">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHome className="text-secondary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">No properties found</h3>
              <p className="text-secondary-500">Check back soon for new listings</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
