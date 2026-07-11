import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb, Zap, TrendingUp } from 'lucide-react';

interface InsightCardProps {
  type: 'growth' | 'efficiency' | 'opportunity' | 'warning';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  type,
  title,
  description,
  actionLabel = 'Explore Strategy',
  onAction
}) => {
  const styles = {
    growth: {
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      gradient: 'from-emerald-500/10'
    },
    efficiency: {
      icon: Zap,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/30',
      gradient: 'from-blue-500/10'
    },
    opportunity: {
      icon: Lightbulb,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/30',
      gradient: 'from-amber-500/10'
    },
    warning: {
      icon: Zap,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-100 dark:border-rose-900/30',
      gradient: 'from-rose-500/10'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border ${style.border} shadow-sm relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} to-transparent opacity-50`} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-2xl ${style.bg} ${style.color}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Mazi Kalu AI Insight</p>
            <h4 className={`text-sm font-black ${style.color} uppercase`}>{type} strategy</h4>
          </div>
        </div>

        <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter mb-3">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8">
          {description}
        </p>

        <button
          onClick={onAction}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all ${
            type === 'warning' ? 'bg-rose-600 text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
          } hover:scale-105 active:scale-95 shadow-lg shadow-black/10`}
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <Icon className={`absolute -right-8 -bottom-8 w-48 h-48 ${style.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
    </motion.div>
  );
};
