import React from 'react';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Truck,
  ArrowUpRight,
  Zap,
  Activity,
  History
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MetricCard } from '../../components/admin/MetricCard';
import { DataTable } from '../../components/admin/DataTable';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { useDashboardStats } from '../../services/supabaseService';

const data = [
  { name: 'Mon', revenue: 4000, users: 2400 },
  { name: 'Tue', revenue: 3000, users: 1398 },
  { name: 'Wed', revenue: 2000, users: 9800 },
  { name: 'Thu', revenue: 2780, users: 3908 },
  { name: 'Fri', revenue: 1890, users: 4800 },
  { name: 'Sat', revenue: 2390, users: 3800 },
  { name: 'Sun', revenue: 3490, users: 4300 },
];

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const recentActivities = (stats?.recentOrders || []).map((order: any) => ({
    id: order.id,
    user: order.buyer_name,
    action: `Order ${order.status}`,
    time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: order.status === 'Completed' || order.status === 'Paid' ? 'success' : 'info'
  }));

  if (recentActivities.length === 0 && !isLoading) {
    recentActivities.push({ id: '0', user: 'System', action: 'No recent orders', time: 'Now', status: 'info' });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <AdminLayout title="Command Center">
      <div className="space-y-8">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Total Citizens" 
            value={isLoading ? '...' : (stats?.communityMembers?.toLocaleString() || '0')} 
            icon={Users} 
            trend={{ value: 12, isUp: true }}
            color="blue"
          />
          <MetricCard 
            label="Verified Businesses" 
            value={isLoading ? '...' : (stats?.verifiedBusinesses?.toLocaleString() || '0')} 
            icon={Store} 
            trend={{ value: 5, isUp: true }}
            color="emerald"
          />
          <MetricCard 
            label="Total Revenue" 
            value={isLoading ? '...' : formatCurrency((stats?.successfulDeliveries || 0) * 15000)} // Rough estimate for demo
            icon={Wallet} 
            trend={{ value: 8, isUp: true }}
            color="amber"
          />
          <MetricCard 
            label="System Health" 
            value="99.9%" 
            icon={Zap} 
            trend={{ value: 0, isUp: true }}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">City Growth Engine</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Revenue vs User Growth (7 Days)</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-[10px] font-black">
                  <div className="w-2 h-2 bg-[#0B7A3B] rounded-full" /> Revenue
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-[10px] font-black">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" /> Users
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B7A3B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0B7A3B" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '1.5rem', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: '700'
                    }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0B7A3B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden relative">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter mb-8 flex items-center gap-2">
              <History className="w-6 h-6 text-[#D4AF37]" /> Pulse Monitor
            </h3>
            
            <div className="space-y-6">
              {recentActivities.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative group">
                  {i !== recentActivities.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-zinc-100 dark:bg-zinc-800" />
                  )}
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-white dark:border-zinc-900 z-10 ${
                    activity.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                    activity.status === 'warning' ? 'bg-rose-50 text-rose-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-zinc-900 dark:text-white">{activity.action}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-xs font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all uppercase tracking-widest">
              View Full Audit Trail
            </button>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-500/20 group cursor-pointer relative overflow-hidden">
            <div className="relative z-10">
              <ShieldCheck className="w-10 h-10 mb-4 text-emerald-200" />
              <h4 className="text-xl font-black tracking-tight">Merchant Approvals</h4>
              <p className="text-sm opacity-80 mt-2 font-medium">12 businesses pending verification in Ariaria Zone.</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black">
                Review Queue <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-[#D4AF37] to-amber-700 p-8 rounded-[3rem] text-white shadow-xl shadow-amber-500/20 group cursor-pointer relative overflow-hidden">
            <div className="relative z-10">
              <AlertCircle className="w-10 h-10 mb-4 text-amber-200" />
              <h4 className="text-xl font-black tracking-tight">City Alerts</h4>
              <p className="text-sm opacity-80 mt-2 font-medium">Broadcast emergency weather or traffic notices to all users.</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black">
                Compose Alert <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[3rem] text-white shadow-xl shadow-blue-500/20 group cursor-pointer relative overflow-hidden">
            <div className="relative z-10">
              <Truck className="w-10 h-10 mb-4 text-blue-200" />
              <h4 className="text-xl font-black tracking-tight">Fleet Monitor</h4>
              <p className="text-sm opacity-80 mt-2 font-medium">24 active dispatches across 4 logistics companies.</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black">
                Live Tracking <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Detailed Data Tables (Mini version) */}
        <div className="grid grid-cols-1 gap-8">
          <DataTable<{ id: string; name: string; zone: string; orders: number; revenue: string }> 
            title="Operational High-Volume Merchants"
            subtitle="Top performing businesses in the FindAba ecosystem."
            isLoading={isLoading}
            data={(stats?.topBusinesses || []).map((biz: any) => ({
              id: biz.id,
              name: biz.name,
              zone: biz.market_zone || biz.address || 'Aba',
              orders: biz.reviews_count || 0,
              revenue: 'Live'
            }))}
            columns={[
              { header: 'Business Name', accessor: 'name' },
              { header: 'Market Zone', accessor: 'zone' },
              { header: 'Engagement', accessor: 'orders' },
              { header: 'Revenue', accessor: 'revenue', className: 'text-[#0B7A3B]' },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
};
