import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { supabase } from '../../lib/supabase';
import { 
  Truck, 
  MapPin, 
  User, 
  Navigation, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';

export const AdminTransport: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      // Fetching from a hypothetical 'trips' or 'rides' table
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          profiles:user_id (full_name),
          drivers:driver_id (full_name, vehicle_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Transport Control">
      <div className="space-y-8">
        {/* Fleet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Trips</p>
            <h4 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
              {trips.filter(t => t.status === 'active').length}
            </h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Available Drivers</p>
            <h4 className="text-2xl font-black text-emerald-500 mt-1">124</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Daily Revenue</p>
            <h4 className="text-2xl font-black text-[#D4AF37] mt-1">₦420,500</h4>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fleet Efficiency</p>
            <h4 className="text-2xl font-black text-blue-500 mt-1">94%</h4>
          </div>
        </div>

        {/* Trips Table */}
        <DataTable 
          title="City Transit Monitor"
          subtitle="Live tracking of ride requests and completed trips across the city."
          isLoading={isLoading}
          data={trips}
          columns={[
            { 
              header: 'Trip ID', 
              accessor: (item: any) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="font-black text-zinc-900 dark:text-white text-xs">#{item.id.slice(0, 8)}</span>
                </div>
              )
            },
            { 
              header: 'Citizen / Driver', 
              accessor: (item: any) => (
                <div className="text-xs">
                  <p className="font-black text-zinc-700 dark:text-zinc-300">{item.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Truck className="w-3 h-3" /> {item.drivers?.full_name || 'Searching...'}
                  </p>
                </div>
              )
            },
            { 
              header: 'Route', 
              accessor: (item: any) => (
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" /> {item.pickup_location?.slice(0, 20)}...
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-500" /> {item.destination_location?.slice(0, 20)}...
                  </div>
                </div>
              )
            },
            { 
              header: 'Status', 
              accessor: (item: any) => (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                  item.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {item.status}
                </div>
              )
            },
            {
              header: 'Fare',
              accessor: (item: any) => (
                <span className="font-black text-[#0B7A3B]">₦{item.fare?.toLocaleString()}</span>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
};
