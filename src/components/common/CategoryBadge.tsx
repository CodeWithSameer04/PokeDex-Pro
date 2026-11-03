import React from 'react';
import { DamageCategory } from '../../types/pokemon';
import { Swords, Sparkles, ShieldAlert } from 'lucide-react';

interface CategoryBadgeProps {
  category: DamageCategory;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
}) => {
  const cat = category?.toLowerCase();

  const configs: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    physical: {
      label: 'Physical',
      bg: 'bg-red-500/20 text-red-400 border border-red-500/30',
      text: 'text-red-400',
      icon: <Swords className="w-3.5 h-3.5 mr-1 text-red-400" />,
    },
    special: {
      label: 'Special',
      bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      text: 'text-blue-400',
      icon: <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-400" />,
    },
    status: {
      label: 'Status',
      bg: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
      text: 'text-slate-300',
      icon: <ShieldAlert className="w-3.5 h-3.5 mr-1 text-slate-400" />,
    },
  };

  const conf = configs[cat] || configs.status;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md select-none ${conf.bg} ${sizeClasses}`}
    >
      {showIcon && conf.icon}
      {conf.label}
    </span>
  );
};
