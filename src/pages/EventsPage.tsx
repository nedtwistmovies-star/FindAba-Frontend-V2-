import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Search, 
  Filter, 
  Plus, 
  Music, 
  Users, 
  Sparkles, 
  Trophy, 
  Briefcase,
  ChevronRight,
  Clock,
  Ticket
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';
import { EventCard } from '../components/hospitality/EventCard';
import { CityImage } from '../components/common/CityImage';

export const EventsPage: React.FC = () => {
  const { events, fetchHospitalityData } = useHospitalityStore();

  useEffect(() => {
    fetchHospitalityData();
  }, []);

  const [activeCategory, setActiveCategory] = useState<'All' | 'concert' | 'conference' | 'party' | 'festival'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', icon: Calendar },
    { id: 'concert', icon: Music, label: 'Concerts & Shows' },
    { id: 'conference', icon: Briefcase, label: 'Business & Tech' },
    { id: 'party', icon: Sparkles, label: 'Parties & Social' },
    { id: 'festival', icon: Trophy, label: 'Festivals & Arts' },
  ];

  const filteredEvents = events.filter(e => 
    (activeCategory === 'All' || e.category === activeCategory) &&
    (e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      {/* Featured Header */}
      <section className="bg-zinc-950 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full">
          <CityImage 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover opacity-30"
            alt="Events Backdrop"
            fallback="hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B7A3B] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40"
            >
              <Ticket className="w-3 h-3" /> FindAba Events Portal
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Don't Miss Out on the <br /><span className="text-[#D4AF37]">City's Vibe</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              From tech conferences at the innovation hubs to high-energy concerts, stay connected with the events that shape Aba.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto px-10 py-5 bg-[#D4AF37] text-white font-black rounded-3xl shadow-xl shadow-amber-900/20 active:scale-95 transition-all">
                Explore All Events
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-3xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> List Your Event
              </button>
            </div>
          </div>

          <div className="hidden lg:block space-y-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[3rem] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl">Top Trending</h3>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">This Weekend</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Aba Tech Summit 2026', time: 'Sat, 09:00 AM', venue: 'Innovation Hub' },
                  { name: 'Owerri Road Block Party', time: 'Sat, 06:00 PM', venue: 'Owerri Road' },
                  { name: 'Sunday Night Jazz', time: 'Sun, 08:00 PM', venue: 'Binez Suites' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-[#D4AF37] transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1 opacity-60">
                        <span className="text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        <span className="text-[10px] flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.venue}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Hub */}
      <section className="bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                  ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label || cat.id}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pr-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search events..."
              className="pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-transparent focus:border-[#0B7A3B] rounded-2xl text-xs font-bold outline-none min-w-[240px] transition-all"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Events Grid */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Upcoming Events</h2>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
            Sorted by <span className="text-[#0B7A3B]">Date (Soonest First)</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div 
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => {}} 
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">No events found</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto font-medium">We couldn't find any events matching your criteria. Try broading your search or selecting a different category.</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Organizer Call to Action */}
      <section className="bg-[#D4AF37] rounded-[3rem] p-12 text-zinc-950 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <h2 className="text-4xl font-black">Organizing an Event in Aba?</h2>
          <p className="text-zinc-900/70 text-lg font-medium leading-relaxed">
            Get your event discovered by thousands of Aba residents and visitors. From ticketing to marketing, we help you reach your audience.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button className="px-10 py-5 bg-zinc-950 text-white font-black rounded-[2rem] shadow-2xl active:scale-95 transition-all">
            List Your Event
          </button>
          <button className="px-10 py-5 bg-white text-zinc-950 font-black rounded-[2rem] shadow-xl active:scale-95 transition-all">
            Talk to an Expert
          </button>
        </div>
      </section>
    </div>
  );
  }
