import React from 'react';
import { 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Star, 
  Settings, 
  Bell, 
  BadgeCheck,
  Award,
  AlertTriangle,
  Megaphone,
  Briefcase,
  CheckCircle2,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-emerald-500" />;
      case 'verified': return <BadgeCheck className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Award className="w-5 h-5 text-[#D4AF37]" />;
      case 'business_update': return <Briefcase className="w-5 h-5 text-[#0B7A3B]" />;
      case 'system': return <Megaphone className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Notifications</h1>
          <p className="text-sm text-zinc-500 font-medium">Stay updated with your social ecosystem</p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all">
            <CheckCircle2 className="w-4 h-4" />
            Mark all read
          </button>
          <button className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:bg-zinc-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => (
              <motion.div 
                layout
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-6 flex items-start gap-4 transition-colors relative group ${notification.read ? 'opacity-80' : 'bg-emerald-50/30 dark:bg-emerald-950/10'}`}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0B7A3B]" />
                )}

                <div className="relative flex-shrink-0">
                  {notification.avatar_url ? (
                    <img src={notification.avatar_url} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-zinc-800" alt="" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                    {getIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 space-y-1 pr-12">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white">{notification.title}</h4>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button 
                      onClick={() => markNotificationRead(notification.id)}
                      className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[#0B7A3B] rounded-xl transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 rounded-xl transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {notifications.length === 0 && (
          <div className="p-20 text-center">
            <Bell className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">All caught up!</h3>
            <p className="text-sm text-zinc-500 mt-2">When you get new updates, they will appear here.</p>
          </div>
        )}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl text-sm font-bold text-zinc-400 hover:text-zinc-600 hover:border-zinc-200 transition-all">
        View Older Notifications
      </button>
    </div>
  );
};
