import React from 'react';
import { ShieldCheck, Plus, ArrowUpRight, ArrowDownLeft, Wallet, QrCode } from 'lucide-react';

interface WalletCardProps {
  walletBalance: number;
  escrowBalance: number;
  availableBalance: number;
  pendingBalance: number;
  rewardsBalance: number;
  onFundClick: () => void;
  onWithdrawClick: () => void;
  onTransferClick: () => void;
  onQrClick: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  walletBalance,
  escrowBalance,
  availableBalance,
  pendingBalance,
  rewardsBalance,
  onFundClick,
  onWithdrawClick,
  onTransferClick,
  onQrClick
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B7A3B] via-emerald-950 to-zinc-950 p-6 md:p-8 text-white shadow-2xl border border-emerald-500/30">
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-[#D4AF37]/40 text-[#F4D35E] text-[10px] font-bold tracking-wider uppercase">
                FindAba Secure Escrow & City Ledger
              </span>
              <span className="flex items-center gap-1 text-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Verified Account
              </span>
            </div>
            <p className="text-xs text-emerald-100 uppercase tracking-widest font-bold">Total Net Worth / Balance</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-1 text-white">₦{walletBalance.toLocaleString()}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onFundClick}
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#F4D35E] text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Fund
            </button>
            <button
              onClick={onWithdrawClick}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all backdrop-blur-md border border-white/20 flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </button>
            <button
              onClick={onTransferClick}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all backdrop-blur-md border border-white/20 flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" /> Transfer
            </button>
            <button
              onClick={onQrClick}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all backdrop-blur-md border border-white/20 flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-[#D4AF37]" /> QR Pay
            </button>
          </div>
        </div>

        {/* Breakdown subcards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-500/20">
          <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider block">Available</span>
            <span className="text-lg font-black text-white">₦{availableBalance.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">Escrow Locked</span>
            <span className="text-lg font-black text-white">₦{escrowBalance.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider block">Pending</span>
            <span className="text-lg font-black text-white">₦{pendingBalance.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider block">Rewards Points</span>
            <span className="text-lg font-black text-[#F4D35E]">{rewardsBalance.toLocaleString()} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
