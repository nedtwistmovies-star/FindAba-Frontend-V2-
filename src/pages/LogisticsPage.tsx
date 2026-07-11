import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Truck, 
  Package, 
  MapPin, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Plus,
  Box,
  Weight,
  AlertTriangle,
  Image as ImageIcon,
  Send,
  Navigation,
  CheckCircle2,
  Building2,
  Warehouse,
  ShoppingBag,
  MoreHorizontal
} from 'lucide-react';
import { useTransportStore } from '../store/useTransportStore';
import { useStore } from '../store/useStore';
import { Shipment } from '../types';

const LOGISTICS_CATEGORIES = [
  { id: 'courier', label: 'Bikes & Courier', icon: ShoppingBag, description: 'Quick documents & small items', baseFare: 800, perKg: 100 },
  { id: 'pickup', label: 'Pickup Van', icon: Truck, description: 'Furniture & bulky goods', baseFare: 5000, perKg: 250 },
  { id: 'cargo', label: 'Heavy Cargo', icon: Warehouse, description: 'Industrial equipment & machinery', baseFare: 15000, perKg: 500 },
  { id: 'moving', label: 'Home Moving', icon: Building2, description: 'Full apartment/office relocation', baseFare: 25000, perKg: 0 },
  { id: 'container', label: 'Container', icon: Box, description: '20ft/40ft haulage from ports', baseFare: 150000, perKg: 0 },
  { id: 'interstate', label: 'Interstate', icon: Navigation, description: 'Logistics outside Aba city', baseFare: 10000, perKg: 300 },
];

export const LogisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const { bookLogistics } = useTransportStore();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [category, setCategory] = useState(LOGISTICS_CATEGORIES[0].id);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [packageDesc, setPackageDesc] = useState('');
  const [weight, setWeight] = useState('1');
  const [isFragile, setIsFragile] = useState(false);

  const selectedCat = LOGISTICS_CATEGORIES.find(c => c.id === category);
  const estimatedFare = selectedCat ? selectedCat.baseFare + (selectedCat.perKg * parseFloat(weight || '0')) : 0;

  const handleBookLogistics = () => {
    if (!senderName || !receiverName || !packageDesc) return;
    setStep('confirm');
  };

  const handleFinalConfirm = async () => {
    setLoading(true);
    try {
      const result = await bookLogistics({
        sender_id: user?.id || 'usr_demo1',
        sender_details: { name: senderName, phone: senderPhone, address: senderAddress },
        receiver_details: { name: receiverName, phone: receiverPhone, address: receiverAddress },
        package_details: { description: packageDesc, weight: parseFloat(weight), is_fragile: isFragile },
        type: category as any,
        fare: estimatedFare
      });
      
      if (result) {
        setStep('success');
      } else {
        alert('Booking failed. Please check your connection and try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Logistics & Cargo Booking</h1>
        <button onClick={() => navigate('/logistics/dashboard')} className="text-xs font-bold text-[#0B7A3B] px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
          Business Portal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Progress and Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Service Category</h3>
            <div className="grid grid-cols-1 gap-2">
              {LOGISTICS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      category === cat.id 
                        ? 'bg-[#0B7A3B] text-white border-[#0B7A3B] shadow-lg shadow-emerald-900/20' 
                        : 'bg-slate-50 dark:bg-zinc-800/60 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="font-bold text-sm">{cat.label}</p>
                      <p className={`text-[10px] ${category === cat.id ? 'text-emerald-100' : 'text-slate-400'}`}>{cat.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0B7A3B] rounded-3xl p-6 text-white space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="font-bold">FindAba Insurance</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              All goods shipped via verified Aba Logistics partners are insured up to ₦1,000,000 for loss or damage during transit.
            </p>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'details' ? (
            <div className="space-y-6">
              {/* Sender Details */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-[#0B7A3B]">
                    <Send className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold">Sender Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your full name"
                      value={senderName || ''}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+234..."
                      value={senderPhone || ''}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Pickup Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Shop 24, Faulks Road, Aba"
                        value={senderAddress || ''}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Receiver Details */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold">Receiver Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="Recipient's name"
                      value={receiverName || ''}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+234..."
                      value={receiverPhone || ''}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. 45 Owerri Road, Tower Junction, Aba"
                        value={receiverAddress || ''}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold">Package Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Description of Goods</label>
                    <textarea 
                      placeholder="e.g. 5 cartons of leather shoes, fragile"
                      value={packageDesc || ''}
                      onChange={(e) => setPackageDesc(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Estimated Weight (kg)</label>
                      <div className="relative">
                        <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="number" 
                          value={weight || ''}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                      <button 
                        onClick={() => setIsFragile(!isFragile)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all text-xs font-bold ${
                          isFragile ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-500' : 'bg-slate-50 dark:bg-zinc-800 border-transparent text-slate-500'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Fragile Cargo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-3xl">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Estimated Fare</p>
                  <p className="text-2xl font-black text-[#0B7A3B]">₦{estimatedFare.toLocaleString()}</p>
                </div>
                <button 
                  onClick={handleBookLogistics}
                  disabled={!senderName || !receiverName || !packageDesc}
                  className="px-10 py-4 bg-[#0B7A3B] disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                >
                  Book Delivery
                </button>
              </div>
            </div>
          ) : step === 'confirm' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-8 bg-[#0B7A3B] text-white">
                <h2 className="text-2xl font-bold">Review Your Order</h2>
                <p className="text-emerald-100 text-sm mt-1">Confirm details before booking dispatch</p>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sender</p>
                    <p className="font-bold">{senderName}</p>
                    <p className="text-xs text-slate-500">{senderPhone}</p>
                    <p className="text-xs text-slate-500 italic">{senderAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Receiver</p>
                    <p className="font-bold">{receiverName}</p>
                    <p className="text-xs text-slate-500">{receiverPhone}</p>
                    <p className="text-xs text-slate-500 italic">{receiverAddress}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">Package</span>
                    <span className="px-3 py-1 bg-[#D4AF37] text-zinc-950 text-[10px] font-black rounded-lg uppercase">{category}</span>
                  </div>
                  <p className="text-sm font-medium">{packageDesc}</p>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>{weight} kg</span>
                    {isFragile && <span className="text-rose-500 font-bold">Fragile</span>}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <div className="flex justify-between font-bold">
                    <span>Total Logistics Fee</span>
                    <span className="text-xl text-[#0B7A3B]">₦{estimatedFare.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleFinalConfirm}
                    className="w-full py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-xl"
                  >
                    Confirm & Dispatch Rider
                  </button>
                  <button 
                    onClick={() => setStep('details')}
                    className="w-full py-2 text-slate-400 font-bold text-xs"
                  >
                    Go Back & Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xl space-y-8">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-[#0B7A3B]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Booking Successful!</h2>
                <p className="text-slate-500">Your dispatch request has been broadcasted to verified carriers in Aba.</p>
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-zinc-800/60 rounded-3xl space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Tracking Number</span>
                  <span className="font-mono font-bold text-[#0B7A3B]">FOS-LOG-8492019</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>Pickup expected within 30 minutes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/home')}
                  className="py-4 bg-slate-100 dark:bg-zinc-800 font-bold rounded-2xl text-sm"
                >
                  Return Home
                </button>
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl text-sm"
                >
                  Track Package
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
