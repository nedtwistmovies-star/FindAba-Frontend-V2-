import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  ClipboardList, 
  Wallet, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  PlusCircle,
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegister?: () => void;
}

export const BusinessSidebar: React.FC<BusinessSidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegister
}) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Business Profile', icon: Store },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-5rem)]">
      <div className="space-y-6">
        <div>
          <button
            onClick={onOpenRegister}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#0B7A3B] to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" /> Register New Business
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-[#0B7A3B] dark:bg-emerald-950/50 dark:text-emerald-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#0B7A3B] dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="w-4 h-4 text-zinc-400" />
          <span>Exit to OS Main</span>
        </button>
      </div>
    </aside>
  );
};
