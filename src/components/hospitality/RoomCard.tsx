import React from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, Wind, Tv, CheckCircle2, ChevronRight } from 'lucide-react';
import { Product } from '../../types';

interface RoomCardProps {
  room: Product;
  onBook: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 relative h-56 md:h-full min-h-[224px]">
          <img
            src={room.image_url}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          {room.discount_price && (
            <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">
              Special Offer
            </div>
          )}
        </div>

        <div className="md:col-span-3 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{room.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 dark:bg-zinc-800 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold">Up to {room.capacity} Guests</span>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              {room.description}
            </p>

            <div className="grid grid-cols-2 gap-y-3 pt-2">
              {room.features?.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A3B]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50 dark:border-zinc-800">
            <div className="flex items-end gap-2">
              <div className="text-right">
                {room.discount_price && (
                  <p className="text-xs text-slate-400 line-through">₦{room.price.toLocaleString()}</p>
                )}
                <p className="text-2xl font-black text-[#0B7A3B]">
                  ₦{(room.discount_price || room.price).toLocaleString()}
                  <span className="text-xs font-medium text-slate-400">/night</span>
                </p>
              </div>
            </div>

            <button
              onClick={onBook}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 transition-all"
            >
              Book This Room
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
