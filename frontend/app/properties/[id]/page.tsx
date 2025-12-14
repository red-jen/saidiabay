'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getPropertyById, createBooking } from '@/lib/api';
import { Property, Booking } from '@/types';

interface BookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  start_date: string;
  end_date: string;
  message?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const id = parseInt(params.id as string);
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const onSubmit = async (data: BookingFormData) => {
    if (!property?.id) return;

    try {
      setSubmitting(true);
      const booking: Booking = {
        ...data,
        property_id: property.id,
      };
      await createBooking(booking);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Property not found</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Images */}
              <div className="h-96 bg-gray-300">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <p className="text-gray-600">
                      {property.address}, {property.city}, {property.country}
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">
                    ${property.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-6 mb-6 pb-6 border-b">
                  {property.bedrooms && (
                    <div>
                      <p className="text-gray-600 text-sm">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <p className="text-gray-600 text-sm">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  )}
                  {property.area && (
                    <div>
                      <p className="text-gray-600 text-sm">Area</p>
                      <p className="font-semibold">{property.area}m²</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 text-sm">Type</p>
                    <p className="font-semibold capitalize">{property.type}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-6">Book a Viewing</h2>

              {submitted && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    Booking request submitted! We&apos;ll contact you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    {...register('customer_name', { required: 'Name is required' })}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.customer_name && (
                    <p className="text-red-600 text-xs mt-1">{errors.customer_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    {...register('customer_email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email',
                      },
                    })}
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.customer_email && (
                    <p className="text-red-600 text-xs mt-1">{errors.customer_email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    {...register('customer_phone')}
                    type="tel"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    {...register('start_date', { required: 'Start date is required' })}
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.start_date && (
                    <p className="text-red-600 text-xs mt-1">{errors.start_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    {...register('end_date', { required: 'End date is required' })}
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {errors.end_date && (
                    <p className="text-red-600 text-xs mt-1">{errors.end_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
