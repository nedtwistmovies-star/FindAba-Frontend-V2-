import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  Hotel, 
  Bed, 
  Calendar, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  TrendingUp
} from 'lucide-react';

export const AdminHotels: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Hospitality Control">
      <div className="space-y-8">
        {/* Hospitality Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Properties</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{hotels.length}</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Rooms</p>
            <h4 className="text-2xl font-black text-blue-500 mt-1">1,240</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Avg. Occupancy</p>
            <h4 className="text-2xl font-black text-emerald-500 mt-1">78%</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Booking Volume</p>
            <h4 className="text-2xl font-black text-[#D4AF37] mt-1">42 / day</h4>
          </div>
        </div>

        {/* Hotels Table */}
        <DataTable 
          title="Property Inventory"
          subtitle="Management of all hospitality providers registered in FindAba OS."
          isLoading={isLoading}
          data={hotels}
          columns={[
            { 
              header: 'Property', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white leading-tight">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" /> {item.location || 'Aba City'}
                    </p>
                  </div>
                </div>
              )
            },
            { 
              header: 'Rating', 
              accessor: (item: any) => (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black">{item.rating || '4.5'}</span>
                </div>
              )
            },
            { 
              header: 'Inventory', 
              accessor: (item: any) => (
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <Bed className="w-3 h-3" /> {item.available_rooms || 12} / {item.total_rooms || 20} Rooms
                </div>
              )
            },
            { 
              header: 'Status', 
              accessor: (item: any) => (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {item.is_active ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {item.is_active ? 'Operational' : 'Maintenance'}
                </div>
              )
            },
            {
              header: 'Avg. Nightly',
              accessor: (item: any) => (
                <span className="font-black text-zinc-900 dark:text-white">₦{item.base_price?.toLocaleString() || '15,000'}</span>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
