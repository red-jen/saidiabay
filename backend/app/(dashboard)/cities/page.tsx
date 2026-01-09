'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { api } from '@/lib/utils/api';
import { City } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const { showToast } = useToast();

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response: any = await api.get('/api/cities');
      setCities(response.data);
    } catch (error) {
      showToast('Erreur lors du chargement des villes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCity) {
        await api.put(`/api/cities/${editingCity.id}`, formData);
        showToast('Ville mise à jour avec succès', 'success');
      } else {
        await api.post('/api/cities', formData);
        showToast('Ville créée avec succès', 'success');
      }

      setFormData({ name: '', slug: '' });
      setShowForm(false);
      setEditingCity(null);
      loadCities();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({ name: city.name, slug: city.slug });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) return;

    try {
      await api.delete(`/api/cities/${id}`);
      showToast('Ville supprimée avec succès', 'success');
      loadCities();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCity(null);
    setFormData({ name: '', slug: '' });
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Villes</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Ajouter une ville</Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCity ? 'Modifier la ville' : 'Nouvelle ville'}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom de la ville"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="ex: Casablanca"
              required
            />

            <Input
              label="Slug (URL)"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ex: casablanca"
              required
            />
            <p className="text-xs text-gray-500 -mt-2">
              Le slug est généré automatiquement, mais vous pouvez le modifier
            </p>

            <div className="flex gap-3">
              <Button type="submit">
                {editingCity ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Propriétés</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Aucune ville trouvée
                </TableCell>
              </TableRow>
            ) : (
              cities.map((city: any) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.name}</TableCell>
                  <TableCell className="text-gray-600">{city.slug}</TableCell>
                  <TableCell>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {city._count?.properties || 0} propriétés
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(city)}>
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(city.id)}
                        disabled={city._count?.properties > 0}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-2">ℹ️ Informations</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Les villes sont utilisées pour organiser vos propriétés</li>
          <li>• Une ville ne peut pas être supprimée si elle contient des propriétés</li>
          <li>• Le slug est utilisé pour les URLs (SEO-friendly)</li>
        </ul>
      </div>
    </div>
  );
}