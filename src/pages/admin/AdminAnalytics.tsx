import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MetricCard } from '../../components/admin/MetricCard';
import { ChartPanel } from '../../components/analytics/ChartPanel';
import { InsightCard } from '../../components/analytics/InsightCard';
import { HeatMap } from '../../components/analytics/HeatMap';
import { 
  TrendingUp, 
  Users, 
  Store, 
  ShoppingBag, 
  Truck, 
  Hotel, 
  Zap,
  Activity,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ExportPanel } from '../../components/analytics/ExportPanel';
import { useState } from 'react';

const revenueData = [
  { name: 'Jan', revenue: 4500000, commission: 450000 },
  { name: 'Feb', revenue: 5200000, commission: 520000 },
  { name: 'Mar', revenue: 4800000, commission: 480000 },
  { name: 'Apr', revenue: 6100000, commission: 610000 },
  { name: 'May', revenue: 5900000, commission: 590000 },
  { name: 'Jun', revenue: 7200000, commission: 720000 },
];

const categoryData = [
  { name: 'Leather', value: 45 },
  { name: 'Fashion', value: 25 },
  { name: 'Hospitality', value: 15 },
  { name: 'Tech', value: 10 },
  { name: 'Food', value: 5 },
];

const activityHeatmap = [
  { x: 2, y: 3, value: 85, label: 'Ariaria Zone A' },
  { x: 2, y: 4, value: 92, label: 'Ariaria Zone B' },
  { x: 3, y: 3, value: 78, label: 'Ariaria Central' },
  { x: 5, y: 2, label: 'Ekeoha Market', value: 65 },
  { x: 7, y: 5, label: 'Cemetery Market', value: 45 },
  { x: 4, y: 7, label: 'C.Line', value: 55 },
  { x: 1, y: 8, label: 'Ngwa Road', value: 40 },
];

export const AdminAnalytics: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <AdminLayout title="City Intelligence Engine">
      <ExportPanel 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        title="City-Wide Economic Report" 
      />
      <div className="space-y-8 pb-12">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Economic Pulse</h2>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time indicators across all city sectors</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-all">
              <Calendar className="w-4 h-4" /> Last 30 Days
            </button>
            <button 
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#0B7A3B] text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" /> Export Intelligence
            </button>
          </div>
        </div>

        {/* Global Key Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Economic Activity" 
            value="₦42.4M" 
            icon={TrendingUp}
            trend={{ value: 14.2, isUp: true }}
            color="emerald"
            description="Total platform transaction volume"
          />
          <MetricCard 
            label="Citizen Growth" 
            value="45,231" 
            icon={Users}
            trend={{ value: 5.8, isUp: true }}
            color="blue"
            description="New registrations this month"
          />
          <MetricCard 
            label="Merchant Performance" 
            value="12,402" 
            icon={Store}
            trend={{ value: 2.1, isUp: true }}
            color="amber"
            description="Active verified businesses"
          />
          <MetricCard 
            label="Logistics Volume" 
            value="8,204" 
            icon={Truck}
            trend={{ value: 18.5, isUp: true }}
            color="purple"
            description="Successful city deliveries"
          />
        </div>

        {/* Main Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Growth */}
          <div className="lg:col-span-8">
            <ChartPanel 
              title="City Revenue Engine"
              subtitle="Platform Revenue vs City Commission Growth"
              type="area"
              data={revenueData}
              dataKeys={['revenue', 'commission']}
              colors={['#0B7A3B', '#D4AF37']}
            />
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <InsightCard 
              type="opportunity"
              title="Leather Sector Demand Spike"
              description="Data shows a 24% increase in searches for 'wholesale boots' from northern regions. Recommend featuring more Ariaria Zone A merchants."
            />
            <InsightCard 
              type="growth"
              title="Hospitality Conversion High"
              description="Hotel bookings in G.R.A. are peaking on weekends. Conversion rate is up to 12%. Opportunity for weekend 'City Experience' packages."
            />
          </div>
        </div>

        {/* Secondary Intelligence Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <HeatMap 
            title="Business District Activity"
            data={activityHeatmap}
          />
          
          <div className="lg:col-span-1">
            <ChartPanel 
              title="Market Segmentation"
              subtitle="Distribution of businesses by core sector"
              type="pie"
              data={categoryData}
              dataKeys={['value']}
              colors={['#0B7A3B', '#3B82F6', '#D4AF37', '#8B5CF6', '#F43F5E']}
            />
          </div>

          <div className="lg:col-span-1 bg-gradient-to-br from-zinc-900 to-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B7A3B] rounded-full -mr-48 -mt-48 blur-[120px] opacity-20" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                  <Zap className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter leading-tight">Predictive Growth</h3>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Mazi Kalu Forecast Model</p>
                </div>
              </div>

              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold opacity-70">Next Month Projection</span>
                  <span className="text-sm font-black text-emerald-400">+12.4%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
                <p className="text-[10px] font-medium leading-relaxed opacity-60">
                  High confidence model based on previous 12-month transaction cycles and current seasonal trends.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Demand Spikes Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {['School Shoes', 'Market Umbrellas', 'Generator Repairs', 'Power Banks'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartPanel 
            title="Transport vs Logistics Performance"
            subtitle="Successful rides vs deliveries completed (Daily)"
            type="bar"
            data={[
              { name: 'Mon', rides: 420, logistics: 310 },
              { name: 'Tue', rides: 380, logistics: 290 },
              { name: 'Wed', rides: 450, logistics: 340 },
              { name: 'Thu', rides: 410, logistics: 380 },
              { name: 'Fri', rides: 590, logistics: 420 },
              { name: 'Sat', rides: 680, logistics: 350 },
              { name: 'Sun', rides: 350, logistics: 180 },
            ]}
            dataKeys={['rides', 'logistics']}
            colors={['#3B82F6', '#8B5CF6']}
          />

          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter mb-8">Search Intelligence</h3>
            <div className="space-y-8">
              {[
                { label: 'Popular Search Gaps', value: 'High Demand / Low Supply', color: 'text-amber-500' },
                { label: 'Top Trending Business', value: 'Prime Leather Artisans', color: 'text-[#0B7A3B]' },
                { label: 'Search to Order Ratio', value: '18.4%', color: 'text-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</p>
                    <p className={`text-lg font-black mt-1 ${item.color}`}>{item.value}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-zinc-100 transition-all">
                    <Activity className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
