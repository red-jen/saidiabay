'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  userId: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  [key: string]: any;
}

interface SelectedDates {
  startDate: Date;
  endDate: Date;
  nights: number;
  totalPrice: number;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'rent' | 'sale';
  property: Property;
  selectedDates?: SelectedDates;
  onSuccess?: () => void;
}

type ModalView = 'initial' | 'login' | 'register' | 'guest' | 'success';

export default function ReservationModal({
  isOpen,
  onClose,
  type,
  property,
  selectedDates,
  onSuccess,
}: ReservationModalProps) {
  const [view, setView] = useState<ModalView>('initial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Guest form state
  const [guestData, setGuestData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestCountry: 'Maroc',
    message: '',
  });

  // Reset modal state
  const handleClose = () => {
    setView('initial');
    setError(null);
    setLoginData({ identifier: '', password: '' });
    setRegisterData({ name: '', email: '', phone: '', password: '' });
    setGuestData({ guestName: '', guestEmail: '', guestPhone: '', guestCountry: 'Maroc', message: '' });
    onClose();
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Login API call
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const loginResult = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginResult.error || 'Échec de connexion');
      }

      // Small delay to ensure session cookie is properly set
      await new Promise(resolve => setTimeout(resolve, 100));

      // After successful login, create reservation/lead
      await createBooking(true);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Register API call - send name, email, phone, password
      const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
        }),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerResult.error || 'Échec de création de compte');
      }

      // After successful registration, show login form
      setView('login');
      setError(null);
      setLoading(false);
      // Pre-fill login with registered email
      setLoginData({ identifier: registerData.email, password: '' });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle guest submission
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBooking(false);
  };

  // Create reservation or lead
  const createBooking = async (isLoggedIn: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = type === 'rent' ? '/api/reservations' : '/api/leads';
      const baseData = {
        propertyId: property.id,
      };

      let requestData: any = { ...baseData };

      if (type === 'rent' && selectedDates) {
        requestData = {
          ...requestData,
          startDate: selectedDates.startDate.toISOString(),
          endDate: selectedDates.endDate.toISOString(),
        };
      }

      // Add guest data if not logged in
      if (!isLoggedIn) {
        requestData = {
          ...requestData,
          ...guestData,
        };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue');
      }

      setView('success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate WhatsApp message
  const getWhatsAppLink = () => {
    if (!property.user?.phone) return null;

    const phone = property.user.phone.replace(/[^0-9]/g, '');
    let message = `Bonjour, je suis intéressé(e) par votre propriété "${property.title}" située à ${property.address}.`;

    if (type === 'rent' && selectedDates) {
      message += `\n\nDates souhaitées:\nArrivée: ${format(selectedDates.startDate, 'dd MMMM yyyy', { locale: fr })}\nDépart: ${format(selectedDates.endDate, 'dd MMMM yyyy', { locale: fr })}\nTotal: ${selectedDates.nights} nuit(s) - ${selectedDates.totalPrice.toLocaleString('fr-MA')} DH`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      {view === 'success'
                        ? type === 'rent' ? 'Réservation réussie!' : 'Intérêt enregistré!'
                        : type === 'rent' ? 'Réserver ce bien' : "Manifester mon intérêt"}
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Initial View */}
                  {view === 'initial' && (
                    <div className="space-y-4">
                      {/* Property Summary */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                        {type === 'rent' && selectedDates && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Du {format(selectedDates.startDate, 'dd MMM yyyy', { locale: fr })}</div>
                              <div>Au {format(selectedDates.endDate, 'dd MMM yyyy', { locale: fr })}</div>
                              <div className="font-semibold text-blue-600 mt-2">
                                {selectedDates.nights} nuit(s) • {selectedDates.totalPrice.toLocaleString('fr-MA')} DH
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <button
                          onClick={() => setView('login')}
                          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Se connecter
                        </button>
                        <button
                          onClick={() => setView('guest')}
                          className="w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-300 rounded-lg transition-colors"
                        >
                          Continuer sans compte
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Login View */}
                  {view === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email ou nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          required
                          value={loginData.identifier}
                          onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe
                        </label>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                          {showLoginPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <button
                          type="button"
                          onClick={() => setView('register')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Créer un compte
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
                      >
                        {loading ? 'Connexion...' : 'Se connecter'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setView('initial')}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        ← Retour
                      </button>
                    </form>
                  )}

                  {/* Register View */}
                  {view === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          minLength={2}
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre nom complet"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Sera utilisé pour vous connecter
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          minLength={10}
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+212 6XX XXX XXX"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe *
                        </label>
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          placeholder="Min. 8 caractères"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showRegisterPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                          {showRegisterPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                        <p className="mt-1 text-xs text-gray-500">
                          Doit contenir: majuscule, minuscule et chiffre
                        </p>
                      </div>

                      <div className="text-sm text-center">
                        <span className="text-gray-600">Déjà un compte ? </span>
                        <button
                          type="button"
                          onClick={() => setView('login')}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Se connecter
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
                      >
                        {loading ? 'Création...' : 'Créer mon compte'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setView('initial')}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        ← Retour
                      </button>
                    </form>
                  )}

                  {/* Guest View */}
                  {view === 'guest' && (
                    <form onSubmit={handleGuestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={guestData.guestName}
                          onChange={(e) => setGuestData({ ...guestData, guestName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={guestData.guestEmail}
                          onChange={(e) => setGuestData({ ...guestData, guestEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guestData.guestPhone}
                          onChange={(e) => setGuestData({ ...guestData, guestPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+212 6XX XXX XXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pays
                        </label>
                        <select
                          value={guestData.guestCountry}
                          onChange={(e) => setGuestData({ ...guestData, guestCountry: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Maroc">Maroc</option>
                          <option value="France">France</option>
                          <option value="Espagne">Espagne</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      {type === 'sale' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message (optionnel)
                          </label>
                          <textarea
                            value={guestData.message}
                            onChange={(e) => setGuestData({ ...guestData, message: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Votre message..."
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
                      >
                        {loading ? 'Envoi...' : type === 'rent' ? 'Réserver' : 'Je suis intéressé'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setView('initial')}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        ← Retour
                      </button>
                    </form>
                  )}

                  {/* Success View */}
                  {view === 'success' && (
                    <div className="text-center space-y-6">
                      <div className="flex justify-center">
                        <CheckCircleIcon className="h-20 w-20 text-green-500" />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {type === 'rent' ? 'Réservation réussie!' : 'Intérêt enregistré!'}
                        </h3>
                        <p className="text-gray-600">
                          Le propriétaire vous contactera bientôt pour confirmer les détails.
                        </p>
                      </div>

                      {/* Contact Buttons */}
                      {property.user && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">
                            Ou contactez directement :
                          </p>

                          <div className="space-y-2">
                            {property.user.phone && getWhatsAppLink() && (
                              <a
                                href={getWhatsAppLink()!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                WhatsApp
                              </a>
                            )}

                            {property.user.email && (
                              <a
                                href={`mailto:${property.user.email}`}
                                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                              </a>
                            )}

                            {property.user.phone && (
                              <a
                                href={`tel:${property.user.phone}`}
                                className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Téléphone
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleClose}
                        className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
                      >
                        Fermer
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
