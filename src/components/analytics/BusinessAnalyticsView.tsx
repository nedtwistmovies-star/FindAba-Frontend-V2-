import React from 'react';
import { 
  TrendingUp, 
  Eye, 
  MousePointer2, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Search,
  Users,
  ShoppingBag,
  Zap,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MetricCard } from '../../components/admin/MetricCard';
import { ChartPanel } from '../../components/analytics/ChartPanel';
import { InsightCard } from '../../components/analytics/InsightCard';
import { ExportPanel } from './ExportPanel';
import { useState } from 'react';

const performanceData = [
  { name: 'Mon', views: 120, clicks: 45 },
  { name: 'Tue', views: 150, clicks: 52 },
  { name: 'Wed', views: 130, clicks: 48 },
  { name: 'Thu', views: 180, clicks: 64 },
  { name: 'Fri', views: 240, clicks: 92 },
  { name: 'Sat', views: 320, clicks: 124 },
  { name: 'Sun', views: 210, clicks: 75 },
];

export const BusinessAnalyticsView: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ExportPanel 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        title="Business Performance Report" 
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Business Growth Engine</h2>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Analyze your digital footprint in Aba</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-all"
          >
            Export Data
          </button>
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-full text-[10px] font-black text-[#0B7A3B] uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
            Performance: High
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Profile Views" 
          value="1,452" 
          icon={Eye}
          trend={{ value: 12, isUp: true }}
          color="blue"
        />
        <MetricCard 
          label="Total Interactions" 
          value="482" 
          icon={MousePointer2}
          trend={{ value: 8, isUp: true }}
          color="emerald"
        />
        <MetricCard 
          label="New Leads" 
          value="24" 
          icon={MessageSquare}
          trend={{ value: 15, isUp: true }}
          color="amber"
        />
        <MetricCard 
          label="Sales Volume" 
          value="₦245k" 
          icon={ShoppingBag}
          trend={{ value: 5, isUp: true }}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interaction Chart */}
        <div className="lg:col-span-8">
          <ChartPanel 
            title="Profile Visibility"
            subtitle="Views vs Direct Interactions (7 Days)"
            type="area"
            data={performanceData}
            dataKeys={['views', 'clicks']}
            colors={['#0B7A3B', '#3B82F6']}
          />
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <InsightCard 
            type="growth"
            title="Optimize Your Gallery"
            description="Businesses with 10+ high-quality product images see a 40% higher conversion rate. Add more photos of your latest leather designs."
          />
          <InsightCard 
            type="opportunity"
            title="Peak Traffic Alert"
            description="Your profile sees the highest traffic on Saturdays between 2 PM and 5 PM. Consider posting a new 'Story' during this window."
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Customer Actions
          </h3>
          <div className="space-y-6">
            {[
              { label: 'WhatsApp Clicks', value: 124, icon: Phone, color: 'text-emerald-500' },
              { label: 'Directions Requested', value: 86, icon: MapPin, color: 'text-blue-500' },
              { label: 'Profile Shared', value: 42, icon: Users, color: 'text-purple-500' },
            ].map((action, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 ${action.color}`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-500">{action.label}</span>
                </div>
                <span className="text-sm font-black text-zinc-900 dark:text-white">{action.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <ChartPanel 
            title="Weekly Order Trends"
            subtitle="Comparing volume against market average"
            type="bar"
            data={[
              { name: 'Mon', self: 12, market: 15 },
              { name: 'Tue', self: 15, market: 18 },
              { name: 'Wed', self: 10, market: 12 },
              { name: 'Thu', self: 22, market: 20 },
              { name: 'Fri', self: 35, market: 30 },
              { name: 'Sat', self: 48, market: 42 },
              { name: 'Sun', self: 20, market: 25 },
            ]}
            dataKeys={['self', 'market']}
            colors={['#0B7A3B', '#E2E8F0']}
          />
        </div>
      </div>
    </div>
  );
};
