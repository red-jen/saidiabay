'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/utils/api';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import { Lead } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED' | 'LOST'>('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      const url = filter === 'ALL' 
        ? '/api/leads' 
        : `/api/leads?status=${filter}`;
      const response: any = await api.get(url);
      setLeads(response.data);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/leads/${id}`, { status });
      showToast(`Lead mis à jour: ${status}`, 'success');
      loadLeads();
    } catch (error) {
      showToast('Erreur de mise à jour', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce lead ?')) return;

    try {
      await api.delete(`/api/leads/${id}`);
      showToast('Lead supprimé', 'success');
      loadLeads();
    } catch (error) {
      showToast('Erreur de suppression', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  const statusOptions = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filter === 'ALL' ? 'primary' : 'ghost'}
          onClick={() => setFilter('ALL')}
          size="sm"
        >
          Tous
        </Button>
        {statusOptions.map(status => (
          <Button 
            key={status}
            variant={filter === status ? 'primary' : 'ghost'}
            onClick={() => setFilter(status as any)}
            size="sm"
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-500">
              Aucun lead trouvé
            </div>
          </Card>
        ) : (
          leads.map((lead) => (
            <Card key={lead.id}>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {lead.property?.title || 'Propriété'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatCurrency(lead.property?.price || 0)} • {lead.property?.city?.name || 'N/A'}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <strong>Nom:</strong> {lead.name}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {lead.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Tél:</strong> {lead.phone}
                    </p>
                    {lead.message && (
                      <p className="text-gray-700">
                        <strong>Message:</strong> {lead.message}
                      </p>
                    )}
                    {lead.notes && (
                      <p className="text-gray-700 mt-2">
                        <strong>Notes:</strong> {lead.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Créé</p>
                  <p className="text-gray-900">{formatRelativeTime(lead.createdAt)}</p>
                  
                  <p className="text-sm text-gray-600 mt-3 mb-1">Statut</p>
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 text-sm rounded text-center ${
                    lead.status === 'NEW' 
                      ? 'bg-blue-100 text-blue-800' 
                      : lead.status === 'CONTACTED'
                      ? 'bg-purple-100 text-purple-800'
                      : lead.status === 'QUALIFIED'
                      ? 'bg-green-100 text-green-800'
                      : lead.status === 'CLOSED'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {lead.status}
                  </span>

                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.location.href = `mailto:${lead.email}`}
                  >
                    Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.location.href = `tel:${lead.phone}`}
                  >
                    Appeler
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => handleDelete(lead.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}