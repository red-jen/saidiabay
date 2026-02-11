'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import PropertiesMap from './PropertiesMap';
import Dropdown from '@/components/ui/Dropdown';
import { propertiesApi } from '@/lib/api';
import { Property, PropertyFilters as Filters } from '@/types';
import { FiChevronLeft, FiChevronRight, FiMap, FiGrid } from 'react-icons/fi';

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
    type: searchParams.get('propertyCategory') || searchParams.get('type') || '',
    listingType: searchParams.get('listingType') || '',
    search: searchParams.get('search') || '',
    city: searchParams.get('cityId') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortValue, setSortValue] = useState('createdAt-DESC');

  // Update filters when URL search params change
  useEffect(() => {
    console.log('📍 URL Search Params changed:', {
      propertyCategory: searchParams.get('propertyCategory'),
      type: searchParams.get('type'),
      listingType: searchParams.get('listingType'),
      search: searchParams.get('search'),
      cityId: searchParams.get('cityId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    });
    
    const newFilters: Filters = {
      type: searchParams.get('propertyCategory') || searchParams.get('type') || '',
      listingType: searchParams.get('listingType') || '',
      search: searchParams.get('search') || '',
      city: searchParams.get('cityId') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: 20,
    };
    
    console.log('📍 New filters set:', newFilters);
    setFilters(newFilters);
  }, [searchParams]);

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
      
      // Add date filters from URL if present
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (startDate) apiParams.startDate = startDate;
      if (endDate) apiParams.endDate = endDate;

      console.log('🔍 Fetching properties with API params:', apiParams);
      const response = await propertiesApi.getAll(apiParams);
      console.log('✅ Properties response:', response);
      
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
      {/* Enhanced Toolbar - Premium Styling */}
      <div className="bg-white rounded-2xl shadow-elegant p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <PropertyFilters onFilterChange={handleFilterChange} />

            <Dropdown
              options={[
                { value: 'createdAt-DESC', label: 'Plus récents' },
                { value: 'createdAt-ASC', label: 'Plus anciens' },
                { value: 'price-ASC', label: 'Prix croissant' },
                { value: 'price-DESC', label: 'Prix décroissant' },
              ]}
              value={sortValue}
              onChange={(value) => {
                setSortValue(value);
                const [sortBy, sortOrder] = value.split('-');
                setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'ASC' | 'DESC' });
              }}
              placeholder="Trier par"
              className="w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-900 text-white'
                  : 'bg-white text-secondary-700 border border-secondary-200 hover:border-primary-300'
              }`}
            >
              <FiGrid size={18} />
              <span className="text-sm font-medium hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-900 text-white'
                  : 'bg-white text-secondary-700 border border-secondary-200 hover:border-primary-300'
              }`}
            >
              <FiMap size={18} />
              <span className="text-sm font-medium hidden sm:inline">Carte</span>
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-5 pt-5 border-t border-secondary-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary-600">
              <span className="font-semibold text-primary-900">{pagination.total}</span> 
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

      {/* Property View - List or Map */}
      {loading ? (
        viewMode === 'list' ? (
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
        ) : (
          <div className="w-full h-[600px] bg-secondary-100 rounded-2xl flex items-center justify-center animate-pulse">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-sm text-secondary-500">Chargement de la carte...</span>
            </div>
          </div>
        )
      ) : properties.length > 0 ? (
        <>
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <PropertiesMap properties={properties} />
          )}

          {/* Enhanced Pagination - Only show in list view */}
          {viewMode === 'list' && pagination.pages > 1 && (
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
