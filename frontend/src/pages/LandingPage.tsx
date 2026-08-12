import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Sparkles, Compass, ShieldCheck, LineChart, PieChart, 
  ArrowRight, CheckCircle2, BarChart3, Lock, Zap, Award, Globe
} from 'lucide-react';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { DemoDataBadge } from '../components/DemoDataBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold shadow-glow-emerald">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED FINANCIAL INTELLIGENCE PLATFORM
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Invest Smarter. <br />
            Understand Markets. <br />
            <span className="gradient-text">Build Your Future.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            AI-powered investment insights, personalized financial planning, market intelligence, and portfolio analysis in one unified production fintech platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/ai-planner"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Explore AI Planner
            </Link>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dynamic Asset Allocation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Institutional Risk Modeling
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gemini AI Integration
            </span>
          </div>
        </div>

        {/* Financial Dashboard Interactive Preview Card */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#131A29]/90 shadow-2xl p-4 sm:p-6 glass-panel">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-mono ml-2">InvestAI Financial Command Center</span>
            </div>
            <DemoDataBadge label="Interactive Preview" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Financial Health Score</span>
              <div className="text-3xl font-extrabold text-emerald-400">82 <span className="text-xs font-normal text-slate-400">/ 100</span></div>
              <p className="text-[11px] text-emerald-400/90 mt-2 font-medium">Excellent emergency fund & savings rate.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">AI Market Environment</span>
              <div className="text-base font-bold text-white">Neutral to Moderately Positive</div>
              <p className="text-[11px] text-slate-400 mt-2">Optimal for long-term monthly SIP investors.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Suggested Asset Allocation</span>
              <div className="flex gap-2 text-xs font-bold text-white mt-1">
                <span className="text-emerald-400">Equity 60%</span> • <span className="text-blue-400">Debt 20%</span> • <span className="text-amber-400">Gold 10%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Tailored for Moderate Risk tolerance (15-yr horizon).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-[#0E1420] border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Institutional-Grade Intelligence for Retail Investors
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Everything you need to analyze stocks, evaluate mutual funds, track net worth, and plan life goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Personal Investment Planner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates a customized asset allocation (Equity, Debt, Gold, International) considering your age, income, emergency fund, and risk score.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Calculators & Scenarios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compound SIP calculator with 3-tier return scenario modeling and Indian tax awareness guide.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI News Impact Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translates complex global events (US Fed rate decisions, crude oil swings, GDP figures) into clear stock sector and market impacts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Stock & Fund Explorer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive financial data, P/E ratio, ROE, 52-week ranges, fund NAVs, and 1-click AI fundamental breakdowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Portfolio Health Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scans your holdings for over-concentration, sector exposure, mutual fund overlaps, and calculates your Portfolio Health Score out of 100.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Goal & Retirement Planners</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates monthly SIP requirements for home purchases, children's education, or retirement nest eggs with inflation adjustment.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Safety Notice Footer banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SafetyDisclaimer />
      </section>

    </div>
  );
};
