import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Trash2, Sparkles, Wallet, PieChart, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, RefreshCw,
  CheckCircle2, AlertTriangle, X, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { portfolioService } from '../services/portfolioService';
import { aiService } from '../services/aiService';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { Portfolio, PortfolioHolding } from '../types';

export const PortfolioTracker: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Holding Form state
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState<'stock' | 'mutual_fund' | 'etf' | 'gold' | 'bond' | 'cash'>('stock');
  const [category, setCategory] = useState('Equity');
  const [quantity, setQuantity] = useState<number | string>('');
  const [avgBuyPrice, setAvgBuyPrice] = useState<number | string>('');
  const [currentPrice, setCurrentPrice] = useState<number | string>('');

  const targetUserId = user?.id || 1;

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getPortfolio(targetUserId);
      setPortfolio(data);
    } catch (err) {
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [targetUserId]);

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !avgBuyPrice) return;
    try {
      await portfolioService.addHolding(targetUserId, {
        symbol_or_name: symbol.toUpperCase(),
        asset_type: assetType,
        category: category,
        quantity: Number(quantity),
        avg_buy_price: Number(avgBuyPrice),
        current_price: Number(currentPrice || avgBuyPrice),
      });
      setShowAddModal(false);
      setSymbol('');
      setQuantity('');
      setAvgBuyPrice('');
      setCurrentPrice('');
      fetchPortfolio();
    } catch (err) {
      console.error('Add holding error:', err);
    }
  };

  const handleDeleteHolding = async (holdingId: number) => {
    try {
      await portfolioService.deleteHolding(holdingId);
      fetchPortfolio();
    } catch (err) {
      console.error('Delete holding error:', err);
    }
  };

  const handleHealthCheck = async () => {
    setAnalyzing(true);
    try {
      const aiRes = await aiService.analyzePortfolioHealth(targetUserId);
      setHealthCheck(aiRes);
    } catch (err) {
      console.error('Health check error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const totalInvested = portfolio?.total_invested || 0;
  const currentValue = portfolio?.current_value || 0;
  const totalPnL = currentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            REAL-TIME HOLDINGS & RISK AUDITOR
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">My Portfolio Command</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track stocks, mutual funds, gold, bonds, and cash with 1-click AI health audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Add Holding
          </button>

          <button
            onClick={handleHealthCheck}
            disabled={analyzing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {analyzing ? 'Auditing Portfolio...' : 'Analyze My Portfolio'}
          </button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Capital Invested</span>
          <div className="text-2xl font-extrabold text-white">{formatCurrency(totalInvested)}</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Current Portfolio Value</span>
          <div className="text-2xl font-extrabold text-white">{formatCurrency(currentValue)}</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Profit / Loss</span>
          <div className={`text-2xl font-extrabold flex items-center gap-1 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnL >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            {formatCurrency(totalPnL)} ({formatPercent(pnlPercent)})
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white">Current Asset Holdings</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="p-3">Asset Symbol</th>
                <th className="p-3">Asset Class</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Avg Buy Price</th>
                <th className="p-3">Current Price</th>
                <th className="p-3">Total Value</th>
                <th className="p-3">P&L</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {portfolio?.holdings.map((h) => {
                const hVal = h.quantity * h.current_price;
                const hCost = h.quantity * h.avg_buy_price;
                const hGain = hVal - hCost;
                const hGainPct = hCost > 0 ? (hGain / hCost) * 100 : 0;
                return (
                  <tr key={h.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white">{h.symbol_or_name}</td>
                    <td className="p-3 font-semibold text-emerald-400 uppercase text-[11px]">{h.asset_type} ({h.category})</td>
                    <td className="p-3 text-slate-200">{h.quantity}</td>
                    <td className="p-3 text-slate-200">₹{h.avg_buy_price}</td>
                    <td className="p-3 text-slate-200">₹{h.current_price}</td>
                    <td className="p-3 font-bold text-white">{formatCurrency(hVal)}</td>
                    <td className={`p-3 font-bold ${hGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(hGainPct)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteHolding(h.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete holding"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Health Audit Corner Slide-Over Drawer */}
      {healthCheck && (
        <>
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setHealthCheck(null)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Corner Side Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[580px] md:w-[640px] bg-[#131A29] border-l border-emerald-500/40 z-50 p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">AI Portfolio Analysis & Audit</h2>
                  <p className="text-xs text-slate-400">Deep AI evaluation of asset allocation, pros & cons</p>
                </div>
              </div>

              <button
                onClick={() => setHealthCheck(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                title="Close Analysis"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Verdict & Health Rating Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> OVERALL VERDICT
                </span>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                  Score: {healthCheck.health_score} / 100
                </div>
              </div>

              <h3 className="text-base font-extrabold text-white">
                {healthCheck.overall_verdict || "Optimal Strategy - Balanced Asset Allocation"}
              </h3>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-emerald-400">Best Approach:</strong> {healthCheck.best_suited_strategy || "Disciplined Monthly SIP + Multi-Asset Holding Strategy"}
              </p>
            </div>

            {/* Pros / Advantages Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 shadow-md">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Advantages & Pros
              </h4>

              <ul className="space-y-2 text-xs">
                {(healthCheck.advantages || healthCheck.strengths)?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons & Risk Warnings Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 shadow-md">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Disadvantages & Cons (Risks)
              </h4>

              <ul className="space-y-2 text-xs">
                {(healthCheck.cons || healthCheck.weaknesses_and_risks)?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200 leading-relaxed">
                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">⚠️</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Recommendations */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30 space-y-3 shadow-md">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Actionable Next Steps
              </h4>

              <ul className="space-y-2 text-xs">
                {healthCheck.actionable_recommendations?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200 leading-relaxed">
                    <span className="text-blue-400 font-bold shrink-0 mt-0.5">➔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence & Compliance Footer */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>AI Confidence Rating: <strong className="text-white">{healthCheck.confidence_level || '91%'}</strong></span>
                <button
                  onClick={() => setHealthCheck(null)}
                  className="text-xs text-emerald-400 hover:underline font-bold"
                >
                  Dismiss Panel →
                </button>
              </div>

              <SafetyDisclaimer />
            </div>

          </div>
        </>
      )}

      {/* Add Holding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add Asset Holding</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddHolding} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Asset Symbol / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INFY, PARAG_FLEXI, Gold SGB"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Asset Type</label>
                  <select
                    value={assetType}
                    onChange={(e: any) => setAssetType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="stock">Stock</option>
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="etf">ETF</option>
                    <option value="gold">Gold</option>
                    <option value="bond">Bond</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10"
                    value={quantity}
                    onChange={handleNumChange(setQuantity)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Avg Buy Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={buyPrice}
                    onChange={handleNumChange(setBuyPrice)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Current Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1650"
                    value={currentPrice}
                    onChange={handleNumChange(setCurrentPrice)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-glow-emerald"
                >
                  Save Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SafetyDisclaimer />
    </div>
  );
};
