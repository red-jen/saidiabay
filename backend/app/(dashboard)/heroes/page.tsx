'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { api } from '@/lib/utils/api';
import { useToast } from '@/components/ui/Toast';

interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export default function HeroSectionsPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      const response: any = await api.get('/api/heroes');
      setHeroes(response.data.sort((a: HeroSection, b: HeroSection) => a.order - b.order));
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette image hero ?')) return;

    try {
      await api.delete(`/api/heroes/${id}`);
      showToast('Image supprimée', 'success');
      loadHeroes();
    } catch (error) {
      showToast('Erreur de suppression', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/heroes/${id}`, { isActive: !currentStatus });
      showToast(
        !currentStatus ? 'Image activée' : 'Image désactivée',
        'success'
      );
      loadHeroes();
    } catch (error) {
      showToast('Erreur de mise à jour', 'error');
    }
  };

  const handleMoveUp = async (hero: HeroSection) => {
    const currentIndex = heroes.findIndex(h => h.id === hero.id);
    if (currentIndex === 0) return;

    const newOrder = [...heroes];
    [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];

    try {
      await api.post('/api/heroes/reorder', {
        heroIds: newOrder.map(h => h.id),
      });
      showToast('Ordre modifié', 'success');
      loadHeroes();
    } catch (error) {
      showToast('Erreur de réorganisation', 'error');
    }
  };

  const handleMoveDown = async (hero: HeroSection) => {
    const currentIndex = heroes.findIndex(h => h.id === hero.id);
    if (currentIndex === heroes.length - 1) return;

    const newOrder = [...heroes];
    [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];

    try {
      await api.post('/api/heroes/reorder', {
        heroIds: newOrder.map(h => h.id),
      });
      showToast('Ordre modifié', 'success');
      loadHeroes();
    } catch (error) {
      showToast('Erreur de réorganisation', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Images Hero</h1>
        <Link href="/heroes/new">
          <Button>+ Nouvelle Image</Button>
        </Link>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aperçu</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Sous-titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heroes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Aucune image hero
                </TableCell>
              </TableRow>
            ) : (
              heroes.map((hero, index) => (
                <TableRow key={hero.id}>
                  <TableCell>
                    <img
                      src={hero.imageUrl}
                      alt={hero.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{hero.title}</p>
                    {hero.ctaText && (
                      <p className="text-sm text-blue-600">
                        CTA: {hero.ctaText}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 max-w-xs truncate">
                      {hero.subtitle || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        hero.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {hero.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveUp(hero)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveDown(hero)}
                        disabled={index === heroes.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/heroes/${hero.id}/edit`}>
                        <Button size="sm" variant="ghost">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant={hero.isActive ? 'secondary' : 'primary'}
                        onClick={() => handleToggleActive(hero.id, hero.isActive)}
                      >
                        {hero.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(hero.id)}
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
    </div>
  );
}