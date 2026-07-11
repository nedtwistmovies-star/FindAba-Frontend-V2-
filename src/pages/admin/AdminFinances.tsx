import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  CreditCard,
  History,
  Download,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminFinances: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <AdminLayout title="Financial Control">
      <div className="space-y-8">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0B7A3B] p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Total Ecosystem Revenue</p>
              <h3 className="text-4xl font-black mt-2 tracking-tighter">₦{totalRevenue.toLocaleString()}</h3>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                <TrendingUp className="w-3 h-3" /> +12.4% vs last month
              </div>
            </div>
            <DollarSign className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Escrow Balance</p>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">₦2,450,000</h4>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Protection</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pending Payouts</p>
              <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">₦840,500</h4>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Processing (48h)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Merchant Commissions</p>
              <h4 className="text-2xl font-black text-[#0B7A3B] mt-1">₦154,200</h4>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Direct City Earnings</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <DataTable 
          title="City-wide Ledger"
          subtitle="Real-time stream of all financial activity across the platform."
          isLoading={isLoading}
          data={transactions}
          columns={[
            { 
              header: 'Transaction ID', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{String(item.id).slice(0, 8)}</span>
                </div>
              )
            },
            { 
              header: 'Amount', 
              accessor: (item: any) => (
                <span className={`font-black ${item.type === 'deposit' ? 'text-[#0B7A3B]' : 'text-rose-600'}`}>
                  {item.type === 'deposit' ? '+' : '-'} ₦{item.amount?.toLocaleString()}
                </span>
              )
            },
            { 
              header: 'Type', 
              accessor: (item: any) => (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                  {item.type}
                </span>
              )
            },
            { 
              header: 'Date & Time', 
              accessor: (item: any) => (
                <div className="text-xs font-bold text-zinc-500">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              )
            },
            {
              header: 'Status',
              accessor: (item: any) => (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                  Completed
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
