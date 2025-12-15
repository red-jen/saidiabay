'use client';

import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const PropertyFilters = () => {
  const [isOpen, setIsOpen] = useState(true);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'House' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
  ];

  const listingTypes = [
    { value: 'rent', label: 'For Rent' },
    { value: 'sale', label: 'For Sale' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
      {/* Header */}
      <button
        className="w-full p-4 flex items-center justify-between bg-secondary-50 lg:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 font-semibold text-secondary-800">
          <FiFilter />
          <span>Filters</span>
        </div>
        <span className="lg:hidden text-secondary-500 text-sm">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </button>

      {/* Filters Content */}
      <div className={`p-4 space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div>
          <label className="label">Search</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search properties..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Listing Type */}
        <div>
          <label className="label">Listing Type</label>
          <select className="input">
            <option value="">All</option>
            {listingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="label">Property Type</label>
          <select className="input">
            <option value="">All Types</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="label">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="input"
            />
            <input
              type="number"
              placeholder="Max"
              className="input"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="label">Bedrooms</label>
          <select className="input">
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            placeholder="City or area..."
            className="input"
          />
        </div>

        {/* Apply Button */}
        <button className="btn-primary w-full">
          Apply Filters
        </button>

        {/* Reset */}
        <button className="btn-secondary w-full">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
