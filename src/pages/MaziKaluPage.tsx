import React from 'react';
import { Sparkles, HelpCircle, MapPin, Search, Star, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { MaziKaluChat } from '../components/ai/MaziKaluChat';

export const MaziKaluPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 pb-4">
      {/* Sidebar Info */}
      <div className="lg:w-80 space-y-8 hidden lg:block overflow-y-auto pr-4 scrollbar-hide">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-[#0B7A3B] rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-tight">
            Mazi <br /> Kalu AI
          </h1>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            I am the digital heartbeat of Enyimba City. Ask me anything about Aba—from finding the best leather artisans in Ariaria to booking the fastest route to Port Harcourt.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> Common Queries
          </h3>
          <div className="space-y-4">
            {[
              { q: 'Who sells quality leather shoes?', icon: Search },
              { q: 'How do I get to Cemetery Market?', icon: MapPin },
              { q: 'Find a high-rated hotel.', icon: Star },
              { q: 'What is the fastest delivery service?', icon: Info },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl group-hover:bg-[#0B7A3B] group-hover:text-white transition-all">
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {item.q}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] p-6 text-white space-y-4">
          <h3 className="text-sm font-black">City Intelligence</h3>
          <p className="text-[10px] opacity-70 leading-relaxed font-medium">
            Mazi Kalu analyzes real-time data from 12,000+ businesses and community posts to give you the most accurate city insights.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800" />
              ))}
            </div>
            <span className="text-[9px] font-bold opacity-60">Verified by 4.2k residents</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-h-0">
        <MaziKaluChat />
      </div>
    </div>
  );
};
