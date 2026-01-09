'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiMapPin, FiHome, FiMaximize2, FiCheck, FiDollarSign } from 'react-icons/fi';
import { useComparisonStore } from '@/store/comparisonStore';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';

export default function ComparePage() {
  const { comparisonIds, removeFromComparison, clearComparison } = useComparisonStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (comparisonIds.length > 0) {
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [comparisonIds]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesApi.getAll({ page: 1, limit: 100 });
      const compareProps = response.properties.filter((prop: Property) =>
        comparisonIds.includes(prop.id)
      );
      setProperties(compareProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { key: 'price', label: 'Price', icon: FiDollarSign },
    { key: 'type', label: 'Type', icon: FiHome },
    { key: 'location', label: 'Location', icon: FiMapPin },
    { key: 'bedrooms', label: 'Bedrooms', icon: FiHome },
    { key: 'bathrooms', label: 'Bathrooms', icon: FiHome },
    { key: 'area', label: 'Area (m²)', icon: FiMaximize2 },
    { key: 'listingType', label: 'Listing Type', icon: FiHome },
    { key: 'status', label: 'Status', icon: FiCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container mx-auto">
          <div className="skeleton h-12 w-64 mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-16">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-12">
            <FiHome className="w-24 h-24 text-secondary-300 mx-auto mb-6" />
            <h1 className="text-4xl font-heading font-bold text-secondary-900 mb-4">
              No Properties to Compare
            </h1>
            <p className="text-lg text-secondary-600 mb-8">
              Start by adding properties to your comparison list from the property listings.
            </p>
            <Link href="/properties" className="btn-primary">
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">
                Compare Properties
              </h1>
              <p className="text-secondary-600">
                Comparing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/properties" className="btn-secondary">
                Add More
              </Link>
              <button
                onClick={clearComparison}
                className="btn-outline text-danger-600 border-danger-600 hover:bg-danger-50"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="section">
        <div className="container mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-secondary-50 border-r border-b border-secondary-200 p-4 text-left min-w-[200px]">
                      <span className="text-sm font-semibold text-secondary-600">
                        FEATURES
                      </span>
                    </th>
                    {properties.map((property) => (
                      <th
                        key={property.id}
                        className="border-b border-secondary-200 p-0 min-w-[280px] relative group"
                      >
                        <div className="relative h-48">
                          <Image
                            src={property.images[0] || '/images/placeholder.jpg'}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeFromComparison(property.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                          >
                            <FiX className="w-5 h-5 text-secondary-700" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-secondary-900 mb-1 line-clamp-2">
                            {property.title}
                          </h3>
                          <Link
                            href={`/properties/${property.slug}`}
                            className="text-sm text-primary-700 hover:text-primary-900 transition-colors"
                          >
                            View Details →
                          </Link>
                        </div>
                      </th>
                    ))}
                    {/* Empty columns to fill up to 4 */}
                    {Array.from({ length: 4 - properties.length }).map((_, i) => (
                      <th
                        key={`empty-${i}`}
                        className="border-b border-secondary-200 p-4 min-w-[280px]"
                      >
                        <Link
                          href="/properties"
                          className="h-48 flex flex-col items-center justify-center bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-300 hover:border-primary-500 hover:bg-primary-50 transition-all"
                        >
                          <FiHome className="w-12 h-12 text-secondary-400 mb-3" />
                          <span className="text-sm text-secondary-600">Add Property</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <tr
                        key={feature.key}
                        className={index % 2 === 0 ? 'bg-secondary-50/50' : 'bg-white'}
                      >
                        <td className="sticky left-0 z-10 bg-inherit border-r border-secondary-200 p-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-secondary-500" />
                            <span className="font-medium text-secondary-700">
                              {feature.label}
                            </span>
                          </div>
                        </td>
                        {properties.map((property) => (
                          <td key={property.id} className="p-4 text-secondary-900">
                            {feature.key === 'price' && (
                              <span className="text-lg font-semibold">
                                ${property.price.toLocaleString()}
                              </span>
                            )}
                            {feature.key === 'type' && property.type}
                            {feature.key === 'location' && property.location}
                            {feature.key === 'bedrooms' && (property.bedrooms || 'N/A')}
                            {feature.key === 'bathrooms' && (property.bathrooms || 'N/A')}
                            {feature.key === 'area' && `${property.area || 'N/A'} m²`}
                            {feature.key === 'listingType' && (
                              <span
                                className={`badge ${property.listingType === 'sale'
                                  ? 'badge-sale'
                                  : 'badge-rent'
                                  }`}
                              >
                                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                              </span>
                            )}
                            {feature.key === 'status' && (
                              <span
                                className={`badge ${property.status === 'available'
                                  ? 'badge-available'
                                  : property.status === 'sold'
                                    ? 'badge-sold'
                                    : 'badge-pending'
                                  }`}
                              >
                                {property.status === 'available'
                                  ? 'Available'
                                  : property.status === 'sold'
                                    ? 'Sold'
                                    : 'Pending'}
                              </span>
                            )}
                          </td>
                        ))}
                        {/* Empty cells */}
                        {Array.from({ length: 4 - properties.length }).map((_, i) => (
                          <td key={`empty-${i}`} className="p-4 text-secondary-400">
                            -
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center">
            <p className="text-secondary-600 mb-4">
              Need help deciding? Contact our team for expert advice.
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

