import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  Check, 
  ShoppingCart,
  Loader2,
  AlertCircle,
  Package,
  Store
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useProductsQuery } from '../services/supabaseService';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CartDrawer } from '../components/marketplace/CartDrawer';
import { useNavigate } from 'react-router-dom';

import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const MarketplacePage: React.FC = () => {
  const { data: products = [], isLoading, error } = useProductsQuery();
  const { cart } = useOrderStore();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Footwear', 'Bags', 'Clothing', 'Power & Tech'];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 relative">
      <Breadcrumbs />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold inline-block mb-2">
            FindAba OS V2 Marketplace & Escrow
          </span>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Made-in-Aba E-Commerce Platform</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Buy high-grade shoes, leather bags, and senator wear with secure escrow protection.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Package className="w-4 h-4 text-[#0B7A3B]" /> My Orders
          </button>
          <button
            onClick={() => navigate('/seller/orders')}
            className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Store className="w-4 h-4 text-amber-500" /> Seller Portal
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-5 py-2.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0B7A3B] text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products by name or material..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Unable to connect to Supabase database. Showing cached/offline product catalog.</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B]" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No products found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try searching with a different keyword or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
