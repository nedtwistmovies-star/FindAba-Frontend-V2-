import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Download, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Printer, 
  Share2, 
  Check, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  Building2,
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWalletTransactionsQuery } from '../services/supabaseService';
import { WalletCard } from '../components/wallet/WalletCard';
import { FundWalletModal } from '../components/wallet/FundWalletModal';
import { WithdrawModal } from '../components/wallet/WithdrawModal';
import { TransferModal } from '../components/wallet/TransferModal';
import { QrModal } from '../components/wallet/QrModal';
import { WalletTransaction } from '../types';

export const WalletPage: React.FC = () => {
  const { data: dbTransactions = [], isLoading, error } = useWalletTransactionsQuery();
  const { walletBalance, escrowBalance, transactions } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  // Modals state
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const allTransactions = [...transactions, ...dbTransactions];

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const availableBalance = walletBalance;
  const pendingBalance = 0; // Future: Calculate pending payouts
  const rewardsBalance = 0; // Future: Add rewards system

  return (
    <div className="space-y-8 pb-20">
      <div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold inline-block mb-2">
          FindAba OS V2 Financial Infrastructure
        </span>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">City Wallet & Secure Escrow Ledger</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Powering instant city-wide payments, merchant settlements, escrow protection, and digital receipts.</p>
      </div>

      {/* Main Wallet Card */}
      <WalletCard
        walletBalance={walletBalance + escrowBalance}
        escrowBalance={escrowBalance}
        availableBalance={availableBalance}
        pendingBalance={pendingBalance}
        rewardsBalance={rewardsBalance}
        onFundClick={() => setIsFundOpen(true)}
        onWithdrawClick={() => setIsWithdrawOpen(true)}
        onTransferClick={() => setIsTransferOpen(true)}
        onQrClick={() => setIsQrOpen(true)}
      />

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Monthly Inflow</span>
            <span className="text-xs font-bold text-[#0B7A3B]">+24%</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white">₦485,000</h3>
          <span className="text-[11px] text-zinc-500 mt-1 block">From marketplace sales & transfers</span>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Escrow Protection</span>
            <span className="text-xs font-bold text-amber-500">2 Active</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white">₦{escrowBalance.toLocaleString()}</h3>
          <span className="text-[11px] text-zinc-500 mt-1 block">Locked until delivery confirmation</span>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Loyalty Points</span>
            <span className="text-xs font-bold text-[#D4AF37]">₦1,250 Value</span>
          </div>
          <h3 className="text-2xl font-black text-[#D4AF37]">{rewardsBalance.toLocaleString()} pts</h3>
          <span className="text-[11px] text-zinc-500 mt-1 block">Convertible to wallet credit</span>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {['all', 'credit', 'debit'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterType(st)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  filterType === st ? 'bg-[#0B7A3B] text-white shadow' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {st} Transactions
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search reference or title..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Unable to connect to Supabase database. Showing offline ledger state.</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B]" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <Wallet className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No transactions found</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-[#0B7A3B] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                    tx.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A3B]' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{tx.title}</h4>
                    <p className="text-[11px] text-zinc-400 font-mono">{tx.reference} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-black text-sm block ${tx.type === 'credit' ? 'text-[#0B7A3B] dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0B7A3B] dark:bg-emerald-950/50 uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6">
            <button onClick={() => setSelectedTx(null)} className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0B7A3B]/10 text-[#0B7A3B] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">FindAba Digital Receipt</h2>
              <span className="font-mono text-xs text-[#0B7A3B] font-bold block">{selectedTx.reference}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                <span className="text-zinc-500">Transaction Title:</span>
                <strong className="text-zinc-900 dark:text-white">{selectedTx.title}</strong>
              </div>
              <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                <span className="text-zinc-500">Transaction Type:</span>
                <strong className="uppercase text-zinc-900 dark:text-white">{selectedTx.type}</strong>
              </div>
              <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                <span className="text-zinc-500">Amount:</span>
                <strong className="text-[#0B7A3B] font-black text-sm">₦{selectedTx.amount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                <span className="text-zinc-500">Status:</span>
                <strong className="uppercase text-emerald-600">{selectedTx.status}</strong>
              </div>
              <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                <span className="text-zinc-500">Date & Time:</span>
                <strong className="text-zinc-900 dark:text-white">{selectedTx.date}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => alert('Downloading official PDF receipt...')} className="flex-1 py-3 bg-[#0B7A3B] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => window.print()} className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-xs flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FundWalletModal isOpen={isFundOpen} onClose={() => setIsFundOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} walletBalance={walletBalance} />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} walletBalance={walletBalance} />
      <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
    </div>
  );
};
