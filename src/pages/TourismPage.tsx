import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Camera, 
  History, 
  Heart, 
  Search, 
  Filter, 
  ArrowRight,
  Sparkles,
  Palmtree,
  ShoppingBag,
  Music,
  Coffee
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';
import { TourismCard } from '../components/hospitality/TourismCard';
import { CityImage } from '../components/common/CityImage';

export const TourismPage: React.FC = () => {
  const { tourismSpots } = useHospitalityStore();
  const [activeTab, setActiveTab] = useState<'All' | 'historic' | 'market' | 'nature' | 'culture'>('All');

  const categories = [
    { id: 'All', icon: Compass },
    { id: 'historic', icon: History, label: 'Historic Sites' },
    { id: 'market', icon: ShoppingBag, label: 'Market Districts' },
    { id: 'nature', icon: Palmtree, label: 'Parks & Nature' },
    { id: 'culture', icon: Music, label: 'Cultural Centres' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 px-4">
      {/* Editorial Header */}
      <section className="relative h-[500px] rounded-[4rem] overflow-hidden">
        <CityImage 
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Discover Aba"
          fallback="hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center px-12">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Uncover the Hidden Gems of Aba</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1]"
            >
              A City of <br /><span className="text-[#D4AF37]">Endless Stories</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/70 max-w-lg leading-relaxed"
            >
              From the industrial marvels of Ariaria to the deep colonial history of GRA, Aba is a vibrant tapestry of culture, commerce, and heritage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <button className="px-10 py-5 bg-[#0B7A3B] text-white font-black rounded-3xl shadow-2xl shadow-emerald-900/40 active:scale-95 transition-all">
                Start Exploring
              </button>
              <button className="flex items-center gap-3 text-white font-bold group">
                Watch City Tour <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-zinc-900 transition-all">▶</div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discovery Hub */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">The Explorer's Guide</h2>
            <p className="text-slate-400 font-medium max-w-xl">Carefully curated destinations that define the essence of Aba's history and future.</p>
          </div>

          <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-x-auto scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${
                    activeTab === cat.id 
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label || cat.id}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tourismSpots.filter(s => activeTab === 'All' || s.category === activeTab).map((spot, i) => (
            <TourismCard key={spot.id} spot={spot} onClick={() => {}} />
          ))}
        </div>
      </section>

      {/* Made-in-Aba Experience */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 text-[#0B7A3B] bg-[#0B7A3B]/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#0B7A3B]/20">
            <ShoppingBag className="w-3.5 h-3.5" /> Industrial Tourism
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
            The Industrial Heartbeat: <br /><span className="text-[#0B7A3B]">Ariaria Market Tour</span>
          </h2>
          <p className="text-slate-500 leading-relaxed text-lg font-medium">
            Experience the "China of Africa" first-hand. Meet the master leather artisans, watch the fashion designers at work, and see how Aba fuels the continent's manufacturing engine.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Artisans', value: '50,000+' },
              { label: 'Daily Visitors', value: '100,000+' },
              { label: 'Export Zones', value: '12 Markets' },
              { label: 'Verified Shops', value: '1,500+' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 text-[#0B7A3B] font-black text-sm group">
            Book a Guided Market Tour <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-64 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CityImage src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Artisan" fallback="business" />
            </div>
            <div className="h-48 bg-[#D4AF37] rounded-[2.5rem] flex items-center justify-center p-8 text-center text-zinc-950">
              <p className="text-lg font-black italic">"In Aba, if you can dream it, we can make it."</p>
            </div>
          </div>
          <div className="space-y-6 pt-12">
            <div className="h-48 bg-slate-100 dark:bg-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center">
              <Camera className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400">12.4k Photos Shared</p>
            </div>
            <div className="h-64 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CityImage src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Fabrication" fallback="business" />
            </div>
          </div>
        </div>
      </section>

      {/* Food & Nightlife */}
      <section className="bg-zinc-950 rounded-[4rem] p-16 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -mr-48 -mb-48" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-4xl font-black">Aba After Dark</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Discover the vibrant nightlife, world-class lounges, and legendary street food spots that come alive when the sun sets.</p>
            <div className="space-y-4">
              {[
                { label: 'Street Food Spots', icon: Coffee },
                { label: 'Verified Lounges', icon: Music },
                { label: 'Fine Dining', icon: Sparkles },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <item.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { name: 'Binez Lounge', cat: 'Luxury Lounge', img: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600' },
                { name: 'Crystal Garden', cat: 'Outdoor Dining', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600' },
                { name: 'Express Point', cat: 'Street Food', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600' },
              ].map((spot, i) => (
                <div key={i} className="w-80 h-96 flex-shrink-0 rounded-[3rem] overflow-hidden relative group">
                  <CityImage src={spot.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={spot.name} fallback="business" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">{spot.cat}</p>
                    <p className="text-2xl font-black text-white">{spot.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
