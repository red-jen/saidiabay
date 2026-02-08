'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { api } from '@/lib/utils/api';
import { useToast } from '@/components/ui/Toast';

export default function NewPropertyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post('/api/properties', data);
      showToast('Propriété créée avec succès', 'success');
      router.push('/properties');
    } catch (error: any) {
      showToast(error.message || 'Échec de création de la propriété', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ajouter une Propriété</h1>
        <p className="text-gray-600 mt-1">Créer une nouvelle annonce immobilière</p>
      </div>

      <Card>
        <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
}