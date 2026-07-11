import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { MessageThread } from '../../types';

interface MessageCardProps {
  thread: MessageThread;
  isActive?: boolean;
  onClick?: () => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ thread, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all ${
        isActive 
          ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-500/20' 
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white'
      }`}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={thread.participant_avatar} 
          alt={thread.participant_name} 
          className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
        />
        {thread.online_status && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
        )}
      </div>

      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-black text-sm truncate">{thread.participant_name}</h4>
          <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-zinc-400'}`}>
            {thread.last_message_time}
          </span>
        </div>
        <p className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-zinc-500'} mt-0.5 font-medium`}>
          {thread.is_typing ? (
            <span className="italic animate-pulse">Typing...</span>
          ) : (
            thread.last_message
          )}
        </p>
      </div>

      {thread.unread_count > 0 && !isActive && (
        <div className="w-5 h-5 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
          {thread.unread_count}
        </div>
      )}
    </motion.button>
  );
};
