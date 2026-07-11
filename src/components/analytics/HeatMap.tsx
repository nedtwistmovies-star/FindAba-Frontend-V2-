import React from 'react';
import { motion } from 'framer-motion';

interface HeatMapProps {
  title: string;
  data: { x: number; y: number; value: number; label?: string }[];
  gridSize?: number;
}

export const HeatMap: React.FC<HeatMapProps> = ({ title, data, gridSize = 10 }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="mb-8">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">{title}</h3>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Density distribution across the city grid</p>
      </div>

      <div className="aspect-square relative bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] p-4 border border-zinc-100 dark:border-zinc-900 overflow-hidden">
        {/* Simulating a grid of the city */}
        <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => {
            const x = i % 10;
            const y = Math.floor(i / 10);
            const point = data.find(d => d.x === x && d.y === y);
            const intensity = point ? point.value / maxVal : 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.002 }}
                className="relative group"
              >
                <div 
                  className="w-full h-full rounded-md transition-all duration-500"
                  style={{ 
                    backgroundColor: intensity > 0 
                      ? `rgba(11, 122, 59, ${intensity * 0.9 + 0.1})` 
                      : 'rgba(161, 161, 170, 0.05)'
                  }}
                />
                {point && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-black rounded-lg whitespace-nowrap shadow-xl">
                      {point.label || 'Zone'}: {point.value} active
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1].map(lvl => (
              <div key={lvl} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(11, 122, 59, ${lvl})` }} />
            ))}
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Density</span>
        </div>
      </div>
    </div>
  );
};
