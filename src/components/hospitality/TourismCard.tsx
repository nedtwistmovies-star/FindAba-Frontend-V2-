import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera, Clock, Globe, Ticket } from 'lucide-react';
import { TourismSpot } from '../../types';
import { CityImage } from '../common/CityImage';

interface TourismCardProps {
  spot: TourismSpot;
  onClick: () => void;
}

export const TourismCard: React.FC<TourismCardProps> = ({ spot, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg"
    >
      <CityImage
        src={spot.image_url}
        alt={spot.name}
        fallback="event"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
        <span className="text-[10px] font-black text-white uppercase tracking-wider">{spot.category}</span>
      </div>

      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <div className="flex items-center gap-1.5 text-[#D4AF37]">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{spot.location}</span>
        </div>
        <h3 className="text-xl font-black text-white leading-tight">{spot.name}</h3>
        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
          {spot.description}
        </p>
        
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">{spot.best_time_to_visit}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Ticket className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">{spot.entry_fee === 0 ? 'Free Entry' : `₦${spot.entry_fee?.toLocaleString()}`}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
