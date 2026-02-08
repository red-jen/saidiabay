'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/utils/api';

interface Property {
  id: string;
  title: string;
  listingType: string;
}

interface BlockedDate {
  id: string;
  propertyId: string;
  property: Property;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
}

export default function BlockedDatesPage() {
  const { showToast } = useToast();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load properties (rental properties only)
      const propertiesRes: any = await api.get('/api/properties');
      const rentalProperties = propertiesRes.data.properties.filter(
        (p: Property) => p.listingType === 'LOCATION'
      );
      setProperties(rentalProperties);

      // Load all blocked dates
      const blockedDatesRes: any = await api.get('/api/blocked-dates');
      setBlockedDates(blockedDatesRes.data || []);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.propertyId || !formData.startDate || !formData.endDate) {
      showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    try {
      await api.post('/api/blocked-dates', formData);
      showToast('Dates bloquées avec succès', 'success');
      setShowAddModal(false);
      setFormData({ propertyId: '', startDate: '', endDate: '', reason: '' });
      loadData();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors du blocage des dates', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir débloquer ces dates ?')) return;

    try {
      await api.delete(`/api/blocked-dates/${id}`);
      showToast('Dates débloquées avec succès', 'success');
      loadData();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors du déblocage', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dates Bloquées</h1>
        <Button onClick={() => setShowAddModal(true)}>+ Bloquer des dates</Button>
      </div>

      {/* Blocked Dates List */}
      <Card>
        <div className="space-y-4">
          {blockedDates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune date bloquée pour le moment
            </p>
          ) : (
            <div className="divide-y">
              {blockedDates.map((blocked) => (
                <div
                  key={blocked.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {blocked.property?.title || 'Propriété inconnue'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Du {new Date(blocked.startDate).toLocaleDateString('fr-FR')}
                      {' '}au {new Date(blocked.endDate).toLocaleDateString('fr-FR')}
                    </p>
                    {blocked.reason && (
                      <p className="text-sm text-gray-500 mt-1">
                        Raison: {blocked.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Créé le {new Date(blocked.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(blocked.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Débloquer
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Bloquer des dates</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propriété *
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez une propriété</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Ex: Maintenance, Travaux..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Bloquer
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ propertyId: '', startDate: '', endDate: '', reason: '' });
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
