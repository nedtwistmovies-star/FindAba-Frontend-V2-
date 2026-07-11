import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Clock, 
  Navigation,
  Info,
  ChevronRight,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useTransportStore } from '../store/useTransportStore';
import { GoogleMapComponent } from '../components/transport/GoogleMapComponent';

export const TripTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeTrips, userTrips } = useTransportStore();
  
  const trip = activeTrips.find(t => t.id === id) || userTrips.find(t => t.id === id);
  
  const [driverPos, setDriverPos] = useState({ lat: 5.1065, lng: 7.3697 });

  useEffect(() => {
    if (!trip) return;

    // Simulate driver movement
    const interval = setInterval(() => {
      setDriverPos(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [trip]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold">Trip not found</h2>
        <button onClick={() => navigate('/transport')} className="text-[#0B7A3B] font-bold">Return to Transport</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Live Tracking</h1>
            <p className="text-xs text-slate-500">Trip ID: #ABA-{trip.id.split('_')[1]}</p>
          </div>
        </div>
        <button className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-slate-200 dark:border-zinc-700">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          <GoogleMapComponent 
            height="500px"
            center={driverPos}
            markers={[
              { position: trip.pickup_location, title: 'Pickup', color: '#0B7A3B' },
              { position: trip.destination, title: 'Destination', color: '#D4AF37' },
              { position: driverPos, title: 'Driver', color: '#1d4ed8' }
            ]}
          />
          
          <div className="absolute top-4 left-4 right-4 flex gap-2">
            <div className="flex-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Driver ETA</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">4 Minutes away</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-emerald-50 dark:border-emerald-950/30"
                  alt="Driver"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5 border-2 border-white dark:border-zinc-900">
                  <Star className="w-3 h-3 fill-current" /> 4.8
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Emeka Nwosu</h3>
                <p className="text-xs text-slate-500">Verified Professional Driver</p>
                <p className="text-sm font-black text-[#0B7A3B] mt-1 uppercase tracking-tighter">Toyota Corolla • ABA-882-AB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-4 bg-emerald-50 dark:bg-emerald-950/50 text-[#0B7A3B] font-bold rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20">
                <Phone className="w-4 h-4" /> Call Driver
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Trip Route</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-dashed border-l-2 border-dashed border-slate-200 dark:border-zinc-800" />
              
              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</p>
                  <p className="text-sm font-bold">{trip.pickup_location.address}</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                  <p className="text-sm font-bold">{trip.destination.address}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Estimated Fare</span>
                <span className="font-black text-[#0B7A3B] text-lg">₦{trip.fare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-bold capitalize">{trip.payment_method} Wallet</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-900 dark:text-rose-100">SOS / Emergency</p>
                <p className="text-[10px] text-rose-700 dark:text-rose-300">Contact FindAba Security Hub</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-lg uppercase">Trigger</button>
          </div>
        </div>
      </div>
    </div>
  );
};
