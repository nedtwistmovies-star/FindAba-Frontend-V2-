import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Lock, Globe } from 'lucide-react';
import { SocialGroup } from '../../types';

interface GroupCardProps {
  group: SocialGroup;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="h-32 relative">
        <img src={group.image_url} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
          {group.is_private ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
          {group.category}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight group-hover:text-[#0B7A3B] transition-colors">{group.name}</h3>
          <div className="flex items-center gap-2 text-zinc-500">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">{group.members_count} members</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2 font-medium leading-relaxed">
          {group.description}
        </p>

        <button className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#0B7A3B] hover:text-white text-[#0B7A3B] rounded-2xl text-xs font-black transition-all">
          Join Community
        </button>
      </div>
    </motion.div>
  );
};
