import React from 'react';
import { Download, FileText, Table, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ isOpen, onClose, title }) => {
  const formats = [
    { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'excel', label: 'Excel Spreadsheet', icon: Table, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'csv', label: 'CSV Raw Data', icon: Table, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'print', label: 'Printable Report', icon: Printer, color: 'text-zinc-500', bg: 'bg-zinc-50' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">Export Intelligence</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{title}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {formats.map((format) => (
                <button
                  key={format.id}
                  className="flex items-center gap-4 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
                >
                  <div className={`p-4 rounded-2xl ${format.bg} ${format.color}`}>
                    <format.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-black text-zinc-900 dark:text-white">{format.label}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Optimized for high-quality {format.id.toUpperCase()}</p>
                  </div>
                  <Download className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-all" />
                </button>
              ))}
            </div>

            <div className="mt-10 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">
                Reports are generated using real-time data snapshots from the FindAba OS Intelligence Engine. 
                Large datasets may take a few moments to process.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
