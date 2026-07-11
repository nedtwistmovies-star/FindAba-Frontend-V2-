import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Home, 
  Mic, 
  Star, 
  ArrowRight,
  LayoutGrid,
  List,
  Coffee,
  Navigation,
  Loader2
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';
import { HotelCard } from '../components/hospitality/HotelCard';
import { useBusinessesQuery, useProductsQuery } from '../services/supabaseService';
import { CityImage } from '../components/common/CityImage';

export const HospitalityPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotels: mockHotels, rooms: mockRooms, setHotels, setRooms } = useHospitalityStore();
  
  const { data: supabaseHotels, isLoading: isLoadingHotels } = useBusinessesQuery();
  const { data: supabaseRooms, isLoading: isLoadingRooms } = useProductsQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Hotel' | 'Apartment' | 'Guest House' | 'Resort'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync Supabase data to store
  useEffect(() => {
    if (supabaseHotels && supabaseHotels.length > 0) {
      const hospitalityBiz = supabaseHotels.filter(b => b.category === 'hospitality');
      if (hospitalityBiz.length > 0) {
        setHotels(hospitalityBiz);
      }
    }
  }, [supabaseHotels, setHotels]);

  useEffect(() => {
    if (supabaseRooms && supabaseRooms.length > 0) {
      const hotelRooms = supabaseRooms.filter(r => r.category === 'Room');
      if (hotelRooms.length > 0) {
        setRooms(hotelRooms);
      }
    }
  }, [supabaseRooms, setRooms]);

  const categories = [
    { id: 'All', icon: LayoutGrid },
    { id: 'Hotel', icon: Building2 },
    { id: 'Apartment', icon: Home },
    { id: 'Guest House', icon: Coffee },
    { id: 'Resort', icon: Navigation },
  ];

  const hotels = (supabaseHotels && supabaseHotels.filter(b => b.category === 'hospitality').length > 0) 
    ? supabaseHotels.filter(b => b.category === 'hospitality')
    : mockHotels;

  const filteredHotels = hotels.filter(h => 
    (activeCategory === 'All' || h.sub_category === activeCategory) &&
    (h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     h.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoadingHotels || isLoadingRooms) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#0B7A3B] animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading verified stays in Aba...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[3rem] overflow-hidden flex items-center justify-center text-center px-6">
        <CityImage 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Stays"
          fallback="hero"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B7A3B] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40"
          >
            <Star className="w-3 h-3 fill-current" /> Official Hospitality Portal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight"
          >
            Find Your <span className="text-[#D4AF37]">Perfect Stay</span> in Aba
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            From luxury hotels to cozy short-let apartments, discover verified accommodations tailored to your budget and style.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input 
                type="text"
                placeholder="Search by hotel name or location..."
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder:text-white/40 outline-none text-sm font-medium"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-4 bg-[#D4AF37] text-white rounded-full hover:bg-[#B8962D] transition-all shadow-lg shadow-amber-900/20">
              <Mic className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories & Filters */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-900/20' 
                    : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.id}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 pr-2">
          <div className="flex bg-slate-50 dark:bg-zinc-800 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-900 text-[#0B7A3B] shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-900 text-[#0B7A3B] shadow-sm' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recommended for You</h2>
            <p className="text-sm text-slate-400 font-medium">Top-rated verified properties in Aba</p>
          </div>
          <button className="text-sm font-bold text-[#0B7A3B] hover:underline flex items-center gap-1 group">
            View All Aba Stays <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {filteredHotels.length > 0 ? (
            <motion.div 
              key={activeCategory + viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              {filteredHotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onClick={() => navigate(`/hospitality/${hotel.id}`)} 
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No properties found</h3>
              <p className="text-slate-400 text-sm mt-2">Try adjusting your search or category filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trending Locations */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B7A3B]/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black">Browse by District</h2>
              <p className="text-slate-400 text-base">Popular residential and business hubs for travelers</p>
            </div>
            <button className="px-8 py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/40">
              View Map View
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'GRA Aba', count: 18, image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=400' },
              { name: 'Owerri Road', count: 12, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=400' },
              { name: 'Central CBD', count: 24, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' },
              { name: 'Ogbor Hill', count: 9, image: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&q=80&w=400' },
            ].map((loc, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="relative h-48 rounded-[2rem] overflow-hidden group cursor-pointer"
              >
                <CityImage src={loc.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={loc.name} fallback="business" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xl font-black text-white">{loc.name}</p>
                  <p className="text-xs text-white/60 font-bold uppercase tracking-widest">{loc.count} Properties</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
