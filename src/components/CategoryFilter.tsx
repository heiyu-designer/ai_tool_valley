'use client';

import { CATEGORIES, CategoryValue } from '@/types';
import { Grid3X3, MessageCircle, Wand2, Code2, Palette, GraduationCap, TrendingUp } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  chat: <MessageCircle className="w-4 h-4" />,
  creation: <Wand2 className="w-4 h-4" />,
  coding: <Code2 className="w-4 h-4" />,
  design: <Palette className="w-4 h-4" />,
  learning: <GraduationCap className="w-4 h-4" />,
  marketing: <TrendingUp className="w-4 h-4" />,
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
        <Grid3X3 className="w-4 h-4" />
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
          style={selected === category.value ? {
            background: `linear-gradient(to right, ${category.color}, ${category.color}dd)`
          } : {}}
        >
          {categoryIcons[category.value]}
          {category.label}
        </button>
      ))}
    </div>
  );
}
