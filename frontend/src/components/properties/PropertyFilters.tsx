'use client';

import { useState } from 'react';
import { FiSliders, FiX } from 'react-icons/fi';
import { PropertyFilters as Filters } from '@/types';

interface PropertyFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: '',
    listingType: '',
    city: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    search: '',
  });

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      type: '',
      listingType: '',
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      search: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== undefined).length;

  return (
    <>
      {/* Filter Toggle Button - Airbnb style */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-3 border border-secondary-300 rounded-xl hover:border-secondary-900 transition-colors"
      >
        <FiSliders size={16} />
        <span className="text-sm font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 bg-secondary-900 text-white text-xs rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-[600px] md:max-h-[90vh] rounded-t-3xl md:rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
              <span className="font-semibold">Filters</span>
              <button
                onClick={handleReset}
                className="text-sm font-medium text-secondary-900 underline"
              >
                Clear all
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Listing Type */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Type of listing</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['rent', 'sale'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('listingType', filters.listingType === type ? '' : type)}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        filters.listingType === type 
                          ? 'border-secondary-900 bg-secondary-50' 
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <span className="font-medium capitalize">{type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Property type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['apartment', 'villa', 'house', 'studio', 'commercial', 'land'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', filters.type === type ? '' : type)}
                      className={`p-3 border rounded-xl text-center transition-all text-sm ${
                        filters.type === type 
                          ? 'border-secondary-900 bg-secondary-50' 
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Price range (DH)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary-500 mb-1 block">Minimum</label>
                    <input
                      type="number"
                      placeholder="No min"
                      className="input"
                      value={filters.minPrice || ''}
                      onChange={(e) =>
                        handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-secondary-500 mb-1 block">Maximum</label>
                    <input
                      type="number"
                      placeholder="No max"
                      className="input"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Bedrooms</h3>
                <div className="flex gap-2">
                  {['Any', 1, 2, 3, 4, '5+'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleFilterChange('bedrooms', num === 'Any' ? undefined : (num === '5+' ? 5 : num))}
                      className={`flex-1 py-3 border rounded-xl text-center transition-all text-sm ${
                        (num === 'Any' && !filters.bedrooms) || filters.bedrooms === (num === '5+' ? 5 : num)
                          ? 'border-secondary-900 bg-secondary-50' 
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-secondary-200 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="text-sm font-medium underline"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyFilters;
