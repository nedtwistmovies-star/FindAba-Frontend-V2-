import React from 'react';
import { Store, ShieldCheck, ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessHeaderProps {
  businessName?: string;
  category?: string;
  verified?: boolean;
}

export const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  businessName = 'My Business',
  category = 'Merchant',
  verified = true
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 transition-colors"
          title="Back to OS"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">{businessName}</h1>
            {verified && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Merchant
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 capitalize">{category} Portal • FindAba OS V2</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-[#0B7A3B] text-white font-bold flex items-center justify-center text-sm shadow">
          {businessName.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
