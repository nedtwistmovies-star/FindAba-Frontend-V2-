import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  MapPin, 
  TrendingUp, 
  Users, 
  Settings, 
  ShieldCheck, 
  Navigation,
  Clock,
  Wallet,
  Bell,
  MoreHorizontal,
  ChevronRight,
  Search,
  Filter,
  BarChart3,
  Globe,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
  Box,
  LayoutDashboard
} from 'lucide-react';
import { useTransportStore } from '../store/useTransportStore';

export const LogisticsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeShipments } = useTransportStore();
  
  const [activeTab, setActiveTab] = useState<'shipments' | 'fleet' | 'analytics'>('shipments');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Stats */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#0B7A3B]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0B7A3B] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black">Aba City Logistics Hub</h1>
            </div>
            <p className="text-slate-400 text-sm">Managing verified city & interstate commerce shipments</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/logistics')}
              className="px-6 py-3 bg-[#0B7A3B] hover:bg-[#169C4A] text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/40"
            >
              <Plus className="w-4 h-4" /> Book New Shipment
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 backdrop-blur transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {[
            { label: 'Active Shipments', value: '42', icon: Package, color: 'text-emerald-400' },
            { label: 'Fleet Online', value: '18 / 24', icon: Truck, color: 'text-blue-400' },
            { label: 'Revenue (MTD)', value: '₦840.5k', icon: Wallet, color: 'text-amber-400' },
            { label: 'Avg Delivery', value: '1.2 Days', icon: Clock, color: 'text-purple-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-black">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0 space-y-2">
          {[
            { id: 'shipments', label: 'Shipment Registry', icon: Box },
            { id: 'fleet', label: 'Fleet Management', icon: Truck },
            { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
            { id: 'tracking', label: 'Global Live Map', icon: Globe },
            { id: 'customers', label: 'Merchant Clients', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-900/20' 
                    : 'bg-white dark:bg-zinc-900 border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Pane */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 capitalize">
              {activeTab} Management
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tracking #, sender..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                />
              </div>
              <button className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-500">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-zinc-800/60 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Shipment Details</th>
                    <th className="px-6 py-4">Routes</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Assigned Unit</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {[
                    { id: 'LOG-882901', sender: 'Ariaria Leather Co.', receiver: 'Lagos Warehouse', type: 'Cargo', status: 'In Transit', driver: 'Chinedu Express', date: 'Jul 09, 14:20' },
                    { id: 'LOG-773124', sender: 'Ekeoha Fashion', receiver: 'Port Harcourt', type: 'Courier', status: 'Pending', driver: 'Unassigned', date: 'Jul 09, 15:05' },
                    { id: 'LOG-110293', sender: 'Aba Fabrication', receiver: 'Onitsha Market', type: 'Pickup', status: 'Delivered', driver: 'Musa Logistics', date: 'Jul 08, 11:45' },
                    { id: 'LOG-554201', sender: 'Binez Suites', receiver: 'GRA Aba', type: 'Express', status: 'Picked Up', driver: 'Uche Cargo', date: 'Jul 09, 13:10' },
                  ].map((shipment, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-sm text-[#0B7A3B] group-hover:underline cursor-pointer">{shipment.id}</p>
                          <p className="text-xs font-medium text-slate-900 dark:text-white mt-0.5">{shipment.sender}</p>
                          <p className="text-[10px] text-slate-400">{shipment.date}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[120px]">Aba Hub</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{shipment.receiver}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                          shipment.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                          shipment.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${shipment.driver === 'Unassigned' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                          <span className="text-xs font-medium">{shipment.driver}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-500">
              <p>Showing 4 of 42 active shipments</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">Prev</button>
                <button className="px-3 py-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">Next</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Attention Required
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-2xl flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">LOG-773124 Delayed</p>
                    <p className="text-[10px] text-slate-500">Awaiting pickup for over 2 hours at Faulks Road Hub.</p>
                  </div>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-2xl flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 flex-shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Route Blockage Alert</p>
                    <p className="text-[10px] text-slate-500">Congestion detected near Osisioma flyover. Rerouting active fleet.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0B7A3B] rounded-3xl p-6 text-white flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold">Upgrade Your Fleet</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Unlock interstate haulage permits and GPS container tracking by upgrading to the Platinum Business Plan.
                </p>
              </div>
              <button className="w-full py-3 bg-white text-[#0B7A3B] font-bold rounded-2xl text-xs mt-4 shadow-xl shadow-emerald-900/40">
                View Enterprise Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
