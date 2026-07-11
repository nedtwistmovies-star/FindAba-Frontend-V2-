import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description?: string;
  color?: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple' | 'zinc';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  description,
  color = 'zinc'
}) => {
  const colors = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50',
    amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50',
    blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100/50',
    rose: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100/50',
    purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100/50',
    zinc: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-800'
  };

  const iconBg = {
    emerald: 'bg-emerald-500/10',
    amber: 'bg-amber-500/10',
    blue: 'bg-blue-500/10',
    rose: 'bg-rose-500/10',
    purple: 'bg-purple-500/10',
    zinc: 'bg-zinc-500/10'
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`p-6 bg-white dark:bg-zinc-900 border ${colors[color]} rounded-[2.5rem] shadow-sm relative overflow-hidden group`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-3 rounded-2xl ${iconBg[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${
            trend.isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
          }`}>
            {trend.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1 tracking-tighter">{value}</h3>
        {description && (
          <p className="text-[10px] text-zinc-500 font-bold mt-2 opacity-60">
            {description}
          </p>
        )}
      </div>

      {/* Decorative background shape */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${
        color === 'emerald' ? 'bg-emerald-500' : 
        color === 'amber' ? 'bg-amber-500' : 
        color === 'blue' ? 'bg-blue-500' : 
        color === 'rose' ? 'bg-rose-500' : 
        color === 'purple' ? 'bg-purple-500' : 'bg-zinc-500'
      }`} />
    </motion.div>
  );
};
