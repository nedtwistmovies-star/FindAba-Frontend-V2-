import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Star, 
  DollarSign,
  ChevronRight,
  MoreHorizontal,
  Bell,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';

export const PropertyOwnerDashboard: React.FC = () => {
  const { hotels, rooms } = useHospitalityStore();
  const hotel = hotels[0]; // Demo: First hotel as owned property
  const propertyRooms = rooms.filter(r => r.business_id === hotel.id);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'bookings' | 'reviews'>('overview');

  const stats = [
    { label: 'Occupancy Rate', value: '84%', icon: Bed, color: 'text-emerald-500', trend: '+2.4%' },
    { label: 'Total Revenue', value: '₦840.5k', icon: DollarSign, color: 'text-amber-500', trend: '+12.1%' },
    { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-blue-500', trend: 'Stable' },
    { label: 'Total Bookings', value: '124', icon: Users, color: 'text-purple-500', trend: '+8.2%' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">
      {/* Dashboard Header */}
      <div className="bg-zinc-950 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#0B7A3B]/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white/10">
              <img src={hotel.image_url} className="w-full h-full object-cover" alt="Hotel" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black">{hotel.name}</h1>
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Merchant ID: PR-882910 • {hotel.market_zone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/40 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Room
            </button>
            <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 relative z-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-black">{stat.value}</p>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  stat.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="lg:w-64 space-y-2 flex-shrink-0">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'rooms', label: 'Manage Rooms', icon: Bed },
            { id: 'bookings', label: 'Reservations', icon: Calendar },
            { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Property Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-[#0B7A3B] text-white shadow-xl shadow-emerald-900/20' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">{activeTab} Management</h2>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-xs font-bold outline-none w-64"
                />
              </div>
              <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-slate-400">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Room Details</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Price / Night</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Occupancy</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                  {propertyRooms.map((room, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                            <img src={room.image_url} className="w-full h-full object-cover" alt="Room" />
                          </div>
                          <div>
                            <p className="font-black text-sm text-slate-900 dark:text-white">{room.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Capacity: {room.capacity} Guests</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-[#0B7A3B]">₦{room.price.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Available</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-[75%] h-full bg-[#0B7A3B] rounded-full" />
                          </div>
                          <span className="text-[10px] font-black text-slate-500">75%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-zinc-800/60 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs font-bold text-slate-400">
              <p>Showing 2 rooms of 2 total</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl">Previous</button>
                <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl">Next</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-black flex items-center justify-between">
                Recent Reviews
                <button className="text-[10px] font-black uppercase text-[#0B7A3B] hover:underline">View All</button>
              </h3>
              <div className="space-y-4">
                {[
                  { user: 'Ifeanyi N.', rating: 5, comment: 'Excellent service and clean rooms. The staff at Hotel de Golf are very professional.', date: '2 days ago' },
                  { user: 'Ngozi A.', rating: 4, comment: 'Beautiful ambiance and good food. Had a minor issue with the WiFi but it was resolved.', date: '1 week ago' },
                ].map((review, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-zinc-400 leading-relaxed italic">"{review.comment}"</p>
                    <p className="text-[10px] font-black text-slate-900 dark:text-white">— {review.user}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0B7A3B] rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-emerald-900/20">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black">Performance Alert</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">
                  Your property is performing in the top 5% of Aba hotels this month. Consider launching a weekend special to capitalize on the upcoming Fashion Week.
                </p>
              </div>
              <button className="mt-8 w-full py-4 bg-white text-[#0B7A3B] font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                Launch Campaign
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
