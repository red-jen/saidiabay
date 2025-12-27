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
      const params = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await propertiesApi.getAll(params);
      setProperties(response.data.data.properties || []);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching properties:', error);
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
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PropertyFilters onFilterChange={handleFilterChange} />
          
          <select
            className="px-4 py-3 border border-secondary-300 rounded-xl text-sm font-medium bg-white hover:border-secondary-900 transition-colors cursor-pointer"
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'ASC' | 'DESC' });
            }}
          >
            <option value="createdAt-DESC">Newest first</option>
            <option value="createdAt-ASC">Oldest first</option>
            <option value="price-ASC">Price: Low to high</option>
            <option value="price-DESC">Price: High to low</option>
          </select>
        </div>

        <button className="hidden lg:flex items-center gap-2 px-4 py-3 border border-secondary-300 rounded-xl hover:border-secondary-900 transition-colors">
          <FiMap size={16} />
          <span className="text-sm font-medium">Show map</span>
        </button>
      </div>

      {/* Results info */}
      <p className="text-sm text-secondary-500 mb-6">
        {pagination.total} properties found
      </p>

      {/* Property Grid - Airbnb style */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton aspect-square rounded-xl" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination - Airbnb style */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={20} />
              </button>

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
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      pageNum === pagination.page 
                        ? 'bg-secondary-900 text-white' 
                        : 'hover:bg-secondary-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-secondary-900 font-medium mb-2">
            No properties found
          </p>
          <p className="text-secondary-500">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
