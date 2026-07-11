import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, Bot, User, Wallet, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'City', icon: Compass, path: '/discover' },
    { label: 'Aba AI', icon: Bot, path: '/mazi-kalu' },
    { label: 'Feed', icon: Users, path: '/community' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
      <div className="bg-zinc-900/80 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-4 py-3 shadow-2xl shadow-zinc-950/40">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center py-1 px-3 group"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-1 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${isActive ? 'text-emerald-400 scale-110' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-emerald-400 opacity-100' : 'text-zinc-500 opacity-60'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
