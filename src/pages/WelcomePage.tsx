import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Store, Users, ShoppingBag, Wallet, Bot, ArrowLeft } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-zinc-950 shadow-lg shadow-emerald-500/30">
              FA
            </div>
            <span className="font-bold text-xl tracking-tight">FindAba OS</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>The Official City Operating System for Aba</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Empowering Commerce, Craft & Community in Aba
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover verified manufacturers in Ariaria, connect with local artisans, shop Made-in-Aba goods, and manage your digital wallet seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 group transition-all"
          >
            <span>Explore City OS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-2xl font-bold text-base transition-all"
          >
            Register Business / Account
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Business Directory</h3>
            <p className="text-xs text-zinc-400">Ariaria, Ekeoha, and Cemetery market zones mapped with verified contact lines.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Made-in-Aba Marketplace</h3>
            <p className="text-xs text-zinc-400">Buy high-grade shoes, leather bags, and senator wear directly from craftsmen.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Community Town Hall</h3>
            <p className="text-xs text-zinc-400">Stay updated with local announcements, merchant forums, and civic dialogues.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Aba AI Concierge</h3>
            <p className="text-xs text-zinc-400">Instant intelligence on markets, wholesale pricing, logistics, and directions.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} FindAba OS V2. Built for the pride and commerce of Aba, Abia State.
      </footer>
    </div>
  );
};
