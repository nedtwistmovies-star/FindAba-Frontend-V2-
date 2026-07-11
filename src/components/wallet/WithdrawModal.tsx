import React, { useState } from 'react';
import { X, Building2, Check, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, walletBalance }) => {
  const { addTransaction } = useStore();
  const [bank, setBank] = useState('Access Bank');
  const [accountNumber, setAccountNumber] = useState('0691234567');
  const [accountName, setAccountName] = useState('Chinedu Okoro (Verified)');
  const [amount, setAmount] = useState('10000');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if (amt > walletBalance) {
      alert('Insufficient wallet balance for this withdrawal.');
      return;
    }
    if (pin.length !== 4) {
      alert('Please enter your 4-digit transaction PIN.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      addTransaction({
        id: `tx_${Date.now()}`,
        type: 'debit',
        title: `Bank Withdrawal (${bank} - ${accountNumber})`,
        amount: amt,
        status: 'completed',
        date: 'Just now',
        reference: `FOS-WDR-${Math.floor(100000 + Math.random() * 900000)}`
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
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Withdrawal Successful!</h2>
            <p className="text-xs text-zinc-500">₦{parseFloat(amount).toLocaleString()} has been sent to your {bank} account ({accountNumber}).</p>
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
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold inline-block mb-1">
                Instant Bank Payout
              </span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Withdraw Funds</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between">
                <span className="text-zinc-500">Available Balance:</span>
                <strong className="text-zinc-900 dark:text-white">₦{walletBalance.toLocaleString()}</strong>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Select Bank</label>
                <select
                  value={bank || ''}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-zinc-900 dark:text-white"
                >
                  <option value="Access Bank">Access Bank</option>
                  <option value="GTBank">Guaranty Trust Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="First Bank">First Bank of Nigeria</option>
                  <option value="UBA">United Bank for Africa (UBA)</option>
                  <option value="Opay">Opay Digital Services</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Account Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber || ''}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-mono font-bold text-zinc-900 dark:text-white"
                />
                <span className="text-[11px] text-[#0B7A3B] mt-1 block">✓ Verified Name: {accountName}</span>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Withdrawal Amount (₦)</label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">4-Digit Transaction PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pin || ''}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 tracking-widest font-mono text-center text-base"
                />
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full py-3.5 bg-[#0B7A3B] hover:bg-[#169C4A] text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{loading ? 'Processing Transfer...' : `Withdraw ₦${parseFloat(amount || '0').toLocaleString()}`}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
