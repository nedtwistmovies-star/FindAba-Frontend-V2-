import React from 'react';
import { 
  ShieldAlert, 
  Users, 
  Store, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle, 
  BarChart3,
  Eye,
  UserCheck,
  MoreVertical,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const AdminPage: React.FC = () => {
  const { businesses, products, posts } = useStore();

  const engagementData = [
    { name: 'Mon', engagement: 4000, growth: 2400 },
    { name: 'Tue', engagement: 3000, growth: 1398 },
    { name: 'Wed', engagement: 2000, growth: 9800 },
    { name: 'Thu', engagement: 2780, growth: 3908 },
    { name: 'Fri', engagement: 1890, growth: 4800 },
    { name: 'Sat', engagement: 2390, growth: 3800 },
    { name: 'Sun', engagement: 3490, growth: 4300 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">City Command Center</h1>
          <p className="text-sm text-zinc-500 font-medium">FindAba OS V2 Administrative & Moderation Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-[#0B7A3B] rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0B7A3B] rounded-full animate-pulse" />
            Live Operations
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Verified Businesses', value: businesses.length, icon: Store, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Community Posts', value: posts.length + 124, icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Digital Citizens', value: '45.2k', icon: Users, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
          { label: 'System Health', value: '99.9%', icon: ShieldAlert, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B7A3B] rounded-full -mr-48 -mt-48 blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter">Mazi Kalu AI City Insights</h3>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Real-time Sentiment & Performance Analysis</p>
              </div>
            </div>
            <button className="px-8 py-4 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
              <RotateCcw className="w-5 h-5" /> Generate Intelligence Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <div className="space-y-3">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">City Sentiment</p>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-medium leading-relaxed italic">
                  "Citizens are showing high enthusiasm for the upcoming Enyimba Trade Fair. Sentiment around logistics has improved by 14% following the new tracking updates."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black">85% Positive</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Business Performance</p>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-medium leading-relaxed italic">
                  "Leather sector in Ariaria is reaching peak demand. Inventory levels are dropping faster than last quarter. Recommended: Facilitate raw material supply."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] font-black">92% Capacity</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Community Needs</p>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-medium leading-relaxed italic">
                  "High volume of requests for expanded evening transport routes near Ekeoha Market. Residents are asking for more digital literacy workshops in community centers."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-black">URGENT: TRANSPORT</span>
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-black">NEED: EDUCATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              City Engagement <BarChart3 className="w-5 h-5 text-[#0B7A3B]" />
            </h3>
            <select className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0B7A3B]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B7A3B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0B7A3B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="engagement" stroke="#0B7A3B" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports & Moderation */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              Moderation <ShieldAlert className="w-5 h-5 text-rose-500" />
            </h3>
            <div className="space-y-4">
              {[
                { type: 'Spam', user: '@shop_34', count: 12, severity: 'High' },
                { type: 'Misleading', user: '@aba_express', count: 5, severity: 'Medium' },
                { type: 'Guidelines', user: '@p_leader', count: 2, severity: 'Low' },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${report.severity === 'High' ? 'bg-rose-500' : report.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                      <p className="text-xs font-black text-zinc-900 dark:text-white">{report.type}</p>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold mt-1">Target: {report.user}</p>
                  </div>
                  <button className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 rounded-xl transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-zinc-950 text-white rounded-2xl text-xs font-black shadow-lg">
              Review All Reports
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#0B7A3B] to-[#169C4A] rounded-[3rem] p-8 text-white shadow-xl shadow-emerald-500/20">
            <UserCheck className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-black mb-2">Merchant Verification</h3>
            <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">
              You have 14 pending business registration applications awaiting city official verification.
            </p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-xs font-black backdrop-blur-md transition-all">
              Go to Portal
            </button>
          </div>
        </div>
      </div>

      {/* Merchant Registry Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">Active Merchant Registry</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-600">Export PDF</button>
            <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-600">Print Registry</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Business Name</th>
                <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Market Zone</th>
                <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Growth</th>
                <th className="pb-4 text-right text-[10px] font-black text-zinc-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {businesses.map((biz) => (
                <tr key={biz.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={biz.image_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{biz.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-bold text-zinc-500">{biz.market_zone}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{Math.floor(Math.random() * 20) + 5}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
