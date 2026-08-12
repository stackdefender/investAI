import React, { useState, useEffect } from 'react';
import { 
  Compass, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, 
  HelpCircle, ArrowRight, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { DemoDataBadge } from '../components/DemoDataBadge';

export const MarketTiming: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMarketTiming = async () => {
    setLoading(true);
    try {
      const res = await aiService.getMarketTiming();
      setData(res);
    } catch (err) {
      console.error('Market timing fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketTiming();
  }, []);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 mb-2">
            <Compass className="w-3.5 h-3.5" />
            MARKET TIMING AI INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Is This a Good Time to Invest?</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Macro environment analysis evaluating valuations, interest rates, inflation, and market volatility.
          </p>
        </div>

        <button
          onClick={fetchMarketTiming}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Assessment
        </button>
      </div>

      {/* AI Market Assessment Hero Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 sm:p-8 space-y-6 shadow-xl glass-panel relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">AI Assessment Model v2.6</span>
              <h2 className="text-lg font-bold text-white">Current Environment Verdict</h2>
            </div>
          </div>
          <DemoDataBadge label="Real-time Macro Feeds" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Environment Status</span>
            <div className="text-base font-extrabold text-emerald-400">
              {data?.ai_market_assessment?.current_status || "Neutral to Moderately Positive"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Suitable For</span>
            <div className="text-xs font-bold text-white">
              {data?.ai_market_assessment?.suitable_investor_type || "Long-term Systematic SIP Investors"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Suggested Approach</span>
            <div className="text-xs font-bold text-blue-400">
              {data?.ai_market_assessment?.suggested_approach || "Gradual Dollar-Cost Averaging"}
            </div>
          </div>
        </div>
      </div>

      {/* Macro Environment Overview Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Current Macro Environment Indicators</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Market Trend</span>
            <div className="text-sm font-bold text-white">
              {data?.macro_environment?.market_trend || "Moderately Bullish"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Valuation Ratios</span>
            <div className="text-sm font-bold text-white">
              {data?.macro_environment?.valuation_indicator || "Fairly Valued (NIFTY P/E ~ 22.4)"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Volatility (India VIX)</span>
            <div className="text-sm font-bold text-white">
              {data?.macro_environment?.volatility_index || "13.2 (Low Volatility)"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Interest Rates</span>
            <div className="text-sm font-bold text-white">
              {data?.macro_environment?.interest_rate_environment || "Peak Rates; Pivoting to Cuts"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Inflation Outlook</span>
            <div className="text-sm font-bold text-white">
              {data?.macro_environment?.inflation_outlook || "Moderate (4.5% - 5.0%)"}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">FII / DII Institutional Net Flow</span>
            <div className="text-sm font-bold text-emerald-400">
              {data?.macro_environment?.fii_dii_activity || "Net Buyers (+₹3,550 Cr Total)"}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Lump Sum vs SIP vs Staggered */}
      <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-6">
        <h3 className="text-base font-bold text-white">Timing Strategy Comparison</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-extrabold text-blue-400 text-sm block">Systematic Investment (SIP)</span>
            <p className="text-slate-300 leading-relaxed">
              {data?.timing_strategy_comparison?.sip || "100% recommended. SIP eliminates emotional market timing errors."}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-extrabold text-emerald-400 text-sm block">Staggered Deployment (STP)</span>
            <p className="text-slate-300 leading-relaxed">
              {data?.timing_strategy_comparison?.staggered || "Optimal strategy in current valuation regime over 3-6 months."}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-extrabold text-amber-400 text-sm block">100% Lump Sum</span>
            <p className="text-slate-300 leading-relaxed">
              {data?.timing_strategy_comparison?.lump_sum || "Deploy 30% immediately, hold 70% in Liquid funds for dip buying."}
            </p>
          </div>

        </div>
      </div>

      <SafetyDisclaimer customMessage="Market timing involves high uncertainty. Nobody can consistently predict daily price movements. Long-term systematic investing (SIP) historically outperforms attempts to time short-term market tops and bottoms." />
    </div>
  );
};
