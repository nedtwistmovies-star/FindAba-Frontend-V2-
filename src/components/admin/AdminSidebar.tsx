import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  Truck, 
  Hotel, 
  MessageSquare, 
  ShieldAlert, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  Sparkles,
  Wallet,
  Activity,
  FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups = [
    {
      title: 'Operations',
      items: [
        { label: 'Command Center', icon: LayoutDashboard, path: '/admin' },
        { label: 'Digital Citizens', icon: Users, path: '/admin/users' },
        { label: 'Merchant Registry', icon: Store, path: '/admin/businesses' },
        { label: 'Marketplace', icon: ShoppingBag, path: '/admin/marketplace' },
      ]
    },
    {
      title: 'City Services',
      items: [
        { label: 'Transport Hub', icon: Truck, path: '/admin/transport' },
        { label: 'Hospitality', icon: Hotel, path: '/admin/hotels' },
        { label: 'Community Feed', icon: MessageSquare, path: '/admin/community' },
        { label: 'Mazi Kalu AI', icon: Sparkles, path: '/admin/ai' },
      ]
    },
    {
      title: 'Control Room',
      items: [
        { label: 'Financials', icon: Wallet, path: '/admin/finances' },
        { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
        { label: 'City Alerts', icon: Bell, path: '/admin/alerts' },
        { label: 'Audit Logs', icon: FileText, path: '/admin/audit' },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { label: 'System Settings', icon: Settings, path: '/admin/settings' },
        { label: 'Analytics', icon: Activity, path: '/admin/analytics' },
      ]
    }
  ];

  return (
    <div className="w-80 bg-zinc-950 text-zinc-400 h-full flex flex-col border-r border-white/5">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0B7A3B] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-black tracking-tighter leading-tight">FindAba OS</h2>
            <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Super Admin</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
        {menuGroups.map((group, i) => (
          <div key={i} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group ${
                      isActive 
                        ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-500/10' 
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-[#D4AF37]'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <motion.div layoutId="active-pill" className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Logout Session
        </button>
      </div>
    </div>
  );
};
