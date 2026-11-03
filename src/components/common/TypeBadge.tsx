import React from 'react';
import { Link } from 'react-router-dom';
import { PokemonType } from '../../types/pokemon';
import { TYPE_COLORS } from '../../data/typesData';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  asLink?: boolean;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  asLink = true,
  className = '',
}) => {
  const normalized = (type?.toLowerCase() || 'normal') as PokemonType;
  const config = TYPE_COLORS[normalized] || TYPE_COLORS.normal;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider',
    sm: 'text-xs px-2.5 py-1 font-semibold uppercase tracking-wider',
    md: 'text-sm px-3.5 py-1 font-semibold uppercase tracking-wider',
    lg: 'text-base px-5 py-1.5 font-bold uppercase tracking-wider shadow-md',
  };

  const badgeContent = (
    <span
      style={{ backgroundColor: config.bg, color: config.text }}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 hover:brightness-110 select-none shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {normalized}
    </span>
  );

  if (asLink) {
    return (
      <Link
        to={`/types/${normalized}`}
        className="inline-block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full"
        onClick={e => e.stopPropagation()}
      >
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
};
