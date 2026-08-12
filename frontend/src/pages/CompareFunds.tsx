import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PieChart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { marketService } from '../services/marketService';
import { MutualFund } from '../types';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const CompareFunds: React.FC = () => {
  const [searchParams] = useSearchParams();
  const symbolsParam = searchParams.get('symbols') || '';
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const symbols = symbolsParam.split(',').filter(Boolean);
    if (symbols.length === 0) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await marketService.compareMutualFunds(symbols);
        setFunds(res);
      } catch (err) {
        console.error('Comparison fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [symbolsParam]);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      <div className="flex items-center justify-between">
        <Link to="/mutual-funds" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Mutual Funds
        </Link>
      </div>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Side-by-Side Fund Comparison</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comparing NAV, Expense Ratios, 1Y/3Y/5Y CAGR, and AUM size across {funds.length} selected funds.
        </p>
      </div>

      {/* Comparison Grid Table */}
      {funds.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#131A29] p-6 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="p-3">Fund Metric</th>
                {funds.map((f) => (
                  <th key={f.symbol} className="p-3 text-white font-bold text-sm min-w-[200px]">
                    {f.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-3 font-semibold text-slate-400">Category</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 font-bold text-emerald-400">{f.category} ({f.type})</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Current NAV</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 font-bold text-white">₹{f.nav}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Expense Ratio</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 text-slate-200">{f.expense_ratio}%</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">AUM Size</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 text-slate-200">{f.aum}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">1-Year Return</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 font-bold text-emerald-400">+{f.return_1y}%</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">3-Year CAGR</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 font-bold text-emerald-400">+{f.return_3y}%</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">5-Year CAGR</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 font-bold text-emerald-400">+{f.return_5y}%</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Benchmark Index</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 text-slate-300">{f.benchmark}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Fund Manager</td>
                {funds.map((f) => <td key={f.symbol} className="p-3 text-slate-300">{f.fund_manager}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">
          Select at least 2 funds from the Mutual Funds Explorer to compare.
        </div>
      )}

      <SafetyDisclaimer />
    </div>
  );
};
