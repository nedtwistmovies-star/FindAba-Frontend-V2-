import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  ShieldAlert, 
  MessageSquare, 
  Flag, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminModeration: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'archived'>('pending');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Fetching from a hypothetical 'moderation_reports' or similar
      // Since we can't create tables, we'll fetch 'posts' that might be flagged
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mocking flagged status for demonstration if not in schema
      const flaggedItems = data?.map(item => ({
        ...item,
        status: Math.random() > 0.7 ? 'flagged' : 'clear',
        report_reason: 'Potential inappropriate content',
        reporter: 'System Watchdog'
      })) || [];

      setReports(flaggedItems);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingReports = reports.filter(r => r.status === 'flagged');

  return (
    <AdminLayout title="Content Moderation">
      <div className="space-y-8">
        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
              <Flag className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Flags</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{pendingReports.length}</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Resolved Today</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">42</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Automated Clears</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">1,204</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 bg-zinc-50 text-zinc-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Moderator Active</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">4</h4>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-fit">
            {[
              { id: 'pending', label: 'Review Queue' },
              { id: 'resolved', label: 'Resolved Cases' },
              { id: 'archived', label: 'Archived' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
            <Filter className="w-4 h-4" /> Advanced Filters
          </button>
        </div>

        {/* Reports Table */}
        <DataTable 
          title="Citizen Safety Queue"
          subtitle="Content reported by users or flagged by FindAba OS AI for review."
          isLoading={isLoading}
          data={pendingReports}
          columns={[
            { 
              header: 'Content Type', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white text-xs">Community Post</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic truncate max-w-[200px]">
                      "{item.content?.slice(0, 30)}..."
                    </p>
                  </div>
                </div>
              )
            },
            { 
              header: 'Author', 
              accessor: (item: any) => (
                <div className="text-xs">
                  <p className="font-black text-zinc-700 dark:text-zinc-300">{item.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-[10px] text-zinc-400 font-bold">{item.profiles?.email}</p>
                </div>
              )
            },
            { 
              header: 'Reason', 
              accessor: (item: any) => (
                <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-black uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                  <AlertCircle className="w-3 h-3" /> {item.report_reason}
                </div>
              )
            },
            { 
              header: 'Reporter', 
              accessor: (item: any) => (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {item.reporter}
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all">
                    Keep
                  </button>
                  <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-all" title="Remove Content">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
