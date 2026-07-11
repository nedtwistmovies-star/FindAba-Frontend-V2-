import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Car, 
  MapPin, 
  Star, 
  TrendingUp, 
  History, 
  Settings, 
  ShieldCheck, 
  Navigation,
  Clock,
  Wallet,
  Bell,
  Power,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useTransportStore } from '../store/useTransportStore';

export const DriverDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { drivers, activeTrips, acceptTrip, completeTrip, updateDriverStatus } = useTransportStore();
  
  const driver = drivers[0]; // Demo driver
  const [online, setOnline] = useState(driver.current_status !== 'offline');

  const pendingTrips = activeTrips.filter(t => t.status === 'searching');
  const currentTrip = activeTrips.find(t => t.status === 'accepted' || t.status === 'in_progress');

  const toggleStatus = () => {
    const newStatus = online ? 'offline' : 'online';
    updateDriverStatus(driver.id, newStatus);
    setOnline(!online);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={driver.photo_url} 
              className="w-16 h-16 rounded-full object-cover border-4 border-emerald-50 dark:border-emerald-950/30"
              alt="Driver"
            />
            {online && <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{driver.name}</h1>
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <p className="text-xs text-slate-500">{driver.license_number} • {online ? 'Active' : 'Offline'}</p>
          </div>
        </div>
        <button 
          onClick={toggleStatus}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            online ? 'bg-rose-500 text-white shadow-rose-900/20' : 'bg-[#0B7A3B] text-white shadow-emerald-900/20'
          }`}
        >
          <Power className="w-4 h-4" />
          {online ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Today\'s Earnings', value: '₦12,450', icon: Wallet, color: 'text-emerald-500' },
          { label: 'Rating', value: driver.rating.toString(), icon: Star, color: 'text-amber-500' },
          { label: 'Trips Done', value: driver.completed_trips.toString(), icon: History, color: 'text-blue-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trip / New Requests */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#0B7A3B]" /> Current Tasks
          </h2>

          <AnimatePresence mode="wait">
            {currentTrip ? (
              <motion.div 
                key="current"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 border-2 border-[#0B7A3B] rounded-3xl p-6 shadow-xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-[#0B7A3B] text-[10px] font-black rounded-full uppercase tracking-widest">
                    In Progress
                  </span>
                  <span className="font-mono text-xs text-slate-400">#TRP-4421</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold">
                    {currentTrip.user_name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{currentTrip.user_name}</h3>
                    <p className="text-xs text-slate-500">Pick up from: {currentTrip.pickup_location.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-slate-50 dark:bg-zinc-800 rounded-xl text-blue-500 border border-slate-200 dark:border-zinc-700">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-[#0B7A3B] text-white rounded-xl">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl space-y-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] flex-shrink-0 mt-1">P</div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup</p>
                      <p className="text-xs font-bold">{currentTrip.pickup_location.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px] flex-shrink-0 mt-1">D</div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                      <p className="text-xs font-bold">{currentTrip.destination.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  <p className="text-xs text-slate-500">Payment: <span className="font-bold text-slate-900 dark:text-white capitalize">{currentTrip.payment_method}</span></p>
                  <p className="text-xl font-black text-[#0B7A3B]">₦{currentTrip.fare.toLocaleString()}</p>
                </div>

                <button 
                  onClick={() => completeTrip(currentTrip.id)}
                  className="w-full py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/20"
                >
                  Complete Trip & Collect Fare
                </button>
              </motion.div>
            ) : pendingTrips.length > 0 ? (
              <div className="space-y-4">
                {pendingTrips.map(trip => (
                  <motion.div 
                    key={trip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-[#0B7A3B]">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">New Ride Request</h3>
                          <p className="text-[10px] text-slate-400">2.4 km away from you</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#0B7A3B]">₦{trip.fare.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Cashless Wallet</p>
                      </div>
                    </div>

                    <div className="space-y-3 pl-2 border-l-2 border-dashed border-slate-100 dark:border-zinc-800 ml-5">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup</p>
                        <p className="text-xs font-bold truncate">{trip.pickup_location.address}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Dropoff</p>
                        <p className="text-xs font-bold truncate">{trip.destination.address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button className="py-3 bg-slate-50 dark:bg-zinc-800 text-slate-400 font-bold rounded-xl text-xs">Decline</button>
                      <button 
                        onClick={() => acceptTrip(trip.id, driver.id)}
                        className="py-3 bg-[#0B7A3B] text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-900/20"
                      >
                        Accept Trip
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Bell className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-500">No pending requests</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-2">New ride requests in your area will appear here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* History & Performance */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" /> Performance
          </h2>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Acceptance Rate</span>
                <span className="text-xs font-bold text-emerald-500">98.2%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5">
                <div className="bg-emerald-500 w-[98.2%] h-full rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Completion Rate</span>
                <span className="text-xs font-bold text-blue-500">95.4%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5">
                <div className="bg-blue-500 w-[95.4%] h-full rounded-full" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Trips</h4>
              {[
                { user: 'Buchi Obi', time: '2 hours ago', fare: '₦1,200', status: 'Completed' },
                { user: 'Ifeanyi J.', time: 'Yesterday', fare: '₦3,500', status: 'Completed' },
                { user: 'Ngozi A.', time: 'Yesterday', fare: '₦2,100', status: 'Completed' },
              ].map((trip, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      {trip.user[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{trip.user}</p>
                      <p className="text-[10px] text-slate-400">{trip.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#0B7A3B]">{trip.fare}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">{trip.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-slate-50 dark:bg-zinc-800 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-100">
              View Detailed Earnings Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
