import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  ArrowRight,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';
import { BookingCard } from '../components/hospitality/BookingCard';

export const ManageBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useHospitalityStore();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 'past') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Bookings</h1>
          </div>
          <p className="text-slate-400 font-medium pl-14">Manage your hotel stays, event tickets, and travel plans.</p>
        </div>
        <button 
          onClick={() => navigate('/hospitality')}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-zinc-900 p-2 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        {[
          { id: 'upcoming', label: 'Upcoming', icon: Calendar },
          { id: 'past', label: 'Past Stays', icon: History },
          { id: 'cancelled', label: 'Cancelled', icon: XCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-lg' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredBookings.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {filteredBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancel={() => updateBookingStatus(booking.id, 'cancelled')} 
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[3rem] shadow-sm"
            >
              <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No {activeTab} bookings</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium">When you book a stay or an event, it will appear here.</p>
              <button 
                onClick={() => navigate('/hospitality')}
                className="mt-8 text-sm font-bold text-[#0B7A3B] flex items-center gap-2 mx-auto hover:underline"
              >
                Start exploring Aba <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recommended for Next Trip */}
      {activeTab !== 'upcoming' && (
        <section className="pt-12 space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recommended for Your Next Trip</h2>
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-lg">
              <h3 className="text-3xl font-black">Plan Your Next Escape</h3>
              <p className="text-slate-400 font-medium">Discover new hotels and events happening in Aba. Get exclusive discounts when you book 7 days in advance.</p>
              <button 
                onClick={() => navigate('/hospitality')}
                className="px-10 py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/40 active:scale-95 transition-all"
              >
                Browse Hotels
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Hotel" />
              </div>
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 mt-6">
                <img src="https://images.unsplash.com/photo-1571011234237-4523a059ac6b?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Hotel" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
