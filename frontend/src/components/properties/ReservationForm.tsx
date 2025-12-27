'use client';

import { useState } from 'react';
import { FiCalendar, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { reservationsApi } from '@/lib/api';
import { toast } from 'react-toastify';

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
    numberOfGuests: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reservationsApi.create({
        propertyId,
        ...formData,
      });

      toast.success('Reservation request submitted successfully! We will contact you shortly.');
      
      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        numberOfGuests: 1,
        notes: '',
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit reservation';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">
        Pre-Reserve This Property
      </h3>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-sm">Start Date</label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input text-sm"
            />
          </div>
        </div>
        <div>
          <label className="label text-sm">End Date</label>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="input text-sm"
            />
          </div>
        </div>
      </div>

      {/* Guest Info */}
      <div>
        <label className="label text-sm">Full Name</label>
        <div className="relative">
          <input
            type="text"
            name="guestName"
            required
            value={formData.guestName}
            onChange={handleChange}
            placeholder="Your full name"
            className="input text-sm pl-10"
          />
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        </div>
      </div>

      <div>
        <label className="label text-sm">Email</label>
        <div className="relative">
          <input
            type="email"
            name="guestEmail"
            required
            value={formData.guestEmail}
            onChange={handleChange}
            placeholder="your@email.com"
            className="input text-sm pl-10"
          />
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        </div>
      </div>

      <div>
        <label className="label text-sm">Phone</label>
        <div className="relative">
          <input
            type="tel"
            name="guestPhone"
            required
            value={formData.guestPhone}
            onChange={handleChange}
            placeholder="+212 6 00 00 00 00"
            className="input text-sm pl-10"
          />
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={16} />
        </div>
      </div>

      <div>
        <label className="label text-sm">Number of Guests</label>
        <input
          type="number"
          name="numberOfGuests"
          min="1"
          required
          value={formData.numberOfGuests}
          onChange={handleChange}
          className="input text-sm"
        />
      </div>

      <div>
        <label className="label text-sm">Additional Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requests or questions?"
          className="input text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Reservation Request'}
      </button>

      <p className="text-xs text-secondary-500 text-center">
        Your request will be reviewed and we'll contact you within 24 hours
      </p>
    </form>
  );
};

export default ReservationForm;

