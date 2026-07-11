import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, Bot, User, Menu, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

import { CityImage } from '../common/CityImage';

export const TopNavigation: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, notifications, setAiDrawerOpen } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Back, Brand & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-1 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => navigate('/home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#0B7A3B] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-[#0B7A3B]/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-[#D4AF37] rounded-sm rotate-45 flex items-center justify-center"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">FINDABA <span className="text-[#0B7A3B]">OS</span></span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-[#0B7A3B] dark:bg-emerald-900/40 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3 mr-0.5 text-[#D4AF37]" /> V2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block">Aba City Operating System</p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div 
            onClick={() => navigate('/search')}
            className="relative flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-xl px-4 py-2.5 text-slate-500 dark:text-zinc-400 cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all"
          >
            <Search className="w-5 h-5 mr-3 text-slate-400" />
            <span className="text-sm">Search businesses, products, or people in Aba...</span>
            <span className="absolute right-3 px-1.5 py-0.5 text-[10px] bg-white dark:bg-zinc-700 rounded border border-slate-200 dark:border-zinc-600 text-slate-400">Ctrl K</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Balance</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">₦142,500.00</p>
          </div>

          {/* AI Assistant Quick Trigger */}
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-all font-semibold text-xs border border-blue-200 dark:border-blue-900"
          >
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>Ask OS</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => navigate('/messages')}
            className={`p-2.5 rounded-xl relative transition-colors ${location.pathname === '/messages' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className={`p-2.5 rounded-xl relative transition-colors ${location.pathname === '/notifications' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 ml-1 cursor-pointer pl-2 border-l border-slate-200 dark:border-zinc-800"
          >
            <CityImage
              src={user?.avatar_url}
              alt={user?.name || 'User'}
              fallback="profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

