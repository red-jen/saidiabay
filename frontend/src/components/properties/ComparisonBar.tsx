'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiBarChart2 } from 'react-icons/fi';
import { useComparisonStore } from '@/store/comparisonStore';

export default function ComparisonBar() {
  const [mounted, setMounted] = useState(false);
  const { comparisonIds, clearComparison } = useComparisonStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or before hydration
  if (!mounted || comparisonIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-900 text-white shadow-luxury-xl border-t-4 border-accent-500">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiBarChart2 className="w-6 h-6" />
            <div>
              <p className="font-semibold">
                {comparisonIds.length} {comparisonIds.length === 1 ? 'Property' : 'Properties'} Selected
              </p>
              <p className="text-sm text-primary-200">
                {comparisonIds.length < 2 && 'Add at least one more property to compare'}
                {comparisonIds.length >= 2 && 'Ready to compare'}
                {comparisonIds.length === 4 && ' (Maximum reached)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearComparison}
              className="text-sm text-primary-200 hover:text-white transition-colors"
            >
              Clear All
            </button>
            {comparisonIds.length >= 2 && (
              <Link
                href="/compare"
                className="btn bg-white text-primary-900 hover:bg-primary-50"
              >
                Compare Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
