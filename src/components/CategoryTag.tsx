
import React from 'react';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  rent: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  utilities: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
  transport: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  shopping: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  health: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  salary: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  investment: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

interface CategoryTagProps {
  category: string;
  className?: string;
}

const CategoryTag = ({ category, className }: CategoryTagProps) => {
  const lowerCaseCategory = category.toLowerCase();
  const colorClass = CATEGORY_COLORS[lowerCaseCategory] || CATEGORY_COLORS.other;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all", 
        colorClass,
        className
      )}
    >
      {category}
    </span>
  );
};

export default CategoryTag;
