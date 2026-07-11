import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Store, ShoppingBag, MapPin, Star, ArrowRight } from 'lucide-react';
import { useBusinessesQuery, useProductsQuery } from '../services/supabaseService';
import { CityImage } from '../components/common/CityImage';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: businesses = [], isLoading: bizLoading } = useBusinessesQuery();
  const { data: products = [], isLoading: prodLoading } = useProductsQuery();
  const [query, setQuery] = useState('');

  const matchedBusinesses = query.trim() ? businesses.filter(b => 
    (b.name || '').toLowerCase().includes(query.toLowerCase()) || 
    (b.description || '').toLowerCase().includes(query.toLowerCase()) ||
    (b.market_zone || '').toLowerCase().includes(query.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(query.toLowerCase())
  ) : [];

  const matchedProducts = query.trim() ? products.filter(p =>
    (p.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(query.toLowerCase())
  ) : [];

  const isLoading = bizLoading || prodLoading;

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Global City Search</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Instantly search across all Aba markets, enterprises, and products.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-4 w-5 h-5 text-emerald-600" />
        <input
          type="text"
          value={query || ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search (e.g. leather shoes, Ariaria, Ekeoha, laptop)..."
          autoFocus
          className="w-full bg-white dark:bg-zinc-900 border-2 border-emerald-500/50 rounded-2xl px-4 py-4 pl-12 text-base text-zinc-900 dark:text-white focus:outline-none shadow-lg"
        />
      </div>

      {!query.trim() && (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <Search className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-1">Start typing to search Aba OS</h3>
          <p className="text-xs text-zinc-500">Find shoe manufacturers, senator wear, electronics, and more.</p>
        </div>
      )}

      {query.trim() && (
        <div className="space-y-8">
          {/* Businesses Results */}
          {matchedBusinesses.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Businesses & Markets ({matchedBusinesses.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedBusinesses.map(biz => (
                  <div
                    key={biz.id}
                    onClick={() => navigate(`/business/${biz.id}`)}
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-emerald-500 transition-all group"
                  >
                    <CityImage src={biz.image_url} alt={biz.name} fallback="business" className="w-16 h-16 rounded-xl flex-shrink-0" containerClassName="w-16 h-16 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">{biz.market_zone || 'Aba'}</span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{biz.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm truncate group-hover:text-emerald-600">{biz.name}</h3>
                      <p className="text-xs text-zinc-500 truncate">{biz.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {matchedProducts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Products & Catalog ({matchedProducts.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => navigate('/marketplace')}
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <CityImage src={prod.image_url} alt={prod.name} fallback="product" className="w-16 h-16 rounded-xl flex-shrink-0" containerClassName="w-16 h-16 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">{prod.category}</span>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm truncate">{prod.name}</h3>
                      <p className="font-black text-emerald-600 dark:text-emerald-400 text-xs">₦{prod.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedBusinesses.length === 0 && matchedProducts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 text-sm">No results found for "{query}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
