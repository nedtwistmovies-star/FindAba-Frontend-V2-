import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  Store, 
  CheckCircle2, 
  XCircle, 
  Star, 
  MapPin, 
  Search,
  ExternalLink,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(b => {
    if (filter === 'pending') return !b.is_verified;
    if (filter === 'verified') return b.is_verified;
    return true;
  });

  const toggleVerification = async (id: string, status: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_verified: status })
        .eq('id', id);

      if (error) throw error;
      fetchBusinesses(); // Refresh list
    } catch (error) {
      console.error('Error updating business status:', error);
    }
  };

  return (
    <AdminLayout title="Merchant Registry">
      <div className="space-y-8">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Merchants</p>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{businesses.length}</h4>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pending Verification</p>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {businesses.filter(b => !b.is_verified).length}
              </h4>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Filter className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Featured Slots</p>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">12 / 24</h4>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-fit">
          {[
            { id: 'all', label: 'All Merchants' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'verified', label: 'Verified' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === tab.id 
                  ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Businesses Table */}
        <DataTable 
          title="Merchant Inventory"
          subtitle="A comprehensive list of businesses integrated into FindAba OS."
          isLoading={isLoading}
          data={filteredBusinesses}
          columns={[
            { 
              header: 'Business Name', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    <Store className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white leading-tight">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" /> {item.market_zone || 'Unknown Zone'}
                    </p>
                  </div>
                </div>
              )
            },
            { 
              header: 'Category', 
              accessor: (item: any) => (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                  {item.category || 'General'}
                </span>
              )
            },
            { 
              header: 'Verification', 
              accessor: (item: any) => (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.is_verified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {item.is_verified ? 'Approved' : 'Pending'}
                </div>
              )
            },
            {
              header: 'Actions',
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleVerification(String(item.id), !item.is_verified); }}
                    className={`p-2 rounded-lg transition-all ${
                      item.is_verified ? 'hover:bg-rose-50 text-rose-600' : 'hover:bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {item.is_verified ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <button className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-all">
                    <Star className={`w-4 h-4 ${item.is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 hover:bg-zinc-100 rounded-lg transition-all">
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
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
