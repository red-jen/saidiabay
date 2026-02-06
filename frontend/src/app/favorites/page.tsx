'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useFavoritesStore } from '@/store/favoritesStore';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';
import PropertyCard from '@/components/properties/PropertyCard';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteProperties();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  const fetchFavoriteProperties = async () => {
    try {
      setLoading(true);
      // Fetch properties by IDs
      // For now, we'll fetch all and filter (in production, add a batch fetch endpoint)
      const response = await propertiesApi.getAll({ page: 1, limit: 100 });
      const favoriteProps = response.properties.filter((prop: Property) =>
        favorites.includes(prop.id || prop._id || '')
      );
      setProperties(favoriteProps);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites();
      setProperties([]);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                My Favorites
              </h1>
              <p className="text-xl text-primary-100">
                {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
                <span className="hidden md:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="skeleton h-64 mb-4" />
                  <div className="p-6">
                    <div className="skeleton h-6 w-3/4 mb-2" />
                    <div className="skeleton h-4 w-full mb-2" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHeart className="w-12 h-12 text-secondary-400" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
                No Favorites Yet
              </h2>
              <p className="text-lg text-secondary-600 mb-8">
                Start exploring our properties and save your favorites to easily find them later.
              </p>
              <Link href="/properties" className="btn-primary">
                Browse Properties
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      {favorites.length > 0 && (
        <div className="section bg-white">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-4">
                Tips for Your Favorites
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-secondary-50 rounded-xl">
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    Compare Properties
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Select multiple properties to compare features and prices side by side.
                  </p>
                </div>
                <div className="p-6 bg-secondary-50 rounded-xl">
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    Share with Others
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Share your favorite properties with family or friends for their input.
                  </p>
                </div>
                <div className="p-6 bg-secondary-50 rounded-xl">
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    Schedule Viewings
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Contact us to schedule viewings for your favorite properties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

