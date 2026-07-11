import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items?: { label: string; path?: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If items are not provided, generate from path
  const breadcrumbItems = items || pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    
    return {
      label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
      path: last ? undefined : to,
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6 overflow-x-auto no-scrollbar py-1">
      <Link to="/home" className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors flex-shrink-0">
        <Home className="w-3 h-3" />
        <span>Home</span>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-emerald-600 transition-colors whitespace-nowrap flex-shrink-0">
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900 dark:text-zinc-100 font-black whitespace-nowrap flex-shrink-0">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
