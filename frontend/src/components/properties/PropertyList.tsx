'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { propertiesApi } from '@/lib/api';
import { Property, PropertyFilters as Filters } from '@/types';
import { FiChevronLeft, FiChevronRight, FiMap } from 'react-icons/fi';

const PropertyList = () => {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 12,
  });

  const [filters, setFilters] = useState<Filters>({
    type: searchParams.get('type') || '',
    listingType: searchParams.get('listingType') || '',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Map frontend filter names to API parameter names
      const apiParams: Record<string, any> = {};
      
      if (filters.page) apiParams.page = filters.page;
      if (filters.limit) apiParams.limit = filters.limit;
      if (filters.listingType) apiParams.listingType = filters.listingType;
      if (filters.type) apiParams.propertyCategory = filters.type; // Map 'type' to 'propertyCategory'
      if (filters.city) apiParams.cityId = filters.city; // Map 'city' to 'cityId'
      if (filters.minPrice) apiParams.minPrice = filters.minPrice;
      if (filters.maxPrice) apiParams.maxPrice = filters.maxPrice;
      if (filters.bedrooms) apiParams.chambres = filters.bedrooms; // Map 'bedrooms' to 'chambres'
      if (filters.sortBy) apiParams.sortBy = filters.sortBy;
      if (filters.sortOrder) apiParams.sortOrder = filters.sortOrder;
      if (filters.search) apiParams.search = filters.search;

      const response = await propertiesApi.getAll(apiParams);
      
      // API returns { properties: [], pagination: {} } directly
      const propertiesList = response?.properties || [];
      
      setProperties(propertiesList);
      if (response?.pagination) {
        setPagination({
          total: response.pagination.total || 0,
          page: response.pagination.page || 1,
          pages: response.pagination.totalPages || 1,
          limit: response.pagination.limit || 12,
        });
      }
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters({ ...newFilters, page: 1, limit: 20 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <PropertyFilters onFilterChange={handleFilterChange} />

            <div className="relative">
              <select
                className="px-5 py-3 border border-secondary-300 rounded-xl text-sm font-medium bg-white hover:border-primary-600 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer appearance-none pr-10"
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'ASC' | 'DESC' });
                }}
              >
                <option value="createdAt-DESC">Plus récents</option>
                <option value="createdAt-ASC">Plus anciens</option>
                <option value="price-ASC">Prix: Croissant</option>
                <option value="price-DESC">Prix: Décroissant</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button className="hidden lg:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg">
            <FiMap size={18} />
            <span className="text-sm font-semibold">Voir sur la carte</span>
          </button>
        </div>

        {/* Results info with better styling */}
        <div className="mt-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-secondary-700">
              <span className="text-primary-600 font-bold">{pagination.total}</span> 
              {' '}propriété{pagination.total !== 1 ? 's' : ''} trouvée{pagination.total !== 1 ? 's' : ''}
            </p>
            {pagination.pages > 1 && (
              <p className="text-sm text-secondary-500">
                Page {pagination.page} sur {pagination.pages}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Property Grid - Enhanced */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-3/4" />
                <div className="h-4 bg-secondary-200 rounded w-1/2" />
                <div className="h-5 bg-secondary-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Enhanced Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-16 pt-8 border-t border-secondary-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-secondary-600">
                  Affichage de <span className="font-semibold text-secondary-900">
                    {((pagination.page - 1) * pagination.limit) + 1}
                  </span> à <span className="font-semibold text-secondary-900">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> sur <span className="font-semibold text-secondary-900">{pagination.total}</span> propriétés
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-50 hover:text-primary-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-secondary-200 hover:border-primary-300"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 7) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 4) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 3) {
                        pageNum = pagination.pages - 6 + i;
                      } else {
                        pageNum = pagination.page - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                            pageNum === pagination.page
                              ? 'bg-primary-900 text-white shadow-lg scale-105'
                              : 'hover:bg-primary-50 hover:text-primary-700 border border-secondary-200 hover:border-primary-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-50 hover:text-primary-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-secondary-200 hover:border-primary-300"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-secondary-600 mb-6">
              Essayez d'ajuster vos filtres ou vos critères de recherche pour trouver ce que vous cherchez.
            </p>
            <button
              onClick={() => handleFilterChange({ type: '', listingType: '', city: '', minPrice: undefined, maxPrice: undefined, bedrooms: undefined, search: '' })}
              className="px-6 py-3 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
