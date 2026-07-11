import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [role, setRole] = useState<'citizen' | 'merchant'>('citizen');
  const [marketZone, setMarketZone] = useState('Ariaria International Market');

  const handleComplete = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl mt-12 sm:mt-0">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-zinc-950 text-xl shadow-lg shadow-emerald-500/30 mx-auto mb-4">
            FA
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">Welcome, {user?.name || 'Friend'}!</h1>
          <p className="text-sm text-zinc-400">Let's personalize your FindAba OS experience.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              I am joining FindAba OS primarily as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole('citizen')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                  role === 'citizen'
                    ? 'bg-emerald-600/10 border-emerald-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <User className={`w-8 h-8 mb-2 ${role === 'citizen' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <h3 className="font-bold text-sm mb-1">Aba Resident</h3>
                <p className="text-[11px] text-zinc-400">Discover local stores, community news & pay securely.</p>
              </div>

              <div
                onClick={() => setRole('merchant')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                  role === 'merchant'
                    ? 'bg-emerald-600/10 border-emerald-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Store className={`w-8 h-8 mb-2 ${role === 'merchant' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <h3 className="font-bold text-sm mb-1">Merchant / Artisan</h3>
                <p className="text-[11px] text-zinc-400">List products, showcase leather works & receive orders.</p>
              </div>
            </div>
          </div>

          {role === 'merchant' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Primary Market Zone
              </label>
              <select
                value={marketZone}
                onChange={(e) => setMarketZone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Ariaria International Market">Ariaria International Market</option>
                <option value="Ekeoha Market">Ekeoha Market</option>
                <option value="Cemetery Market">Cemetery Market</option>
                <option value="Ngwa Road Market">Ngwa Road Market</option>
                <option value="Osusu Industrial Zone">Osusu Industrial Zone</option>
              </select>
            </div>
          )}

          <button
            onClick={handleComplete}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Continue to City Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
