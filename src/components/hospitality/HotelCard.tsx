import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, ShieldCheck, Wifi, Coffee, Music, Car } from 'lucide-react';
import { Business } from '../../types';
import { CityImage } from '../common/CityImage';

interface HotelCardProps {
  hotel: Business;
  onClick: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative h-48 sm:h-56">
        <CityImage
          src={hotel.image_url}
          alt={hotel.name}
          fallback="business"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {hotel.verified && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Verified Property</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5">
            <div className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-current" /> {hotel.rating}
            </div>
            <span className="text-[10px] font-medium opacity-80">({hotel.reviews_count} Reviews)</span>
          </div>
          <span className="text-[10px] font-bold bg-[#0B7A3B] px-2 py-0.5 rounded-full">{hotel.sub_category}</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#0B7A3B] transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 mt-1">
            <MapPin className="w-3 h-3" />
            <span className="text-[11px] font-medium truncate">{hotel.address}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {hotel.amenities?.slice(0, 3).map((amenity, i) => (
            <div key={i} className="bg-slate-50 dark:bg-zinc-800 p-2 rounded-xl text-slate-500">
              {amenity.includes('WiFi') && <Wifi className="w-3.5 h-3.5" />}
              {amenity.includes('Food') && <Coffee className="w-3.5 h-3.5" />}
              {amenity.includes('Bar') && <Music className="w-3.5 h-3.5" />}
              {amenity.includes('Parking') && <Car className="w-3.5 h-3.5" />}
              {!['WiFi', 'Food', 'Bar', 'Parking'].some(k => amenity.includes(k)) && <Star className="w-3.5 h-3.5" />}
            </div>
          ))}
          {hotel.amenities && hotel.amenities.length > 3 && (
            <div className="bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded-xl text-[10px] font-bold text-slate-500 flex items-center">
              +{hotel.amenities.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-zinc-800">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting From</p>
            <p className="text-lg font-black text-[#0B7A3B]">₦25,000<span className="text-[10px] font-medium text-slate-400">/night</span></p>
          </div>
          <button className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl text-[11px] font-bold">
            View Rooms
          </button>
        </div>
      </div>
    </motion.div>
  );
};
