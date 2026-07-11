import React, { useState } from 'react';
import { X, Send, Check, User, Building2, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, walletBalance }) => {
  const { addTransaction } = useStore();
  const [recipientType, setRecipientType] = useState<'username' | 'phone' | 'business' | 'walletId'>('username');
  const [recipient, setRecipient] = useState('Chinedu Ekeoha');
  const [amount, setAmount] = useState('15000');
  const [note, setNote] = useState('Payment for leather shoes supply');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTransfer = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if (amt > walletBalance) {
      alert('Insufficient wallet balance for this transfer.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      addTransaction({
        id: `tx_${Date.now()}`,
        type: 'debit',
        title: `Transfer to ${recipient}`,
        amount: amt,
        status: 'completed',
        date: 'Just now',
        reference: `FOS-TRF-${Math.floor(100000 + Math.random() * 900000)}`
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-6">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#0B7A3B] flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Transfer Successful!</h2>
            <p className="text-xs text-zinc-500">₦{parseFloat(amount).toLocaleString()} successfully sent to <strong className="text-zinc-900 dark:text-white">{recipient}</strong>.</p>
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
                Instant City Transfer
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Transfer Money</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-2">
                {[
                  { id: 'username', label: 'Username' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'business', label: 'Business' },
                  { id: 'walletId', label: 'Wallet ID' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRecipientType(t.id as any)}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      recipientType === t.id ? 'bg-[#0B7A3B] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">
                  Recipient {recipientType === 'phone' ? 'Phone Number' : recipientType === 'business' ? 'Business Name' : 'Username / Wallet ID'}
                </label>
                <input
                  type="text"
                  value={recipient || ''}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-[11px] text-[#0B7A3B] mt-1 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified FindAba Citizen Account
                </span>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Narration / Note</label>
                <input
                  type="text"
                  value={note || ''}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleTransfer}
              disabled={loading}
              className="w-full py-3.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{loading ? 'Sending Funds...' : `Transfer ₦${parseFloat(amount || '0').toLocaleString()} Instantly`}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
