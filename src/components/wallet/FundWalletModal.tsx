import React, { useState } from 'react';
import { X, CreditCard, Building2, Smartphone, QrCode, Check, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FundWalletModal: React.FC<FundWalletModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useStore();
  const [amount, setAmount] = useState('20000');
  const [method, setMethod] = useState<'paystack' | 'transfer' | 'ussd' | 'qr'>('paystack');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');

  if (!isOpen) return null;

  const handleFund = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setLoading(true);
    const ref = `FOS-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    setReference(ref);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      addTransaction({
        id: `tx_${Date.now()}`,
        type: 'credit',
        title: `Wallet Funding (${method.toUpperCase()})`,
        amount: num,
        status: 'completed',
        date: 'Just now',
        reference: ref
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-6">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#0B7A3B] flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Wallet Funded Successfully!</h2>
            <p className="text-xs text-zinc-500">Your account has been credited instantly with ₦{parseFloat(amount).toLocaleString()}.</p>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left space-y-1 text-xs">
              <span className="text-zinc-400 block">Payment Reference:</span>
              <strong className="text-zinc-900 dark:text-white font-mono">{reference}</strong>
            </div>
            <button
              onClick={() => { setSuccess(false); onClose(); }}
              className="w-full py-3 bg-[#0B7A3B] text-white font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[#0B7A3B] text-xs font-bold inline-block mb-1">
                Paystack & Bank Gateway
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Fund FindAba City Wallet</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Amount to Add (₦)</label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2">Select Funding Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'paystack', label: 'Debit Card (Paystack)', icon: CreditCard },
                    { id: 'transfer', label: 'Bank Transfer (NIBSS)', icon: Building2 },
                    { id: 'ussd', label: 'USSD Code (*737#)', icon: Smartphone },
                    { id: 'qr', label: 'Scan & Pay QR', icon: QrCode },
                  ].map((m) => {
                    const Icon = m.icon;
                    const active = method === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setMethod(m.id as any)}
                        className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                          active ? 'bg-[#0B7A3B]/10 border-[#0B7A3B] text-[#0B7A3B]' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-bold">{m.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {method === 'transfer' && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                  <span className="text-zinc-400 block">Dedicated Virtual Account:</span>
                  <strong className="text-zinc-900 dark:text-white font-mono text-sm block">9928374615 (Wema Bank - FindAba OS)</strong>
                  <span className="text-[10px] text-zinc-500">Auto-credits instantly upon transfer confirmation.</span>
                </div>
              )}
            </div>

            <button
              onClick={handleFund}
              disabled={loading}
              className="w-full py-3.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{loading ? 'Initializing Secure Gateway...' : `Proceed to Fund ₦${parseFloat(amount || '0').toLocaleString()}`}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
