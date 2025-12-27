'use client';

import { useState } from 'react';
import { FiMail } from 'react-icons/fi';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-xl shadow-lg p-8 text-white">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
          <FiMail className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-heading font-semibold mb-2">
          Subscribe to Newsletter
        </h3>
        <p className="text-primary-100">
          Get the latest real estate insights and market updates delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full btn bg-white text-primary-900 hover:bg-primary-50 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' && 'Subscribing...'}
          {status === 'success' && '✓ Subscribed!'}
          {(status === 'idle' || status === 'error') && 'Subscribe'}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-2 text-sm text-red-200">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

