import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-xs md:text-sm text-slate-400 mb-6 py-2 overflow-x-auto select-none">
      <Link
        to="/"
        className="flex items-center hover:text-red-400 transition-colors text-slate-400 focus:outline-none"
      >
        <Home className="w-4 h-4 mr-1" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-slate-200 truncate">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-red-400 transition-colors truncate focus:outline-none"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
