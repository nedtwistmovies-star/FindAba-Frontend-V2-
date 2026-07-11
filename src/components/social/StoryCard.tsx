import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Story } from '../../types';
import { CityImage } from '../common/CityImage';

interface StoryCardProps {
  story?: Story;
  isAdd?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, isAdd }) => {
  if (isAdd) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 w-32 h-48 rounded-3xl overflow-hidden relative group border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-900/50"
      >
        <div className="w-10 h-10 rounded-full bg-[#0B7A3B] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Add Story</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 w-32 h-48 rounded-3xl overflow-hidden relative group shadow-sm"
    >
      <CityImage 
        src={story?.media_url} 
        alt={story?.author_name} 
        fallback="event"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-2 border-emerald-500 p-0.5 overflow-hidden bg-white">
        <CityImage src={story?.author_avatar} alt="" fallback="profile" className="w-full h-full rounded-full object-cover" />
      </div>

      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-[10px] font-bold text-white truncate">{story?.author_name}</p>
      </div>
    </motion.button>
  );
};
