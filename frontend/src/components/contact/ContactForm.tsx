'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMessageSquare, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement contact API endpoint
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Message sent successfully! We will get back to you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="label">Full Name</label>
        <div className="relative">
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="input pl-10"
          />
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="label">Email Address</label>
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="input pl-10"
          />
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="label">Phone Number</label>
        <div className="relative">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+212 6 00 00 00 00"
            className="input pl-10"
          />
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="label">Subject</label>
        <select
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select a subject</option>
          <option value="property-inquiry">Property Inquiry</option>
          <option value="rental-request">Rental Request</option>
          <option value="purchase-inquiry">Purchase Inquiry</option>
          <option value="general-question">General Question</option>
          <option value="support">Support</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="label">Message</label>
        <div className="relative">
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            placeholder="Tell us how we can help you..."
            className="input resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          'Sending...'
        ) : (
          <>
            <FiSend className="mr-2" />
            Send Message
          </>
        )}
      </button>

      <p className="text-sm text-secondary-500 text-center">
        We typically respond within 24 hours
      </p>
    </form>
  );
};

export default ContactForm;
