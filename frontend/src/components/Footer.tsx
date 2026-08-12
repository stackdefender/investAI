import React from 'react';
import { TrendingUp, ShieldAlert, Heart } from 'lucide-react';
import { GLOBAL_SAFETY_DISCLAIMER } from '../utils/compliance';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-10 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-white">Invest<span className="text-emerald-400">AI</span></span>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400 text-xs font-medium">
            <a href="/market-timing" className="hover:text-emerald-400 transition-colors">Market Timing</a>
            <a href="/stocks" className="hover:text-emerald-400 transition-colors">Stocks</a>
            <a href="/mutual-funds" className="hover:text-emerald-400 transition-colors">Mutual Funds</a>
            <a href="/news" className="hover:text-emerald-400 transition-colors">News Analyzer</a>
            <a href="/calculators" className="hover:text-emerald-400 transition-colors">Calculators</a>
            <a href="/learn" className="hover:text-emerald-400 transition-colors">Financial Education</a>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-[11px] text-slate-400 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 block mb-1">Financial Disclaimer</span>
            {GLOBAL_SAFETY_DISCLAIMER}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 pt-4 border-t border-slate-800/40">
          <p>© 2026 InvestAI Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for smart financial freedom.
          </p>
        </div>
      </div>
    </footer>
  );
};
