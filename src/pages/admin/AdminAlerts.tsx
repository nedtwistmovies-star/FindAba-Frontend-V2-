import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  Info, 
  Megaphone, 
  Clock, 
  Users,
  Target,
  ShieldAlert,
  Search,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminAlerts: React.FC = () => {
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'emergency'>('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'merchants' | 'drivers'>('all');
  const [isSending, setIsSending] = useState(false);

  const pastAlerts = [
    { id: '1', title: 'Traffic Update: Ariaria Market', type: 'warning', time: '2 hours ago', reach: '4.2k citizens' },
    { id: '2', title: 'System Maintenance Scheduled', type: 'info', time: 'Yesterday', reach: '12k citizens' },
    { id: '3', title: 'Emergency: Heavy Rainfall Alert', type: 'emergency', time: '2 days ago', reach: '15k citizens' },
  ];

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setTitle('');
      setMessage('');
      alert('Alert broadcasted to the city grid!');
    }, 1500);
  };

  return (
    <AdminLayout title="City Alerts">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Composer */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
                <Megaphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">Compose City Alert</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Broadcast to all citizen devices</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Alert Category</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'info', label: 'Public Notice', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'warning', label: 'Market Alert', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { id: 'emergency', label: 'Emergency', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setAlertType(cat.id as any)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        alertType === cat.id 
                          ? `border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800` 
                          : 'border-transparent bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${cat.bg} ${cat.color}`}>
                        <cat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-zinc-900 dark:text-white">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Alert Title</p>
                <input 
                  type="text" 
                  value={title || ''}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Traffic Diversion at Osisioma Flyover..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#0B7A3B] transition-all"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Alert Message</p>
                <textarea 
                  rows={4}
                  value={message || ''}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide detailed information for the citizens..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-3xl px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#0B7A3B] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Target Audience</p>
                  <div className="flex gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                    {[
                      { id: 'all', label: 'All Citizens', icon: Users },
                      { id: 'merchants', label: 'Merchants', icon: Target },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setTargetAudience(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${
                          targetAudience === tab.id ? 'bg-white dark:bg-zinc-900 shadow-sm text-[#0B7A3B]' : 'text-zinc-500'
                        }`}
                      >
                        <tab.icon className="w-3 h-3" /> {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={handleSend}
                    disabled={isSending || !title || !message}
                    className="w-full h-14 bg-[#0B7A3B] hover:bg-[#169C4A] disabled:opacity-50 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
                  >
                    {isSending ? <Clock className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSending ? 'Broadcasting...' : 'Broadcast Alert'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm h-full">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <History className="w-4 h-4 text-[#D4AF37]" /> Alert History
            </h3>

            <div className="space-y-6">
              {pastAlerts.map((alert) => (
                <div key={alert.id} className="p-5 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700/50 group hover:border-[#0B7A3B]/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'emergency' ? 'bg-rose-50 text-rose-600' :
                      alert.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold">{alert.time}</span>
                  </div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white mt-4">{alert.title}</h4>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500">
                      <Users className="w-3 h-3" /> Reach: {alert.reach}
                    </div>
                    <button className="text-[10px] font-black text-[#0B7A3B] opacity-0 group-hover:opacity-100 transition-opacity">
                      Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-[10px] font-black text-zinc-400 hover:border-[#0B7A3B] hover:text-[#0B7A3B] transition-all uppercase tracking-widest">
              View Archive
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
