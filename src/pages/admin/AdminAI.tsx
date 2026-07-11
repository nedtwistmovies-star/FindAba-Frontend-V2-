import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDashboardStats } from '../../services/supabaseService';
import { 
  Sparkles, 
  MessageSquare, 
  Brain, 
  Zap, 
  ShieldCheck, 
  Activity,
  Search,
  Settings,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAI: React.FC = () => {
  const { data: stats } = useDashboardStats();
  const [activeTab, setActiveTab] = useState<'conversations' | 'performance' | 'tuning'>('conversations');

  const conversations = [
    { id: '1', user: 'Chinedu O.', query: 'Where can I find quality leather boots?', response: 'Suggested Ariaria Zone A merchants...', satisfaction: 'high', time: '2 mins ago' },
    { id: '2', user: 'Amaka E.', query: 'Best hotels in G.R.A. for business trip?', response: 'Recommended Aba Central and Luxury Suites...', satisfaction: 'neutral', time: '15 mins ago' },
    { id: '3', user: 'Ibrahim K.', query: 'How to register my logistics company?', response: 'Guided to the Business Registration wizard...', satisfaction: 'high', time: '1 hour ago' },
  ];

  return (
    <AdminLayout title="Mazi Kalu AI Control">
      <div className="space-y-8">
        {/* AI Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-zinc-950 text-white p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Sessions</p>
              <h4 className="text-3xl font-black mt-2 tracking-tighter">{(stats?.communityMembers || 0) * 2 + 15}</h4>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-400">
                <Activity className="w-3 h-3" /> Real-time active
              </div>
            </div>
            <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Avg. Accuracy</p>
            <h4 className="text-2xl font-black text-[#0B7A3B] mt-1">96.8%</h4>
            <p className="text-[10px] text-zinc-500 font-bold mt-2">Based on user feedback</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Token Efficiency</p>
            <h4 className="text-2xl font-black text-blue-500 mt-1">92%</h4>
            <p className="text-[10px] text-zinc-500 font-bold mt-2">Cost-optimized routing</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Intelligence Latency</p>
            <h4 className="text-2xl font-black text-amber-500 mt-1">1.2s</h4>
            <p className="text-[10px] text-zinc-500 font-bold mt-2">Sub-second processing target</p>
          </div>
        </div>

        {/* Controls Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-fit">
          {[
            { id: 'conversations', label: 'Live Conversations', icon: MessageSquare },
            { id: 'performance', label: 'Intelligence Performance', icon: Activity },
            { id: 'tuning', label: 'Neural Tuning', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg' 
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'conversations' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Intelligence Stream</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Live monitoring of Mazi Kalu AI interactions</p>
              </div>
              <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl">
                <Search className="w-4 h-4 text-zinc-400" />
                <input type="text" placeholder="Search logs..." className="bg-transparent border-none text-xs font-bold focus:outline-none" />
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {conversations.map((conv) => (
                <div key={conv.id} className="p-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-zinc-900 dark:text-white">{conv.user}</span>
                        <span className="text-[10px] font-bold text-zinc-400">• {conv.time}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        conv.satisfaction === 'high' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-500'
                      }`}>
                        {conv.satisfaction} Satisfaction
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-black text-zinc-400 uppercase mt-1">User:</span>
                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{conv.query}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase mt-1">Kalu:</span>
                        <p className="text-sm font-medium text-zinc-500 leading-relaxed italic">{conv.response}</p>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 h-fit hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-all self-center">
                    <TrendingUp className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <button className="text-xs font-black text-[#0B7A3B] uppercase tracking-widest hover:underline">
                View All Intelligence Logs
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tuning' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight mb-8">System Personality</h3>
              <div className="space-y-6">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Knowledge Density</p>
                    <span className="text-xs font-black text-[#0B7A3B]">Optimized</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#0B7A3B]" />
                  </div>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Street-Smart Context</p>
                    <span className="text-xs font-black text-[#D4AF37]">Active</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#D4AF37]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight mb-8">Safety Guards</h3>
              <div className="space-y-4">
                {[
                  { label: 'Market Policy Enforcement', status: 'Active' },
                  { label: 'Citizen Privacy Protocol', status: 'Strict' },
                  { label: 'Business Verification Check', status: 'Required' },
                  { label: 'Content Moderation Layer', status: 'Active' },
                ].map((guard, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{guard.label}</span>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{guard.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
