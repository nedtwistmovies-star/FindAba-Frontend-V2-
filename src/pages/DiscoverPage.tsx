import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, Filter, Store, Loader2, AlertCircle } from 'lucide-react';
import { useBusinessesQuery } from '../services/supabaseService';
import { CityImage } from '../components/common/CityImage';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: businesses = [], isLoading, error } = useBusinessesQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Zones & Categories' },
    { id: 'leather', label: 'Leather & Shoes' },
    { id: 'fashion', label: 'Fashion & Tailoring' },
    { id: 'electronics', label: 'Electronics & Tech' },
    { id: 'manufacturing', label: 'Metal & Fabrication' },
    { id: 'food', label: 'Food & Delicacies' },
  ];

  const filteredBusinesses = businesses.filter((biz) => {
    const matchesCategory = selectedCategory === 'all' || biz.category === selectedCategory;
    const matchesSearch = (biz.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (biz.market_zone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (biz.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Discover Aba Markets</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Browse verified manufacturers, artisans, and merchant hubs across Ariaria, Ekeoha, and Cemetery market.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business name, market zone, or product..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 pl-11 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#0B7A3B] text-white shadow-md shadow-[#0B7A3B]/20'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Unable to connect to Supabase database. Please check your configuration.</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B]" />
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <Store className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No businesses found yet.</h3>
          <p className="text-xs text-zinc-500 mt-1">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              onClick={() => navigate(`/business/${biz.id}`)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0B7A3B]/50 cursor-pointer transition-all group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-zinc-100">
                <CityImage src={biz.image_url} alt={biz.name} fallback="business" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur text-white text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  <span>{biz.market_zone || 'Aba Metropolis'}</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B7A3B] bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                      {biz.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{biz.rating} ({biz.reviews_count})</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1 group-hover:text-[#0B7A3B] transition-colors">{biz.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">{biz.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-[#0B7A3B] flex-shrink-0" />
                  <span className="truncate">{biz.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
