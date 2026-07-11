import React from 'react';
import { Business } from '../../types';
import { Star, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CityImage } from '../common/CityImage';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/business/${business.id}`)}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group flex flex-col"
    >
      <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <CityImage 
          src={business.image_url} 
          alt={business.name} 
          fallback="business"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {business.verified && (
            <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow">
              <ShieldCheck className="w-3 h-3" /> Verified OS
            </span>
          )}
          <span className="px-2.5 py-1 bg-zinc-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
            {business.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base group-hover:text-emerald-600 transition-colors truncate">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{business.rating?.toFixed(1) || '5.0'}</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
            {business.description}
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{business.market_zone || business.address || 'Aba Metropolis'}</span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-semibold flex-shrink-0">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
