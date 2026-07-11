import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket, Share2, Heart } from 'lucide-react';
import { EventListing } from '../../types';
import { CityImage } from '../common/CityImage';

interface EventCardProps {
  event: EventListing;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col h-full"
    >
      <div className="relative h-48">
        <CityImage src={event.image_url} alt={event.name} fallback="event" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white dark:bg-zinc-900 rounded-2xl p-2 min-w-[50px] text-center shadow-lg border border-slate-100 dark:border-zinc-800">
          <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{day}</p>
          <p className="text-[10px] font-bold text-[#0B7A3B] uppercase tracking-tighter mt-1">{month}</p>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/40 transition-all">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{event.category}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[9px] font-bold text-[#0B7A3B]">{event.organizer}</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight line-clamp-2">
            {event.name}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{event.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50 dark:border-zinc-800">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Tickets From</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">₦{event.ticket_price.toLocaleString()}</p>
          </div>
          <button 
            onClick={onClick}
            className="bg-[#0B7A3B] text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
          >
            Get Tickets
          </button>
        </div>
      </div>
    </motion.div>
  );
};
