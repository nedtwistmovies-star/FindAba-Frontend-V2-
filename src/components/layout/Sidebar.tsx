import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Store, 
  Users, 
  ShoppingBag, 
  Truck,
  Car,
  Building2,
  Wallet, 
  MessageSquare, 
  Settings, 
  Bot,
  User,
  Sun,
  Moon,
  LogOut,
  MapPin,
  Calendar
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, logout, setAiDrawerOpen } = useStore();

  const navSections = [
    {
      title: 'City OS Core',
      items: [
        { label: 'Home', icon: Home, path: '/home' },
        { label: 'City Feed', icon: Users, path: '/community' },
        { label: 'Aba AI', icon: Bot, path: '/mazi-kalu', badge: 'AI' },
      ]
    },
    {
      title: 'Commerce & Trade',
      items: [
        { label: 'Businesses', icon: Store, path: '/discover' },
        { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
        { label: 'Logistics', icon: Truck, path: '/logistics' },
      ]
    },
    {
      title: 'Life & Services',
      items: [
        { label: 'Hospitality', icon: Building2, path: '/hospitality' },
        { label: 'Tourism', icon: MapPin, path: '/tourism' },
        { label: 'Events', icon: Calendar, path: '/events' },
        { label: 'Transport', icon: Car, path: '/transport' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { label: 'Wallet', icon: Wallet, path: '/wallet' },
        { label: 'Messages', icon: MessageSquare, path: '/messages' },
        { label: 'Profile', icon: User, path: '/profile' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto px-4 py-6 scrollbar-hide">
      {/* AI Assistant Banner Card */}
      <div 
        onClick={() => navigate('/mazi-kalu')}
        className="mb-8 p-4 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 text-white cursor-pointer shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <p className="text-[10px] text-emerald-100 mb-1 uppercase tracking-widest font-black flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
          OS Intelligence
        </p>
        <p className="text-white text-sm font-black leading-tight mb-3">Ask Mazi Kalu anything about Aba</p>
        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] font-black rounded-xl transition-colors uppercase tracking-wider">Start Consulting</button>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-8 flex-1">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h3 className="px-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-[8px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 font-black rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer controls: Theme toggle & logout */}
      <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

