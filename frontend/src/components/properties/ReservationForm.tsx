'use client';

import { useState } from 'react';
import { FiCalendar, FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { reservationsApi } from '@/lib/api';

interface ReservationFormProps {
  propertyId: string;
}

const ReservationForm = ({ propertyId }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Format data to match API expectations
      await reservationsApi.create({
        propertyId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        message: formData.message || undefined,
      });

      setSuccess(true);
      
      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        message: '',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Échec de la soumission de la réservation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          Demande envoyée !
        </h3>
        <p className="text-sm text-secondary-600">
          Nous vous contacterons dans les 24 heures.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-primary-600 font-medium hover:text-primary-700"
        >
          Faire une autre réservation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">
        Pré-réserver cette propriété
      </h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Date début</label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Date fin</label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </div>

      {/* Guest Info */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Nom complet</label>
        <div className="relative">
          <input
            type="text"
            name="guestName"
            required
            minLength={2}
            value={formData.guestName}
            onChange={handleChange}
            placeholder="Votre nom complet"
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          />
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
        <div className="relative">
          <input
            type="email"
            name="guestEmail"
            required
            value={formData.guestEmail}
            onChange={handleChange}
            placeholder="votre@email.com"
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          />
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Téléphone</label>
        <div className="relative">
          <input
            type="tel"
            name="guestPhone"
            required
            minLength={10}
            value={formData.guestPhone}
            onChange={handleChange}
            placeholder="+212 6 00 00 00 00"
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          />
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Message (optionnel)</label>
        <div className="relative">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Des questions ou demandes spéciales ?"
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl text-sm resize-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          />
          <FiMessageSquare className="absolute left-3 top-3 text-secondary-400" size={16} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
      </button>

      <p className="text-xs text-secondary-500 text-center">
        Votre demande sera examinée et nous vous contacterons dans les 24 heures
      </p>
    </form>
  );
};

export default ReservationForm;

