'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { api } from '@/lib/utils/api';
import { Property } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function EditPropertyPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    try {
      const response: any = await api.get(`/api/properties/${params.id}`);
      setProperty(response.data);
    } catch (error) {
      showToast('Failed to load property', 'error');
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await api.put(`/api/properties/${params.id}`, data);
      showToast('Property updated successfully', 'success');
      router.push('/properties');
    } catch (error: any) {
      showToast(error.message || 'Failed to update property', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!property) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-600 mt-1">{property.title}</p>
      </div>

      <Card>
        <PropertyForm
          initialData={property}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}