'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiCalendar, FiHeart, FiSettings, FiLogOut, FiMapPin, FiDollarSign, FiShoppingBag, FiHome } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { reservationsApi, leadsApi } from '@/lib/api';
import { Reservation, Lead } from '@/types';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchReservations();
    fetchLeads();
  }, [user, router]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('Fetching reservations for user:', user?.id);
      const data = await reservationsApi.getMyReservations();
      console.log('Reservations API response:', data);
      console.log('Reservations API response (stringified):', JSON.stringify(data, null, 2));
      
      // Handle both array and object response formats
      let reservationsArray = [];
      if (Array.isArray(data)) {
        console.log('Found reservations (array):', data.length);
        reservationsArray = data;
      } else if (data && Array.isArray(data.reservations)) {
        console.log('Found reservations (nested):', data.reservations.length);
        reservationsArray = data.reservations;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('Found reservations (data.data):', data.data.length);
        reservationsArray = data.data;
      } else {
        console.log('No reservations found, data:', data);
        reservationsArray = [];
      }
      
      // Log each reservation to see property data
      reservationsArray.forEach((res: any, index: number) => {
        console.log(`Reservation ${index + 1}:`, {
          id: res.id,
          propertyId: res.propertyId,
          hasProperty: !!res.property,
          property: res.property,
        });
      });
      
      setReservations(reservationsArray);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.status === 401) {
        console.error('User not authenticated - session cookie might be missing. Try logging out and logging back in.');
        toast.error('Session expirée. Veuillez vous reconnecter.');
      }
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const data = await leadsApi.getMyLeads();
      
      let leadsArray = [];
      if (Array.isArray(data)) {
        leadsArray = data;
      } else if (data && Array.isArray(data.leads)) {
        leadsArray = data.leads;
      } else if (data && data.data && Array.isArray(data.data)) {
        leadsArray = data.data;
      } else {
        leadsArray = [];
      }
      
      setLeads(leadsArray);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      if (error.response?.status === 401) {
        // Don't show error for leads if session issue - reservations error will show
      }
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  const getLeadStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'NEW': 'Nouvelle demande',
      'CONTACTED': 'Contacté',
      'QUALIFIED': 'Qualifié',
      'CLOSED': 'Finalisé',
      'LOST': 'Annulé',
    };
    return labels[status] || status;
  };

  const getLeadStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'NEW': 'bg-blue-100 text-blue-700',
      'CONTACTED': 'bg-yellow-100 text-yellow-700',
      'QUALIFIED': 'bg-purple-100 text-purple-700',
      'CLOSED': 'bg-green-100 text-green-700',
      'LOST': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-secondary-100 text-secondary-700';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: FiUser },
    { id: 'reservations', label: 'Mes Locations', icon: FiCalendar },
    { id: 'purchases', label: 'Mes Demandes d\'Achat', icon: FiShoppingBag },
    { id: 'profile', label: 'Paramètres', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Bienvenue, {user.name} !
              </h1>
              <p className="text-primary-100">
                Gérez vos réservations et propriétés sauvegardées
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 text-2xl font-bold mb-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {user.name}
                  </h3>
                  <p className="text-sm text-secondary-600">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                          ${isActive
                            ? 'bg-primary-50 text-primary-900 font-medium'
                            : 'text-secondary-700 hover:bg-secondary-50'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Vue d'ensemble
                  </h2>

                  {/* Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                          <FiCalendar className="w-6 h-6 text-primary-700" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                        {reservations.length}
                      </h3>
                      <p className="text-secondary-600">Réservations Total</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                          <FiShoppingBag className="w-6 h-6 text-accent-700" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-1">{leads.length}</h3>
                      <p className="text-secondary-600">Demandes d'Achat</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-success-100 flex items-center justify-center">
                          <FiDollarSign className="w-6 h-6 text-success-700" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-1">
                        {leads.filter(l => l.status === 'CLOSED').length}
                      </h3>
                      <p className="text-secondary-600">Achats Finalisés</p>
                    </div>
                  </div>

                  {/* Recent Locations */}
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                      Dernières Locations
                    </h3>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton h-20" />
                        ))}
                      </div>
                    ) : reservations.length > 0 ? (
                      <div className="space-y-4">
                        {reservations.slice(0, 3).map((reservation) => (
                          <div
                            key={reservation.id}
                            className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-secondary-900 mb-1">
                                {reservation.property?.title || 'Propriété'}
                              </h4>
                              <p className="text-sm text-secondary-600">
                                {new Date(reservation.startDate).toLocaleDateString('fr-FR')} -{' '}
                                {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                              </p>
                              {reservation.property?.city?.name && (
                                <p className="text-xs text-secondary-500 mt-1">
                                  <FiMapPin className="inline w-3 h-3 mr-1" />
                                  {reservation.property.city.name}
                                </p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reservation.status === 'CONFIRMED' || reservation.status === 'confirmed'
                                ? 'bg-success-100 text-success-700'
                                : reservation.status === 'PENDING' || reservation.status === 'PRE_RESERVED' || reservation.status === 'pending'
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-danger-100 text-danger-700'
                            }`}>
                              {reservation.status === 'PRE_RESERVED' ? 'En attente' : 
                               reservation.status === 'CONFIRMED' ? 'Confirmée' :
                               reservation.status === 'PENDING' ? 'En attente' :
                               reservation.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-secondary-600 py-8">
                        Aucune location pour le moment.
                      </p>
                    )}
                  </div>

                  {/* Recent Buy Requests */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                      Dernières Demandes d'Achat
                    </h3>
                    {loadingLeads ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton h-20" />
                        ))}
                      </div>
                    ) : leads.length > 0 ? (
                      <div className="space-y-4">
                        {leads.slice(0, 3).map((lead) => (
                          <div
                            key={lead.id}
                            className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:border-accent-300 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-secondary-900 mb-1">
                                {lead.property?.title || 'Propriété'}
                              </h4>
                              {lead.property?.price && (
                                <p className="text-sm text-accent-600 font-medium">
                                  {lead.property.price.toLocaleString()} DH
                                </p>
                              )}
                              {lead.property?.city?.name && (
                                <p className="text-xs text-secondary-500 mt-1">
                                  <FiMapPin className="inline w-3 h-3 mr-1" />
                                  {lead.property.city.name}
                                </p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeadStatusStyle(lead.status)}`}>
                              {getLeadStatusLabel(lead.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-secondary-600 py-8">
                        Aucune demande d'achat pour le moment.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reservations' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Mes Locations
                  </h2>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-32" />
                      ))}
                    </div>
                  ) : reservations.length > 0 ? (
                    <div className="space-y-6">
                      {reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                  {reservation.property?.title || 'Propriété'}
                                </h3>
                                {(reservation.property?.city?.name || 
                                  reservation.property?.location || 
                                  reservation.property?.address) && (
                                  <p className="flex items-center gap-1 text-secondary-600">
                                    <FiMapPin className="w-4 h-4" />
                                    {reservation.property?.city?.name || 
                                     reservation.property?.location || 
                                     reservation.property?.address}
                                  </p>
                                )}
                                {reservation.propertyId && !reservation.property && (
                                  <Link 
                                    href={`/properties/${reservation.propertyId}`}
                                    className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
                                  >
                                    Voir la propriété →
                                  </Link>
                                )}
                              </div>
                              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                reservation.status === 'CONFIRMED' || reservation.status === 'confirmed'
                                  ? 'bg-success-100 text-success-700'
                                  : reservation.status === 'PENDING' || reservation.status === 'PRE_RESERVED' || reservation.status === 'pending'
                                  ? 'bg-warning-100 text-warning-700'
                                  : 'bg-danger-100 text-danger-700'
                              }`}>
                                {reservation.status === 'PRE_RESERVED' ? 'En attente' : 
                                 reservation.status === 'CONFIRMED' ? 'Confirmée' :
                                 reservation.status === 'CANCELLED' ? 'Annulée' :
                                 reservation.status === 'PENDING' ? 'En attente' :
                                 reservation.status || 'En attente'}
                              </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Date d'arrivée</p>
                                <p className="font-semibold text-secondary-900">
                                  {new Date(reservation.startDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Date de départ</p>
                                <p className="font-semibold text-secondary-900">
                                  {new Date(reservation.endDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Prix total</p>
                                <p className="font-semibold text-primary-900">
                                  {reservation.totalPrice ? `${reservation.totalPrice.toLocaleString()} DH` : 'N/A'}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-secondary-200 flex items-center justify-between">
                              <p className="text-sm text-secondary-600">
                                Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                              {reservation.propertyId && (
                                <Link 
                                  href={`/properties/${reservation.propertyId}`}
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  Voir la propriété →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <FiCalendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        Aucune Location
                      </h3>
                      <p className="text-secondary-600 mb-6">
                        Parcourez nos propriétés en location et réservez votre première location !
                      </p>
                      <Link href="/properties?listingType=LOCATION" className="btn-primary">
                        Voir les Propriétés en Location
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'purchases' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Mes Demandes d'Achat
                  </h2>
                  {loadingLeads ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-32" />
                      ))}
                    </div>
                  ) : leads.length > 0 ? (
                    <div className="space-y-6">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                  {lead.property?.title || 'Propriété'}
                                </h3>
                                {(lead.property?.city?.name || lead.property?.location || lead.property?.address) && (
                                  <p className="flex items-center gap-1 text-secondary-600">
                                    <FiMapPin className="w-4 h-4" />
                                    {lead.property?.city?.name || lead.property?.location || lead.property?.address}
                                  </p>
                                )}
                              </div>
                              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getLeadStatusStyle(lead.status)}`}>
                                {getLeadStatusLabel(lead.status)}
                              </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Prix</p>
                                <p className="font-semibold text-primary-900">
                                  {lead.property?.price ? `${lead.property.price.toLocaleString()} DH` : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Type</p>
                                <p className="font-semibold text-secondary-900">
                                  {lead.property?.propertyCategory === 'VILLA' ? 'Villa' : 
                                   lead.property?.propertyCategory === 'APPARTEMENT' ? 'Appartement' : 
                                   'Propriété'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-secondary-600 mb-1">Date de demande</p>
                                <p className="font-semibold text-secondary-900">
                                  {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>

                            {lead.message && (
                              <div className="p-3 bg-secondary-50 rounded-xl mb-4">
                                <p className="text-sm text-secondary-600">
                                  <span className="font-medium">Votre message :</span> {lead.message}
                                </p>
                              </div>
                            )}

                            <div className="pt-4 border-t border-secondary-200 flex items-center justify-between">
                              <p className="text-sm text-secondary-600">
                                Demande envoyée le {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                              {lead.propertyId && (
                                <Link 
                                  href={`/properties/${lead.propertyId}`}
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  Voir la propriété →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <FiShoppingBag className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        Aucune Demande d'Achat
                      </h3>
                      <p className="text-secondary-600 mb-6">
                        Parcourez nos propriétés en vente et soumettez votre première demande d'achat !
                      </p>
                      <Link href="/properties?listingType=VENTE" className="btn-primary">
                        Voir les Propriétés en Vente
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-6">
                    Paramètres du Profil
                  </h2>
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <form className="space-y-6">
                      <div>
                        <label className="label">Nom complet</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Adresse Email</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="input"
                          disabled
                        />
                        <p className="text-xs text-secondary-500 mt-1">
                          Contactez le support pour changer votre adresse email
                        </p>
                      </div>
                      <div>
                        <label className="label">Téléphone</label>
                        <input
                          type="tel"
                          placeholder="+212 XXX XXX XXX"
                          className="input"
                        />
                      </div>
                      <div className="divider" />
                      <div>
                        <h3 className="font-semibold text-secondary-900 mb-4">
                          Changer le Mot de Passe
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="label">Mot de passe actuel</label>
                            <input type="password" className="input" />
                          </div>
                          <div>
                            <label className="label">Nouveau mot de passe</label>
                            <input type="password" className="input" />
                          </div>
                          <div>
                            <label className="label">Confirmer le mot de passe</label>
                            <input type="password" className="input" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button type="submit" className="btn-primary">
                          Enregistrer
                        </button>
                        <button type="button" className="btn-secondary">
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

