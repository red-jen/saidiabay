'use client';

import Link from 'next/link';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-16">
      <div className="container mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          {/* 404 Number */}
          <h1 className="text-9xl md:text-[200px] font-heading font-bold text-primary-900 opacity-10 leading-none mb-8">
            404
          </h1>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-luxury p-12 -mt-32 relative z-10">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-secondary-600 mb-8 max-w-lg mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="btn-primary flex items-center gap-2">
                <FiHome className="w-5 h-5" />
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary flex items-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-secondary-200">
              <p className="text-secondary-600 mb-4">
                Maybe you're looking for one of these?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/properties"
                  className="text-primary-700 hover:text-primary-900 font-medium transition-colors"
                >
                  Browse Properties
                </Link>
                <span className="text-secondary-300">•</span>
                <Link
                  href="/blog"
                  className="text-primary-700 hover:text-primary-900 font-medium transition-colors"
                >
                  Read Blog
                </Link>
                <span className="text-secondary-300">•</span>
                <Link
                  href="/contact"
                  className="text-primary-700 hover:text-primary-900 font-medium transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

