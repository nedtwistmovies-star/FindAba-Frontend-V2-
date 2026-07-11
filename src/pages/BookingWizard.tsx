import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHospitalityStore } from '../store/useHospitalityStore';
import { useStore } from '../store/useStore';
import { Booking, PaymentMethod } from '../types';

export const BookingWizard: React.FC = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { hotels, rooms, addBooking } = useHospitalityStore();
  const { user, walletBalance, addTransaction } = useStore();
  
  const hotel = hotels.find(h => h.id === hotelId);
  const room = rooms.find(r => r.id === roomId);

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [specialRequests, setSpecialRequests] = useState('');

  if (!hotel || !room) return <div>Data not found</div>;

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const totalPrice = (room.discount_price || room.price) * nights;

  const handleCompleteBooking = () => {
    const bookingRef = `BKG-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newBooking: Booking = {
      id: `bkg_${Date.now()}`,
      user_id: user?.id || 'guest',
      business_id: hotel.id,
      business_name: hotel.name,
      business_image: hotel.image_url,
      product_id: room.id,
      product_name: room.name,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      total_price: totalPrice,
      status: 'confirmed',
      payment_status: 'paid',
      payment_method: paymentMethod,
      special_requests: specialRequests,
      booking_reference: bookingRef,
      created_at: new Date().toISOString()
    };

    addBooking(newBooking);
    
    // Add wallet transaction if paid via wallet
    if (paymentMethod === 'wallet') {
      addTransaction({
        id: `tx_${Date.now()}`,
        type: 'debit',
        title: `Booking: ${room.name} at ${hotel.name}`,
        amount: totalPrice,
        status: 'completed',
        date: new Date().toISOString(),
        reference: bookingRef
      });
    }

    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
          className="p-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl text-slate-500 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Complete Your Booking</h1>
          <p className="text-xs font-bold text-[#0B7A3B] uppercase tracking-widest">{hotel.name} • {room.name}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 px-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              step >= i ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
            }`}>
              {i}
            </div>
            {i < 3 && <div className={`flex-1 h-1 rounded-full ${step > i ? 'bg-[#0B7A3B]' : 'bg-slate-100 dark:bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            <div className="md:col-span-7 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#0B7A3B]" /> Booking Details
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-In Date</label>
                    <input 
                      type="date" 
                      className="w-full p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      value={checkIn || ''}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-Out Date</label>
                    <input 
                      type="date" 
                      className="w-full p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                      value={checkOut || ''}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Number of Guests</label>
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => setGuests(num)}
                        className={`flex-1 py-4 rounded-2xl text-sm font-black transition-all ${
                          guests === num 
                            ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-lg' 
                            : 'bg-slate-50 dark:bg-zinc-800 text-slate-500'
                        }`}
                      >
                        {num} Adult{num > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Special Requests (Optional)</label>
                  <textarea 
                    placeholder="e.g. Early check-in, Airport pickup, High floor..."
                    className="w-full p-4 bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#0B7A3B] min-h-[100px]"
                    value={specialRequests || ''}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-3xl flex gap-4">
                <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-900 dark:text-amber-400">Cancellation Policy</p>
                  <p className="text-[11px] font-medium text-amber-700 dark:text-amber-500 leading-relaxed">
                    Free cancellation until 24 hours before check-in. Non-refundable after that period.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm sticky top-6">
                <h3 className="font-black">Price Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">{room.name} x {nights || 1} Nights</span>
                    <span className="font-bold">₦{((room.discount_price || room.price) * (nights || 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Service Charge</span>
                    <span className="font-bold">₦1,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">VAT (7.5%)</span>
                    <span className="font-bold text-[#0B7A3B]">Included</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-zinc-800 flex justify-between items-center">
                  <p className="text-lg font-black">Total</p>
                  <p className="text-2xl font-black text-[#0B7A3B]">₦{(totalPrice + 1500).toLocaleString()}</p>
                </div>

                <button 
                  disabled={!checkIn || !checkOut}
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] p-10 space-y-10 shadow-sm text-center">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-[#D4AF37]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Select Payment Method</h2>
                <p className="text-slate-400 text-sm">Secure transactions powered by FindAba Pay</p>
              </div>

              <div className="grid grid-cols-1 gap-4 text-left">
                {[
                  { id: 'wallet', label: 'FindAba Wallet', desc: `Balance: ₦${walletBalance.toLocaleString()}`, icon: Wallet },
                  { id: 'paystack', label: 'Debit Card (Paystack)', desc: 'Secure online payment', icon: CreditCard },
                  { id: 'escrow', label: 'Escrow Secure', desc: 'Released on Check-in', icon: ShieldCheck },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${
                      paymentMethod === method.id 
                        ? 'border-[#0B7A3B] bg-emerald-50 dark:bg-emerald-950/20' 
                        : 'border-slate-100 dark:border-zinc-800 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      paymentMethod === method.id ? 'bg-[#0B7A3B] text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
                    }`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-900 dark:text-white">{method.label}</p>
                      <p className="text-xs text-slate-400 font-bold">{method.desc}</p>
                    </div>
                    {paymentMethod === method.id && <CheckCircle2 className="w-6 h-6 text-[#0B7A3B]" />}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/60 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center font-black">
                  <span className="text-slate-400 uppercase text-[10px]">Grand Total</span>
                  <span className="text-2xl text-[#0B7A3B]">₦{(totalPrice + 1500).toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCompleteBooking}
                  className="w-full py-5 bg-[#0B7A3B] text-white font-black rounded-2xl shadow-xl shadow-emerald-900/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Pay & Confirm Booking
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0B7A3B] via-[#D4AF37] to-[#0B7A3B]" />
              
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black">Booking Confirmed!</h2>
                <p className="text-slate-500 font-medium">Your room is ready for your arrival at {hotel.name}</p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800 rounded-3xl p-8 space-y-6 text-left border border-slate-100 dark:border-zinc-700">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-zinc-700">
                  <p className="text-[10px] font-black uppercase text-slate-400">Booking Reference</p>
                  <p className="font-mono font-bold text-[#0B7A3B]">#FABA-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Guest Name</p>
                    <p className="text-sm font-bold">{user?.name || 'Guest User'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Room Type</p>
                    <p className="text-sm font-bold">{room.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Date</p>
                    <p className="text-sm font-bold">{new Date(checkIn).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Payment</p>
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Verified
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/hospitality/bookings')}
                  className="py-4 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  View Bookings
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="py-4 bg-[#0B7A3B] text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                >
                  Return Home
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-medium">A confirmation email and SMS have been sent to your registered contact details.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
