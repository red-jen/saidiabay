'use client';

import { useState, useEffect } from 'react';
import { FiSliders, FiX, FiMapPin, FiSearch } from 'react-icons/fi';
import { PropertyFilters as Filters } from '@/types';
import { citiesApi } from '@/lib/api';

interface City {
  id: string;
  name: string;
  slug: string;
}

interface PropertyFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: '',
    listingType: '',
    city: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    search: '',
  });

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await citiesApi.getAll();
        setCities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  // Update local filter state without triggering API call
  const updateLocalFilter = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply all filters at once (triggered by "Afficher les résultats" button)
  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
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

  // Handle search submission from inline search bar
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== undefined).length;

  // Listing type options matching API values
  const listingTypes = [
    { value: 'LOCATION', label: 'À Louer' },
    { value: 'VENTE', label: 'À Vendre' },
  ];

  // Property category options matching API values
  const propertyCategories = [
    { value: 'VILLA', label: 'Villa' },
    { value: 'APPARTEMENT', label: 'Appartement' },
  ];

  return (
    <>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px] max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        <input
          type="text"
          placeholder="Rechercher une propriété..."
          value={filters.search || ''}
          onChange={(e) => updateLocalFilter('search', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onFilterChange(filters);
            }
          }}
          className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-xl text-sm bg-white hover:border-secondary-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all"
        />
      </form>

      {/* Filter Toggle Button - Airbnb style */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-3 border border-secondary-300 rounded-xl hover:border-secondary-900 transition-colors"
      >
        <FiSliders size={16} />
        <span className="text-sm font-medium">Filtres</span>
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white w-full md:w-[600px] md:max-h-[90vh] rounded-t-3xl md:rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
              <span className="font-semibold">Filtres</span>
              <button
                onClick={handleReset}
                className="text-sm font-medium text-secondary-900 underline"
              >
                Effacer tout
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Listing Type */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Type d&apos;annonce</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listingTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateLocalFilter('listingType', filters.listingType === type.value ? '' : type.value)}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        filters.listingType === type.value 
                          ? 'border-primary-900 bg-primary-50 font-semibold' 
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Category */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Type de propriété</h3>
                <div className="grid grid-cols-2 gap-3">
                  {propertyCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => updateLocalFilter('type', filters.type === cat.value ? '' : cat.value)}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        filters.type === cat.value 
                          ? 'border-primary-900 bg-primary-50 font-semibold' 
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selection */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Ville</h3>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                  <select
                    value={filters.city || ''}
                    onChange={(e) => updateLocalFilter('city', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-secondary-300 rounded-xl text-sm bg-white hover:border-secondary-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Toutes les villes</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Fourchette de prix (DH)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary-500 mb-1 block">Minimum</label>
                    <input
                      type="number"
                      placeholder="Pas de min"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl text-sm hover:border-secondary-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all"
                      value={filters.minPrice || ''}
                      onChange={(e) =>
                        updateLocalFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-secondary-500 mb-1 block">Maximum</label>
                    <input
                      type="number"
                      placeholder="Pas de max"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl text-sm hover:border-secondary-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        updateLocalFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="font-semibold text-secondary-900 mb-4">Chambres</h3>
                <div className="flex gap-2">
                  {['Tous', 1, 2, 3, 4, '5+'].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateLocalFilter('bedrooms', num === 'Tous' ? undefined : (num === '5+' ? 5 : num))}
                      className={`flex-1 py-3 border rounded-xl text-center transition-all text-sm ${
                        (num === 'Tous' && !filters.bedrooms) || filters.bedrooms === (num === '5+' ? 5 : num)
                          ? 'border-primary-900 bg-primary-50 text-primary-900 font-semibold' 
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
                Effacer tout
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-3 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors"
              >
                Afficher les résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyFilters;
