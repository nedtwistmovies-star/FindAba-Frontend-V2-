import React from 'react';
import { Search, Bell, User, Calendar, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AdminHeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onMenuClick }) => {
  const { user } = useStore();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="h-24 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
        >
          <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">{title}</h1>
          <p className="text-[10px] text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest">
            <Calendar className="w-3 h-3 text-[#0B7A3B]" />
            {today}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-6 py-3 rounded-2xl w-96 border border-transparent focus-within:border-[#0B7A3B]/20 focus-within:bg-white dark:focus-within:bg-zinc-950 transition-all group">
          <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-[#0B7A3B]" />
          <input 
            type="text" 
            placeholder="Universal City Search..." 
            className="bg-transparent border-none text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-400">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950" />
          </button>
          
          <div className="h-10 w-[1px] bg-zinc-200 dark:border-zinc-800 mx-2 hidden sm:block" />

          <button className="flex items-center gap-3 pl-2 pr-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-zinc-500" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-black text-zinc-900 dark:text-white leading-tight">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] font-bold text-[#0B7A3B] uppercase tracking-widest">{user?.role || 'Super User'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
