import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  MapPin, 
  Clock, 
  CreditCard, 
  Wallet, 
  Star, 
  ChevronRight, 
  Search, 
  Navigation, 
  ArrowLeft,
  X,
  Plus,
  Bike,
  Users,
  Truck,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  MessageSquare,
  Phone
} from 'lucide-react';
import { useTransportStore } from '../store/useTransportStore';
import { useStore } from '../store/useStore';
import { TransportVehicleType, Trip } from '../types';
import { GoogleMapComponent } from '../components/transport/GoogleMapComponent';

const VEHICLE_CATEGORIES: { 
  id: TransportVehicleType; 
  label: string; 
  icon: any; 
  description: string;
  baseFare: number;
  perKm: number;
}[] = [
  { id: 'okada', label: 'Motorcycle', icon: Bike, description: 'Fastest for city traffic', baseFare: 200, perKm: 50 },
  { id: 'keke', label: 'Tricycle', icon: Zap, description: 'Economic city transport', baseFare: 150, perKm: 40 },
  { id: 'taxi', label: 'City Cab', icon: Car, description: 'Comfortable private ride', baseFare: 1000, perKm: 200 },
  { id: 'ride_hailing', label: 'Premium Ride', icon: ShieldCheck, description: 'Verified luxury sedans', baseFare: 2000, perKm: 350 },
  { id: 'mini_bus', label: 'City Shuttle', icon: Users, description: 'Shared group transport', baseFare: 100, perKm: 20 },
  { id: 'luxury_car', label: 'Executive', icon: Star, description: 'For high-end meetings', baseFare: 5000, perKm: 800 },
];

export const TransportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const { bookRide, activeTrips } = useTransportStore();
  
  const [step, setStep] = useState<'booking' | 'searching' | 'confirmed'>('booking');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicleType>('keke');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash' | 'escrow'>('wallet');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const currentCategory = VEHICLE_CATEGORIES.find(c => c.id === selectedVehicle);
  const estimatedDistance = 5.2; // Mock distance
  const estimatedFare = currentCategory ? currentCategory.baseFare + (currentCategory.perKm * estimatedDistance) : 0;

  const handleBookRide = async () => {
    if (!pickup || !destination) return;
    
    setStep('searching');
    
    try {
      const trip = await bookRide({
        user_id: user?.id || 'usr_demo1',
        user_name: user?.name || 'Aba Citizen',
        vehicle_type: selectedVehicle,
        pickup_location: { address: pickup, lat: 5.1065, lng: 7.3697 },
        destination: { address: destination, lat: 5.1123, lng: 7.3541 },
        fare: estimatedFare,
        payment_method: paymentMethod,
        scheduled_time: isScheduled ? scheduledTime : undefined
      });

      if (trip) {
        // Simulate finding a driver
        setTimeout(() => {
          setStep('confirmed');
        }, 4000);
      } else {
        setStep('booking');
        alert('Booking failed. Please check your connection.');
      }
    } catch (err) {
      console.error(err);
      setStep('booking');
      alert('An unexpected error occurred.');
    }
  };

  const activeTrip = activeTrips[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Transport & Ride Hailing</h1>
        <button onClick={() => navigate('/driver/dashboard')} className="text-xs font-bold text-[#0B7A3B] px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
          Driver Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Map and Status */}
        <div className="space-y-6 order-2 lg:order-1">
          <GoogleMapComponent 
            height="450px"
            markers={[
              { position: { lat: 5.1065, lng: 7.3697 }, title: 'Pickup', color: '#0B7A3B' },
              { position: { lat: 5.1123, lng: 7.3541 }, title: 'Destination', color: '#D4AF37' }
            ]}
          />

          {step === 'confirmed' && activeTrip && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    Ride Confirmed
                  </span>
                  <h3 className="text-lg font-bold mt-1">Driver is on the way</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">ETA</p>
                  <p className="text-lg font-black text-[#0B7A3B]">4 Mins</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl mb-6">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-zinc-800"
                    alt="Driver"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star className="w-2 h-2 fill-current" /> 4.8
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Emeka Nwosu</h4>
                  <p className="text-xs text-slate-500">Toyota Corolla • <span className="font-bold text-slate-900 dark:text-white">ABA-882-AB</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 text-[#0B7A3B]">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="p-3 bg-[#0B7A3B] text-white rounded-xl shadow-sm">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/transport/tracking/${activeTrip.id}`)}
                  className="w-full py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20"
                >
                  Track Live on Map
                </button>
                <button 
                  onClick={() => setStep('booking')}
                  className="w-full py-3 text-slate-500 font-bold text-xs"
                >
                  Cancel Ride
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Booking Interface */}
        <div className="space-y-6 order-1 lg:order-2">
          {step === 'booking' ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Where to?</h2>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <input 
                      type="text"
                      placeholder="Pickup point (e.g. Ariaria Market Gate 1)"
                      value={pickup || ''}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-2xl text-sm focus:ring-2 focus:ring-[#0B7A3B] outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    <input 
                      type="text"
                      placeholder="Destination (e.g. Aba Town Hall)"
                      value={destination || ''}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-2xl text-sm focus:ring-2 focus:ring-[#0B7A3B] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isScheduled ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-[#0B7A3B]' : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {isScheduled ? 'Scheduled' : 'Book Now'}
                  </button>
                  {isScheduled && (
                    <input 
                      type="datetime-local"
                      value={scheduledTime || ''}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="flex-shrink-0 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Select Vehicle</h3>
                <div className="space-y-2">
                  {VEHICLE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedVehicle(cat.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          selectedVehicle === cat.id 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm' 
                            : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedVehicle === cat.id ? 'bg-[#0B7A3B] text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{cat.label}</span>
                            <span className="font-black text-[#0B7A3B] text-base">₦{(cat.baseFare + (cat.perKm * estimatedDistance)).toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{cat.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Payment Method</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wallet', label: 'Wallet', icon: Wallet },
                    { id: 'cash', label: 'Cash', icon: CreditCard },
                    { id: 'escrow', label: 'Escrow', icon: ShieldCheck },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          paymentMethod === method.id 
                            ? 'bg-[#0B7A3B] text-white border-[#0B7A3B]' 
                            : 'bg-slate-50 dark:bg-zinc-800/60 border-transparent text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleBookRide}
                disabled={!pickup || !destination}
                className="w-full py-4 bg-[#0B7A3B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all"
              >
                Confirm {selectedVehicle.toUpperCase()} Booking
              </button>
            </div>
          ) : step === 'searching' ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm h-full flex flex-col items-center justify-center space-y-8 min-h-[400px]">
              <div className="relative">
                <div className="absolute inset-0 bg-[#0B7A3B] rounded-full animate-ping opacity-20" />
                <div className="relative w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Navigation className="w-10 h-10 text-[#0B7A3B] animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Finding your driver</h2>
                <p className="text-sm text-slate-500">Contacting nearby {selectedVehicle} drivers in your area...</p>
              </div>
              <div className="w-full max-w-xs bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-1/2 h-full bg-[#0B7A3B]"
                />
              </div>
              <button 
                onClick={() => setStep('booking')}
                className="text-rose-500 font-bold text-xs hover:underline"
              >
                Cancel Search
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-[#0B7A3B]">
                <ShieldCheck className="w-6 h-6" />
                <h2 className="text-xl font-bold">Ride Securely Booked</h2>
              </div>
              <p className="text-sm text-slate-500">Your ride has been confirmed and the driver is heading to your location. You can track their progress on the map.</p>
              
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Trip Fare</span>
                  <span className="font-bold text-slate-900 dark:text-white">₦{estimatedFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Mode</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">{paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Booking ID</span>
                  <span className="font-mono text-slate-400">#ABA-{activeTrip?.id.split('_')[1]}</span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                  For your safety, always confirm that the vehicle plate number matches <span className="font-bold">ABA-882-AB</span> before entering.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
