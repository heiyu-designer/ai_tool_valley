'use client';

import { CATEGORIES, CategoryValue } from '@/types';
import { Sparkles, Code, PenTool, MessageCircle } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  productivity: <Sparkles className="w-4 h-4" />,
  coding: <Code className="w-4 h-4" />,
  content: <PenTool className="w-4 h-4" />,
  chat: <MessageCircle className="w-4 h-4" />,
};

interface CategoryFilterProps {
  selected: CategoryValue | null;
  onSelect: (category: CategoryValue | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect(null)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          selected === null
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
        }`}
      >
        全部
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value as CategoryValue)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selected === category.value
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          {categoryIcons[category.value]}
          {category.label}
        </button>
      ))}
    </div>
  );
}
