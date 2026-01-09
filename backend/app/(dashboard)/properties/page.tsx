'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { api } from '@/lib/utils/api';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Property } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'RENT' | 'SALE'>('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    loadProperties();
  }, [filter]);

  const loadProperties = async () => {
    try {
      const url = filter === 'ALL' 
        ? '/api/properties' 
        : `/api/properties?propertyType=${filter}`;
      const response: any = await api.get(url);
      setProperties(response.data.properties);
    } catch (error) {
      showToast('Échec du chargement des propriétés', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) return;

    try {
      await api.delete(`/api/properties/${id}`);
      showToast('Propriété supprimée avec succès', 'success');
      loadProperties();
    } catch (error) {
      showToast('Échec de la suppression', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement des propriétés...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Propriétés</h1>
        <Link href="/properties/new">
          <Button>+ Ajouter une propriété</Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={filter === 'ALL' ? 'primary' : 'ghost'}
          onClick={() => setFilter('ALL')}
          size="sm"
        >
          Toutes
        </Button>
        <Button 
          variant={filter === 'RENT' ? 'primary' : 'ghost'}
          onClick={() => setFilter('RENT')}
          size="sm"
        >
          Location
        </Button>
        <Button 
          variant={filter === 'SALE' ? 'primary' : 'ghost'}
          onClick={() => setFilter('SALE')}
          size="sm"
        >
          Vente
        </Button>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Propriété</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Aucune propriété trouvée
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {property.thumbnail && (
                        <img 
                          src={property.thumbnail} 
                          alt={property.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-xs text-gray-500">{property.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded ${
                      property.listingType === 'LOCATION' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {property.listingType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {property.city?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(property.price)}
                    {property.listingType === 'LOCATION' && <span className="text-xs text-gray-500">/nuit</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded ${
                      property.status === 'AVAILABLE' 
                        ? 'bg-green-100 text-green-800' 
                        : property.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{formatDate(property.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/properties/${property.id}/edit`}>
                        <Button size="sm" variant="ghost">Modifier</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(property.id)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Propriétés</p>
            <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pour Location</p>
            <p className="text-2xl font-bold text-purple-600">
              {properties.filter(p => p.listingType === 'LOCATION').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pour Vente</p>
            <p className="text-2xl font-bold text-green-600">
              {properties.filter(p => p.listingType === 'VENTE').length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}