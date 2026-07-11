import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { 
  History, 
  Search, 
  Terminal, 
  User, 
  Monitor, 
  Globe, 
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAudit: React.FC = () => {
  const [isLoading] = useState(false);

  const mockAuditLogs = [
    { id: '1', admin: 'Admin Unit-01', action: 'Business Approved', entity: 'Enyimba Prime', time: '10:42 AM', ip: '192.168.1.4', device: 'macOS / Chrome' },
    { id: '2', admin: 'Admin Unit-01', action: 'City Alert Broadcast', entity: 'Weather Warning', time: '09:15 AM', ip: '192.168.1.4', device: 'macOS / Chrome' },
    { id: '3', admin: 'Moderator-04', action: 'Post Removed', entity: 'Community Post #82', time: '08:30 AM', ip: '41.203.71.12', device: 'Android / App' },
    { id: '4', admin: 'System', action: 'Automated Backup', entity: 'FindAba Database', time: '02:00 AM', ip: 'Internal', device: 'Cloud Engine' },
    { id: '5', admin: 'Finance-02', action: 'Withdrawal Approved', entity: '₦240,000', time: 'Yesterday', ip: '102.89.2.14', device: 'iOS / Safari' },
  ];

  return (
    <AdminLayout title="Audit Log">
      <div className="space-y-8">
        {/* Security Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <Lock className="w-10 h-10 mb-4 text-[#D4AF37]" />
              <h4 className="text-xl font-black tracking-tight">Security Integrity</h4>
              <p className="text-sm opacity-60 mt-2 font-medium">All administrative sessions are being monitored and logged.</p>
              <div className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Globe className="w-3 h-3" /> System Live
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Terminal className="w-3 h-3" /> Logs Active
                </div>
              </div>
            </div>
            <History className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Admin Actions (24h)</p>
            <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-2">1,240</h3>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-[#0B7A3B]" />
              </div>
              <span className="text-[10px] font-black text-[#0B7A3B]">85% Peak</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Suspicious Attempts</p>
            <h3 className="text-4xl font-black text-rose-600 mt-2">0</h3>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> All clear
            </div>
          </div>
        </div>

        {/* Search & Search Tools */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex-1">
            <Search className="w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by admin ID, action, or entity..." 
              className="bg-transparent border-none text-sm font-bold text-zinc-900 dark:text-white focus:outline-none w-full"
            />
          </div>
          <button className="px-8 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-xs font-black text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Custom Range
          </button>
        </div>

        {/* Audit Table */}
        <DataTable 
          title="Digital Footprint Trace"
          subtitle="A complete historical record of every administrative action within the FindAba OS."
          isLoading={isLoading}
          data={mockAuditLogs}
          columns={[
            { 
              header: 'Administrator', 
              accessor: (item) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <span className="font-black text-zinc-900 dark:text-white text-xs">{item.admin}</span>
                </div>
              )
            },
            { 
              header: 'Action', 
              accessor: (item) => (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {item.action}
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-300" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">{item.entity}</span>
                </div>
              )
            },
            { 
              header: 'Network Context', 
              accessor: (item) => (
                <div className="text-[10px]">
                  <p className="font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Monitor className="w-3 h-3" /> {item.device}
                  </p>
                  <p className="text-zinc-400 font-bold mt-0.5">{item.ip}</p>
                </div>
              )
            },
            { 
              header: 'Timestamp', 
              accessor: (item) => (
                <span className="text-xs font-bold text-zinc-400">
                  {item.time}
                </span>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
