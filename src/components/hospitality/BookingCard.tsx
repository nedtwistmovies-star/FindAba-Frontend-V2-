import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, CheckCircle2, XCircle, Clock, Receipt, Download } from 'lucide-react';
import { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const statusColors = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
    completed: 'bg-blue-50 text-blue-600 border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
          <img src={booking.business_image} className="w-full h-full object-cover" alt={booking.business_name} />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Ref: {booking.booking_reference}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {booking.product_name}
              </h3>
              <p className="text-sm font-bold text-[#0B7A3B]">{booking.business_name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Total Paid</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">₦{booking.total_price.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Check In</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold">{new Date(booking.check_in).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Check Out</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold">{new Date(booking.check_out).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Guests</p>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold">{booking.guests} Adults</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Payment</p>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold capitalize">{booking.payment_method}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-50 dark:border-zinc-800">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 transition-colors">
              <Download className="w-3.5 h-3.5" />
              E-Receipt
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 transition-colors">
              <Receipt className="w-3.5 h-3.5" />
              Invoice
            </button>
            {booking.status === 'pending' || booking.status === 'confirmed' && (
              <button 
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 text-rose-500 text-[11px] font-bold hover:bg-rose-50 rounded-xl transition-colors ml-auto"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
