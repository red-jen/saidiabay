'use client';

import { FiHome, FiTrendingUp, FiDollarSign, FiBook, FiGrid } from 'react-icons/fi';

const categories = [
  { id: 'all', name: 'All Posts', icon: FiGrid },
  { id: 'market-insights', name: 'Market Insights', icon: FiTrendingUp },
  { id: 'buying-guide', name: 'Buying Guide', icon: FiHome },
  { id: 'investment', name: 'Investment', icon: FiDollarSign },
  { id: 'tips', name: 'Tips & Advice', icon: FiBook },
];

interface BlogCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogCategories({
  activeCategory,
  onCategoryChange,
}: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
              transition-all duration-200
              ${
                isActive
                  ? 'bg-primary-900 text-white shadow-md'
                  : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

