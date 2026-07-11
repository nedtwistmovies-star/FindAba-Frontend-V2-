import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { User, ShieldCheck, ShieldAlert, UserMinus, UserCheck, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real app, we'd fetch from profiles or auth users if permitted
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Digital Citizens">
      <div className="space-y-8">
        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex-1 max-w-xl">
            <Search className="w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or citizen ID..." 
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-zinc-900 dark:text-white focus:outline-none w-full"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-black shadow-lg transition-all hover:scale-105 active:scale-95">
              Broadcast Message
            </button>
          </div>
        </div>

        {/* Users Table */}
        <DataTable 
          title="Citizen Registry"
          subtitle="Complete list of all registered users in the FindAba ecosystem."
          isLoading={isLoading}
          data={filteredUsers}
          columns={[
            { 
              header: 'Citizen', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    <User className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white leading-tight">{item.name || 'Anonymous'}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.email || 'No Email'}</p>
                  </div>
                </div>
              )
            },
            { 
              header: 'Account Status', 
              accessor: (item: any) => (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.verified ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                  {item.verified ? 'Verified' : 'Pending'}
                </div>
              )
            },
            { 
              header: 'Role', 
              accessor: (item: any) => (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {item.role || 'Citizen'}
                </span>
              )
            },
            { 
              header: 'Joined', 
              accessor: (item: any) => (
                <span className="text-zinc-500 font-bold">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all" title="Approve Verification">
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-all" title="Suspend Account">
                    <UserMinus className="w-4 h-4" />
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
