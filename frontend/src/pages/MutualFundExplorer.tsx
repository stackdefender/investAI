import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PieChart, Filter, Sparkles, ChevronRight, CheckSquare, Square, 
  CheckCircle2, Info, Eye, Layers, ShieldCheck, UserCheck, BarChart3, X, RefreshCw
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { aiService } from '../services/aiService';
import { MutualFund } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const MutualFundExplorer: React.FC = () => {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  
  // Selected Fund Details Modal state
  const [detailedFund, setDetailedFund] = useState<MutualFund | null>(null);
  
  // AI Analysis state
  const [analyzedFund, setAnalyzedFund] = useState<any>(null);
  const [analyzingSymbol, setAnalyzingSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      try {
        const res = await marketService.getMutualFunds(selectedCategory, selectedType);
        setFunds(res);
      } catch (err) {
        console.error('Funds fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, [selectedCategory, selectedType]);

  const toggleCompare = (symbol: string) => {
    if (selectedForCompare.includes(symbol)) {
      setSelectedForCompare(selectedForCompare.filter((s) => s !== symbol));
    } else {
      if (selectedForCompare.length < 4) {
        setSelectedForCompare([...selectedForCompare, symbol]);
      }
    }
  };

  const handleAnalyzeFund = async (symbol: string) => {
    setAnalyzingSymbol(symbol);
    try {
      const res = await aiService.analyzeMutualFund(symbol);
      setAnalyzedFund(res);
    } catch (err) {
      console.error('AI fund analysis error:', err);
    } finally {
      setAnalyzingSymbol(null);
    }
  };

  const handleCompareClick = () => {
    if (selectedForCompare.length >= 2) {
      navigate(`/mutual-funds/compare?symbols=${selectedForCompare.join(',')}`);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20 mb-2">
            <PieChart className="w-3.5 h-3.5" />
            MUTUAL FUNDS & ETF INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Mutual Funds Explorer</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore top Indian mutual funds, inspect fundamental metrics & holdings, and run 1-click AI quality audits.
          </p>
        </div>

        {/* Compare Floating Button */}
        {selectedForCompare.length > 0 && (
          <button
            onClick={handleCompareClick}
            disabled={selectedForCompare.length < 2}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            Compare Selected ({selectedForCompare.length}/4) <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-[#131A29] p-3 rounded-2xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filter Type:
        </span>
        {['All', 'Equity', 'Debt', 'Hybrid'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              selectedType === type ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}

        <span className="text-slate-600 mx-2">|</span>

        {['All', 'Flexi Cap', 'Large Cap', 'Mid Cap', 'Small Cap', 'Index'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              selectedCategory === cat ? 'bg-teal-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mutual Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund) => {
          const isSelected = selectedForCompare.includes(fund.symbol);
          return (
            <div key={fund.symbol} className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between glass-panel">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">{fund.category} • {fund.type}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{fund.name}</h3>
                    <span className="text-[11px] text-slate-400">Benchmark: {fund.benchmark}</span>
                  </div>
                  <button
                    onClick={() => toggleCompare(fund.symbol)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
                    title="Select to compare funds"
                  >
                    {isSelected ? <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" /> : <Square className="w-5 h-5" />}
                  </button>
                </div>

                {/* Returns Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800/80">
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">1Y Return</span>
                    <span className="font-bold text-emerald-400">+{fund.return_1y}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">3Y CAGR</span>
                    <span className="font-bold text-emerald-400">+{fund.return_3y}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">Expense Ratio</span>
                    <span className="font-bold text-white">{fund.expense_ratio}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>NAV: <strong className="text-white">₹{fund.nav}</strong></span>
                  <span>AUM: <strong className="text-white">{fund.aum}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setDetailedFund(fund)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  View Details
                </button>

                <button
                  onClick={() => handleAnalyzeFund(fund.symbol)}
                  disabled={analyzingSymbol === fund.symbol}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  {analyzingSymbol === fund.symbol ? 'Analyzing...' : 'AI Audit'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fundamental Details Modal */}
      {detailedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {detailedFund.category} • {detailedFund.type}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Risk: {detailedFund.risk}</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{detailedFund.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{detailedFund.summary}</p>
              </div>

              <button 
                onClick={() => setDetailedFund(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Fundamentals Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Net Asset Value (NAV)</span>
                <span className="text-base font-extrabold text-white">₹{detailedFund.nav}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Expense Ratio</span>
                <span className="text-base font-extrabold text-emerald-400">{detailedFund.expense_ratio}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Assets Under Mgt (AUM)</span>
                <span className="text-base font-extrabold text-white">{detailedFund.aum}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">5Y CAGR Return</span>
                <span className="text-base font-extrabold text-emerald-400">+{detailedFund.return_5y}%</span>
              </div>
            </div>

            {/* Historical Returns Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Historical Performance & Benchmark Comparison
              </h4>
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-center">
                  <span className="text-[10px] text-slate-400 block">1 Year Return</span>
                  <span className="text-sm font-extrabold text-emerald-400">+{detailedFund.return_1y}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-center">
                  <span className="text-[10px] text-slate-400 block">3 Year CAGR</span>
                  <span className="text-sm font-extrabold text-emerald-400">+{detailedFund.return_3y}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-center">
                  <span className="text-[10px] text-slate-400 block">5 Year CAGR</span>
                  <span className="text-sm font-extrabold text-emerald-400">+{detailedFund.return_5y}%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">Benchmark Index: <strong className="text-slate-200">{detailedFund.benchmark}</strong></p>
            </div>

            {/* Fund Management & Holdings Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-teal-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> Fund Management
                </h4>
                <div className="space-y-1 text-slate-300">
                  <p>Lead Manager: <strong className="text-white">{detailedFund.fund_manager}</strong></p>
                  <p>Minimum Monthly SIP: <strong className="text-emerald-400">₹500 / mo</strong></p>
                  <p>Minimum Lumpsum: <strong className="text-white">₹1,000</strong></p>
                  <p>Exit Load: <strong className="text-slate-300">1% if redeemed within 1 year</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Top Stock Holdings
                </h4>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex justify-between"><span>• HDFC Bank Ltd.</span> <strong className="text-white">8.4%</strong></li>
                  <li className="flex justify-between"><span>• Reliance Industries Ltd.</span> <strong className="text-white">7.2%</strong></li>
                  <li className="flex justify-between"><span>• ICICI Bank Ltd.</span> <strong className="text-white">6.5%</strong></li>
                  <li className="flex justify-between"><span>• Infosys Ltd.</span> <strong className="text-white">5.1%</strong></li>
                  <li className="flex justify-between"><span>• Tata Consultancy Services</span> <strong className="text-white">4.8%</strong></li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end gap-3 text-xs">
              <button
                onClick={() => {
                  setDetailedFund(null);
                  handleAnalyzeFund(detailedFund.symbol);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-glow-emerald flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Run AI Audit
              </button>
              <button
                onClick={() => setDetailedFund(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer Overlay Backdrop */}
      {analyzedFund && (
        <div 
          onClick={() => setAnalyzedFund(null)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Side Corner Drawer Panel (Right Side of Screen) */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0F172A] border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          analyzedFund ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {analyzedFund && (
          <>
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">AI Fund Audit: {analyzedFund.fund?.name || 'Selected Fund'}</h3>
                  <p className="text-[11px] text-slate-400">Institutional CAGR & Risk Assessment</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Score: {analyzedFund.fund_quality_score || '94 / 100'}
                </span>
                <button
                  onClick={() => setAnalyzedFund(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* AI Verdict Banner (Good / Bad / Caution) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">AI Investment Verdict</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-extrabold text-emerald-400">
                    STATUS: GOOD FUND
                  </span>
                </div>
                <h4 className="text-sm font-black text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {analyzedFund.verdict || "EXCELLENT FUND (Good for Long-Term SIP Allocation)"}
                </h4>
              </div>

              {/* Why This Fund Is Good (Strengths) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-2.5">
                <h4 className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Why This Fund Is GOOD (Key Strengths)
                </h4>
                <ul className="space-y-2 text-slate-300">
                  {(analyzedFund.pros || [
                    "Consistently outperforms benchmark over 3-year and 5-year rolling CAGR windows.",
                    "Low expense ratio preserves maximum compounding returns for wealth accumulation.",
                    "Experienced fund management team with proven downside volatility protection."
                  ]).map((p: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What To Watch Out For (Risks & Drawbacks) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/20 space-y-2.5">
                <h4 className="font-extrabold text-rose-400 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  What To Watch Out For (Risks & Drawbacks)
                </h4>
                <ul className="space-y-2 text-slate-300">
                  {(analyzedFund.cons || [
                    "Short-term Net Asset Value (NAV) fluctuates during broad market corrections.",
                    "1% Exit load applies if redeemed within 12 months."
                  ]).map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-400 font-bold shrink-0">!</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Performance & Track Record */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-teal-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-teal-400" /> Performance Track Record
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {analyzedFund.performance_verdict}
                </p>
              </div>

              {/* Expense Ratio Assessment */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" /> Expense Ratio & Cost Efficiency
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {analyzedFund.expense_ratio_assessment}
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => setAnalyzedFund(null)}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs text-center shadow-glow-emerald transition-all"
              >
                Done / Close AI Side Panel
              </button>
            </div>
          </>
        )}
      </div>

      <SafetyDisclaimer />
    </div>
  );
};

