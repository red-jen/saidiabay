'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays, format, isWithinInterval, eachDayOfInterval } from 'date-fns';
import { reservationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

interface ReservationFormProps {
  propertyId: string;
  propertyPrice?: number;
}

interface BlockedDate {
  startDate: string;
  endDate: string;
  status?: string;
}

const ReservationForm = ({ propertyId, propertyPrice = 0 }: ReservationFormProps) => {
  const { user } = useAuthStore();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const [error, setError] = useState('');
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData({
        guestName: user.name || '',
        guestEmail: user.email || '',
        guestPhone: user.phone || '',
        message: '',
      });
    }
  }, [user]);

  // Fetch blocked dates for this property
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        setLoadingDates(true);
        const reservations = await reservationsApi.getByProperty(propertyId);
        
        // Filter only confirmed and pending reservations
        const activeReservations = (Array.isArray(reservations) ? reservations : []).filter(
          (res: any) => res.status === 'CONFIRMED' || res.status === 'PRE_RESERVED' || res.status === 'PENDING'
        );
        
        setBlockedDates(
          activeReservations.map((res: any) => ({
            startDate: res.startDate,
            endDate: res.endDate,
            status: res.status,
          }))
        );
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
        // Don't show error to user, just log it
      } finally {
        setLoadingDates(false);
      }
    };

    if (propertyId) {
      fetchBlockedDates();
    }
  }, [propertyId]);

  // Calculate nights and total price
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const totalPrice = nights > 0 ? nights * propertyPrice : 0;

  // Check if selected dates overlap with blocked dates
  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blocked) => {
      const blockedStart = new Date(blocked.startDate);
      const blockedEnd = new Date(blocked.endDate);
      blockedStart.setHours(0, 0, 0, 0);
      blockedEnd.setHours(23, 59, 59, 999);
      return isWithinInterval(date, { start: blockedStart, end: blockedEnd });
    });
  };

  // Check if selected date range overlaps with any blocked dates
  const checkDateRangeConflict = (start: Date, end: Date) => {
    const selectedDays = eachDayOfInterval({ start, end });
    return selectedDays.some((day) => isDateBlocked(day));
  };

  // Get blocked date ranges for display
  const getBlockedDateRanges = () => {
    return blockedDates.map((blocked) => ({
      start: new Date(blocked.startDate),
      end: new Date(blocked.endDate),
      status: blocked.status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner les dates de location');
      return;
    }

    if (endDate <= startDate) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    // Check if selected dates are blocked
    if (checkDateRangeConflict(startDate, endDate)) {
      setError('Les dates sélectionnées sont déjà réservées. Veuillez choisir d\'autres dates.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format data to match API expectations
      // The API will automatically use the userId from the auth token if user is logged in
      console.log('Creating reservation for user:', user?.id);
      const response = await reservationsApi.create({
        propertyId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        message: formData.message || undefined,
      });
      console.log('Reservation created:', response);

      // Store reservation data for success modal
      setReservationData({
        ...response,
        nights,
        totalPrice,
      });
      setShowSuccessModal(true);
      
      // Reset form
      setStartDate(null);
      setEndDate(null);
      if (!user) {
        setFormData({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          message: '',
        });
      } else {
        setFormData({
          ...formData,
          message: '',
        });
      }

      toast.success('Réservation effectuée avec succès!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Échec de la soumission de la réservation';
      setError(errorMessage);
      toast.error(errorMessage);
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

  // Success Modal
  const SuccessModal = () => {
    if (!showSuccessModal || !reservationData) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-elegant-lg max-w-md w-full p-8 relative animate-in fade-in slide-in-from-bottom-4">
          {/* Close button */}
          <button
            onClick={() => setShowSuccessModal(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-secondary-600" />
          </button>

          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>

          {/* Success message */}
          <h3 className="text-2xl font-semibold text-secondary-900 text-center mb-2">
            Réservation réussie !
          </h3>
          <p className="text-secondary-600 text-center mb-6">
            Votre demande de location a été envoyée avec succès.
          </p>

          {/* Reservation details */}
          <div className="bg-secondary-50 rounded-xl p-6 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">Période:</span>
              <span className="font-semibold text-secondary-900">
                {reservationData.nights} {reservationData.nights === 1 ? 'nuit' : 'nuits'}
              </span>
            </div>
            {reservationData.startDate && reservationData.endDate && (
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Dates:</span>
                <span className="font-medium text-secondary-900 text-sm">
                  {new Date(reservationData.startDate).toLocaleDateString('fr-FR')} - {new Date(reservationData.endDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
            {reservationData.totalPrice > 0 && (
              <div className="flex justify-between items-center pt-3 border-t border-secondary-200">
                <span className="text-secondary-600 font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary-900">
                  {reservationData.totalPrice.toLocaleString()} DH
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-secondary-500 text-center mb-6">
            Nous vous contacterons dans les 24 heures pour confirmer votre réservation.
          </p>

          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full py-3 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Réserver cette propriété
        </h3>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Date Range Picker */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <FiCalendar className="inline mr-2" />
            Sélectionner la période
          </label>
          
          {/* Show blocked dates info */}
          {blockedDates.length > 0 && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-2 mb-2">
                <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">
                    Périodes déjà réservées :
                  </p>
                  <div className="space-y-1">
                    {getBlockedDateRanges().map((blocked, index) => (
                      <p key={index} className="text-xs text-yellow-700">
                        • {format(blocked.start, 'dd/MM/yyyy')} - {format(blocked.end, 'dd/MM/yyyy')}
                        {blocked.status === 'PRE_RESERVED' && ' (En attente)'}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  if (date && endDate && date >= endDate) {
                    setEndDate(null);
                  }
                  setError(''); // Clear error when date changes
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Date d'arrivée"
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                wrapperClassName="w-full"
                excludeDates={blockedDates.flatMap((blocked) => {
                  const start = new Date(blocked.startDate);
                  const end = new Date(blocked.endDate);
                  return eachDayOfInterval({ start, end });
                })}
                filterDate={(date) => !isDateBlocked(date)}
              />
            </div>
            <div>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  setEndDate(date);
                  setError(''); // Clear error when date changes
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Date de départ"
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                wrapperClassName="w-full"
                disabled={!startDate}
                excludeDates={blockedDates.flatMap((blocked) => {
                  const start = new Date(blocked.startDate);
                  const end = new Date(blocked.endDate);
                  return eachDayOfInterval({ start, end });
                })}
                filterDate={(date) => !isDateBlocked(date)}
              />
            </div>
          </div>
          {startDate && endDate && (
            <div className="mt-3 p-3 bg-primary-50 rounded-xl border border-primary-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-700">
                  <strong>{nights}</strong> {nights === 1 ? 'nuit' : 'nuits'}
                </span>
                {totalPrice > 0 && (
                  <span className="font-semibold text-primary-900">
                    {totalPrice.toLocaleString()} DH
                  </span>
                )}
              </div>
            </div>
          )}
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
          disabled={loading || !startDate || !endDate}
          className="w-full py-4 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi en cours...' : 'Réserver maintenant'}
        </button>

        <p className="text-xs text-secondary-500 text-center">
          Votre demande sera examinée et nous vous contacterons dans les 24 heures
        </p>
      </form>

      {/* Success Modal */}
      <SuccessModal />
    </>
  );
};

export default ReservationForm;

