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
  imageUrl: string;
  ctaLink: string;
  order: number;
  isActive: boolean;
}

interface HeroStats {
  heroId: string;
  imageUrl: string;
  ctaLink: string;
  isActive: boolean;
  totalClicks: number;
  monthlyClicks: number;
}

export default function HeroSectionsPage() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [heroStats, setHeroStats] = useState<HeroStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadHeroesWithStats();
  }, []);

  const loadHeroesWithStats = async () => {
    try {
      const [heroesResponse, statsResponse]: any[] = await Promise.all([
        api.get('/api/heroes'),
        api.get('/api/hero-clicks/stats'),
      ]);

      const sortedHeroes = heroesResponse.data.sort(
        (a: HeroSection, b: HeroSection) => a.order - b.order
      );
      
      setHeroes(sortedHeroes);
      setHeroStats(statsResponse.data);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatsForHero = (heroId: string) => {
    const stats = heroStats.find((s) => s.heroId === heroId);
    return {
      monthly: stats?.monthlyClicks || 0,
      total: stats?.totalClicks || 0,
    };
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette image hero ?')) return;

    try {
      await api.delete(`/api/heroes/${id}`);
      showToast('Image supprimée', 'success');
      loadHeroesWithStats();
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
      loadHeroesWithStats();
    } catch (error) {
      showToast('Erreur de mise à jour', 'error');
    }
  };

  const handleMoveUp = async (hero: HeroSection) => {
    const currentIndex = heroes.findIndex((h) => h.id === hero.id);
    if (currentIndex === 0) return;

    const newOrder = [...heroes];
    [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
      newOrder[currentIndex - 1],
      newOrder[currentIndex],
    ];

    try {
      await api.post('/api/heroes/reorder', {
        heroIds: newOrder.map((h) => h.id),
      });
      showToast('Ordre modifié', 'success');
      loadHeroesWithStats();
    } catch (error) {
      showToast('Erreur de réorganisation', 'error');
    }
  };

  const handleMoveDown = async (hero: HeroSection) => {
    const currentIndex = heroes.findIndex((h) => h.id === hero.id);
    if (currentIndex === heroes.length - 1) return;

    const newOrder = [...heroes];
    [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
      newOrder[currentIndex + 1],
      newOrder[currentIndex],
    ];

    try {
      await api.post('/api/heroes/reorder', {
        heroIds: newOrder.map((h) => h.id),
      });
      showToast('Ordre modifié', 'success');
      loadHeroesWithStats();
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
              <TableHead>Lien</TableHead>
              <TableHead>📊 Clics (Mois)</TableHead>
              <TableHead>📊 Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heroes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Aucune image hero
                </TableCell>
              </TableRow>
            ) : (
              heroes.map((hero, index) => {
                const stats = getStatsForHero(hero.id);
                return (
                  <TableRow key={hero.id}>
                    <TableCell>
                      <img
                        src={hero.imageUrl}
                        alt="Hero"
                        className="w-24 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={hero.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate max-w-xs block"
                      >
                        {hero.ctaLink}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-600">
                        {stats.monthly}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        {stats.total}
                      </span>
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
                          onClick={() =>
                            handleToggleActive(hero.id, hero.isActive)
                          }
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
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}