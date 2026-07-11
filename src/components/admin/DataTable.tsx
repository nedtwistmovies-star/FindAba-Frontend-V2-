import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreVertical, Filter, Download } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  subtitle?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  title, 
  subtitle,
  onRowClick,
  isLoading 
}: DataTableProps<T>) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {(title || subtitle) && (
        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-500 font-medium">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-all border border-zinc-100 dark:border-zinc-800">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-all border border-zinc-100 dark:border-zinc-800">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
              {columns.map((col, i) => (
                <th key={i} className={`px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest ${col.className}`}>
                  {col.header}
                </th>
              ))}
              <th className="px-8 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-8 py-6">
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-2/3" />
                    </td>
                  ))}
                  <td className="px-8 py-6"></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-8 py-20 text-center">
                  <p className="text-sm font-bold text-zinc-400">No records found in the city grid.</p>
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onRowClick?.(item)}
                  className={`group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, j) => (
                    <td key={j} className={`px-8 py-5 text-sm font-bold text-zinc-900 dark:text-zinc-100 ${col.className}`}>
                      {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  <td className="px-8 py-5">
                    <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4 text-zinc-400" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <p className="text-xs font-bold text-zinc-500">
          Showing <span className="text-zinc-900 dark:text-white">{data.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-xs font-black text-zinc-500 hover:text-[#0B7A3B] disabled:opacity-50 flex items-center gap-1 transition-all">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-[#0B7A3B] text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 text-xs font-black text-zinc-500 hover:text-[#0B7A3B] disabled:opacity-50 flex items-center gap-1 transition-all">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
