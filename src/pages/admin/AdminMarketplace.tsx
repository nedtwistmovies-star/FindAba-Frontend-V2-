import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  AlertCircle, 
  CheckCircle2,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

export const AdminMarketplace: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (full_name, email),
          businesses:business_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Marketplace Control">
      <div className="space-y-8">
        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Orders</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{orders.length}</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Gross Volume</p>
            <h4 className="text-2xl font-black text-[#0B7A3B] mt-1">
              ₦{orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0).toLocaleString()}
            </h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pending Fulfillment</p>
            <h4 className="text-2xl font-black text-amber-500 mt-1">
              {orders.filter(o => o.status === 'pending').length}
            </h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">City Commission</p>
            <h4 className="text-2xl font-black text-blue-500 mt-1">
              ₦{(orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0) * 0.05).toLocaleString()}
            </h4>
          </div>
        </div>

        {/* Orders Table */}
        <DataTable 
          title="Global Order Stream"
          subtitle="Real-time monitoring of all commercial transactions across Aba."
          isLoading={isLoading}
          data={orders}
          columns={[
            { 
              header: 'Order Details', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <Package className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white text-xs">#{item.id.slice(0, 8)}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.businesses?.name || 'Retail Merchant'}</p>
                  </div>
                </div>
              )
            },
            { 
              header: 'Customer', 
              accessor: (item: any) => (
                <div className="text-xs">
                  <p className="font-black text-zinc-700 dark:text-zinc-300">{item.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-[10px] text-zinc-400 font-bold">{item.profiles?.email}</p>
                </div>
              )
            },
            { 
              header: 'Amount', 
              accessor: (item: any) => (
                <span className="font-black text-zinc-900 dark:text-white">
                  ₦{item.total_price?.toLocaleString()}
                </span>
              )
            },
            { 
              header: 'Status', 
              accessor: (item: any) => (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                  item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {item.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {item.status}
                </div>
              )
            },
            {
              header: 'Logistics',
              accessor: (item: any) => (
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <Truck className="w-3 h-3" /> {item.delivery_status || 'Unassigned'}
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
