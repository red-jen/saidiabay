'use client';

import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useFavoritesStore } from '@/store/favoritesStore';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export default function FavoriteButton({ propertyId, className = '' }: FavoriteButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const favorited = mounted ? isFavorite(propertyId) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorited) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative p-2 rounded-full transition-all
        ${favorited
          ? 'bg-danger-500 text-white hover:bg-danger-600'
          : 'bg-white/90 text-secondary-700 hover:bg-white hover:text-danger-500'
        }
        ${className}
      `}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FiHeart
        className={`w-5 h-5 transition-all ${
          favorited ? 'fill-current scale-110' : 'group-hover:scale-110'
        }`}
      />
    </button>
  );
}
