'use client';

import { useState, useEffect } from 'react';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { useComparisonStore } from '@/store/comparisonStore';

interface ComparisonButtonProps {
  propertyId: string;
  className?: string;
}

export default function ComparisonButton({ propertyId, className = '' }: ComparisonButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isInComparison, addToComparison, removeFromComparison } = useComparisonStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const inComparison = mounted ? isInComparison(propertyId) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inComparison) {
      removeFromComparison(propertyId);
    } else {
      addToComparison(propertyId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${inComparison
          ? 'bg-success-500 text-white hover:bg-success-600'
          : 'bg-white/90 text-secondary-700 hover:bg-white hover:text-primary-700'
        }
        ${className}
      `}
      title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      <span className="flex items-center gap-1.5">
        {inComparison ? (
          <>
            <FiCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Added</span>
          </>
        ) : (
          <>
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </>
        )}
      </span>
    </button>
  );
}

