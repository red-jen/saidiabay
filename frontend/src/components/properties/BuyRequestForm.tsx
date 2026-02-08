'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck, FiX, FiHome, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { leadsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

interface BuyRequestFormProps {
  propertyId: string;
  propertyTitle?: string;
  propertyPrice?: number;
  propertyLocation?: string;
}

// Success Modal
const SuccessModal = ({ 
  isOpen, 
  onClose, 
  details 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  details: {
    propertyTitle?: string;
    propertyPrice?: number;
    propertyLocation?: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
  } | null;
}) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300" style={{ zIndex: 10000 }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 rounded-full hover:bg-secondary-100 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-gold">
            <FiCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif font-medium text-primary-900 text-center mb-2">
          Demande Envoyée !
        </h3>
        <p className="text-secondary-600 text-center mb-8">
          Votre demande d'achat a été soumise avec succès. Notre équipe vous contactera très bientôt.
        </p>

        {/* Details */}
        <div className="space-y-4 mb-8">
          {details.propertyTitle && (
            <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-xl border border-accent-100">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiHome className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-xs text-accent-500 font-medium uppercase tracking-wider">Propriété</p>
                <p className="font-semibold text-primary-900">{details.propertyTitle}</p>
              </div>
            </div>
          )}

          {details.propertyPrice && (
            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiDollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-primary-500 font-medium uppercase tracking-wider">Prix</p>
                <p className="font-semibold text-primary-900">{details.propertyPrice.toLocaleString()} DH</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl border border-secondary-100">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiUser className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-xs text-secondary-500 font-medium uppercase tracking-wider">Demandeur</p>
              <p className="font-semibold text-primary-900">{details.name}</p>
              <p className="text-sm text-secondary-600">{details.email}</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all shadow-gold hover:shadow-gold-lg"
        >
          Compris !
        </button>
      </div>
    </div>
  );
};

const BuyRequestForm = ({ propertyId, propertyTitle, propertyPrice, propertyLocation }: BuyRequestFormProps) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    message: '',
  });

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        guestName: user.name || '',
        guestEmail: user.email || '',
        guestPhone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName || !formData.guestEmail) {
      toast.error('Veuillez remplir votre nom et email.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        propertyId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone || undefined,
        message: formData.message || undefined,
      };

      console.log('Submitting buy request:', payload);
      await leadsApi.create(payload);

      setSuccessDetails({
        propertyTitle,
        propertyPrice,
        propertyLocation,
        name: formData.guestName,
        email: formData.guestEmail,
        phone: formData.guestPhone,
        message: formData.message,
      });
      setShowSuccess(true);

      // Reset message only
      setFormData((prev) => ({ ...prev, message: '' }));
    } catch (error: any) {
      console.error('Error submitting buy request:', error);
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors de l'envoi de votre demande.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-accent-500" />
          <span className="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase">
            Demande d'achat
          </span>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-1.5">
            Nom complet *
          </label>
          <div className="relative">
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              placeholder="Votre nom"
              required
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm"
            />
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-1.5">
            Email *
          </label>
          <div className="relative">
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm"
            />
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-1.5">
            Téléphone
          </label>
          <div className="relative">
            <input
              type="tel"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm"
            />
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-primary-800 mb-1.5">
            Message (optionnel)
          </label>
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Je suis intéressé par cette propriété..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm resize-none"
            />
            <FiMessageSquare className="absolute left-3 top-4 text-secondary-400 w-4 h-4" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all shadow-gold hover:shadow-gold-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Envoi en cours...
            </span>
          ) : (
            "Demander l'Achat"
          )}
        </button>

        <p className="text-xs text-center text-secondary-500 mt-2">
          Notre équipe vous répondra dans les 24h
        </p>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        details={successDetails}
      />
    </>
  );
};

export default BuyRequestForm;

