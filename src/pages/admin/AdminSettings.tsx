import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Cpu, 
  Database, 
  Cloud,
  Zap,
  Lock,
  Smartphone,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'infrastructure' | 'security'>('general');

  const settingsGroups = [
    {
      title: 'City Operating System',
      items: [
        { label: 'Core Platform Config', desc: 'Manage base URL, API endpoints and CDN', icon: Globe },
        { label: 'Merchant Commission', desc: 'Set standard rates for city-wide commerce', icon: Zap },
        { label: 'Emergency Mode', desc: 'Toggle city-wide lockdown/maintenance state', icon: Shield },
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { label: 'Supabase Node Hub', desc: 'Database health and real-time sync nodes', icon: Database },
        { label: 'Gemini AI Clusters', desc: 'Configure model versions and token quotas', icon: Cpu },
        { label: 'Push Notification Engine', desc: 'Firebase Cloud Messaging certificates', icon: Bell },
      ]
    },
    {
      title: 'Citizen Security',
      items: [
        { label: 'Auth Enforcement', desc: 'MFA, session timeouts and blocking rules', icon: Lock },
        { label: 'Digital Identity', desc: 'Verification criteria for business citizens', icon: Smartphone },
      ]
    }
  ];

  return (
    <AdminLayout title="System Infrastructure">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8">Infrastructure Hub</h3>
            <div className="space-y-2">
              {[
                { id: 'general', label: 'General Configuration', icon: Settings },
                { id: 'infrastructure', label: 'Cloud Infrastructure', icon: Cloud },
                { id: 'security', label: 'Security & Access', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#0B7A3B] text-white shadow-xl shadow-emerald-500/20' 
                      : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[3rem] text-white relative overflow-hidden">
            <h4 className="text-lg font-black tracking-tight mb-2 relative z-10">System Uptime</h4>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">99.98% - High Performance</span>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-bold opacity-60">
                <span>Database Node 01</span>
                <span>Active</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold opacity-60">
                <span>Vite Edge Engine</span>
                <span>Active</span>
              </div>
            </div>
            <Cloud className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-8 space-y-12">
          {settingsGroups.map((group, i) => (
            <div key={i} className="space-y-6">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-4">{group.title}</h3>
              <div className="grid grid-cols-1 gap-4">
                {group.items.map((item, j) => (
                  <button key={j} className="flex items-center gap-6 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 hover:border-[#0B7A3B]/30 transition-all group text-left">
                    <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-[#0B7A3B]/10 transition-all">
                      <item.icon className="w-6 h-6 text-zinc-500 group-hover:text-[#0B7A3B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">{item.label}</h4>
                      <p className="text-sm text-zinc-500 font-medium">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-900 dark:text-white">Auto-Deployment Enabled</p>
                <p className="text-xs text-zinc-500 font-bold">Synchronizing changes to cloud clusters every 5 minutes.</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black shadow-lg">
              Check for Updates
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
