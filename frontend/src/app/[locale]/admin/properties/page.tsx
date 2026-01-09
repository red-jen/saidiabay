'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';

export default function AdminPropertiesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchProperties();
  }, [user, page, filterType]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesApi.getAll({
        page,
        limit: 10,
        listingType: filterType !== 'all' ? filterType : undefined,
      });
      setProperties(response.properties);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await propertiesApi.delete(id);
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                href="/admin"
                className="text-sm text-secondary-600 hover:text-secondary-900 mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-heading font-bold text-secondary-900">
                Property Management
              </h1>
            </div>
            <Link href="/admin/properties/new" className="btn-primary flex items-center gap-2">
              <FiPlus className="w-5 h-5" />
              Add New Property
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-full md:w-48"
            >
              <option value="all">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section">
        <div className="container mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-32" />
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary-50 border-b border-secondary-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                        Property
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {filteredProperties.map((property) => (
                      <tr
                        key={property.id}
                        className="hover:bg-secondary-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={property.images[0] || '/images/placeholder.jpg'}
                                alt={property.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-secondary-900">
                                {property.title}
                              </p>
                              <p className="text-sm text-secondary-600">
                                {property.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${property.listingType === 'sale'
                            ? 'badge-sale'
                            : 'badge-rent'
                            }`}>
                            {property.listingType === 'sale' ? 'Sale' : 'Rent'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-secondary-900">
                            ${property.price.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${property.status === 'available'
                            ? 'badge-available'
                            : property.status === 'sold'
                              ? 'badge-sold'
                              : 'badge-pending'
                            }`}>
                            {property.status === 'available'
                              ? 'Available'
                              : property.status === 'sold'
                                ? 'Sold'
                                : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/properties/${property.slug}`}
                              className="p-2 text-secondary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <FiEye className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/admin/properties/${property.id}/edit`}
                              className="p-2 text-secondary-600 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="p-2 text-secondary-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${p === page
                          ? 'bg-primary-900 text-white'
                          : 'bg-white text-secondary-700 hover:bg-secondary-50'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FiFilter className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first property'}
              </p>
              <Link href="/admin/properties/new" className="btn-primary">
                <FiPlus className="w-5 h-5 inline mr-2" />
                Add New Property
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

