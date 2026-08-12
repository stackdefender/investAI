import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, Sliders, Receipt, BarChart2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sip' | 'whatif' | 'tax'>('sip');

  // Input states
  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [monthlySip, setMonthlySip] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12.0);
  const [durationYears, setDurationYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(6.0);

  // Calculation Math
  const months = durationYears * 12;
  const monthlyRate = (annualReturn / 100) / 12;

  const lumpsumFutureVal = initialInvestment * ((1 + annualReturn / 100) ** durationYears);
  const sipFutureVal = monthlyRate > 0
    ? monthlySip * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate)
    : monthlySip * months;

  const totalFutureVal = lumpsumFutureVal + sipFutureVal;
  const totalInvested = initialInvestment + (monthlySip * months);
  const estimatedGains = Math.max(0, totalFutureVal - totalInvested);
  const inflationAdjustedVal = totalFutureVal / ((1 + inflationRate / 100) ** durationYears);

  // Chart data
  const yearlyData = [];
  let currInvested = initialInvestment;
  let currVal = initialInvestment;
  for (let yr = 1; yr <= durationYears; yr++) {
    for (let m = 0; m < 12; m++) {
      currInvested += monthlySip;
      currVal = (currVal + monthlySip) * (1 + monthlyRate);
    }
    yearlyData.push({
      year: `Yr ${yr}`,
      invested: Math.round(currInvested),
      value: Math.round(currVal)
    });
  }

  // Scenarios
  const consReturn = Math.max(4, annualReturn - 3);
  const optReturn = annualReturn + 3;

  const getFutureValForRate = (rate: number) => {
    const r = (rate / 100) / 12;
    const l = initialInvestment * ((1 + rate / 100) ** durationYears);
    const s = r > 0 ? monthlySip * (((1 + r) ** months - 1) / r) * (1 + r) : monthlySip * months;
    return l + s;
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            FINANCIAL CALCULATORS & SCENARIO ENGINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">SIP & Wealth Calculator</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate SIP compounding, inflation-adjusted purchasing power, and scenario modeling.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#131A29] p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('sip')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'sip' ? 'bg-emerald-500 text-white shadow-glow-emerald' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> SIP & Lumpsum
          </button>
          <button
            onClick={() => setActiveTab('whatif')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'whatif' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> "What If?" Scenarios
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'tax' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" /> Tax Awareness
          </button>
        </div>
      </div>

      {activeTab === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-5 shadow-xl glass-panel">
            <h3 className="text-sm font-bold text-white">Investment Parameters</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Monthly SIP Amount</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(monthlySip)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={monthlySip}
                onChange={(e) => setMonthlySip(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Initial Lumpsum Capital</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(initialInvestment)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Expected Annual Return (%)</span>
                <span className="text-emerald-400 font-bold">{annualReturn}%</span>
              </div>
              <input
                type="range"
                min={4}
                max={25}
                step={0.5}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Investment Horizon (Years)</span>
                <span className="text-emerald-400 font-bold">{durationYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Inflation Rate (%)</span>
                <span className="text-amber-400 font-bold">{inflationRate}%</span>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary & Chart */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Total Invested</span>
                <div className="text-xl font-extrabold text-white">{formatCurrency(totalInvested)}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Estimated Gains</span>
                <div className="text-xl font-extrabold text-emerald-400">{formatCurrency(estimatedGains)}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Future Value (Nominal)</span>
                <div className="text-xl font-extrabold text-white">{formatCurrency(totalFutureVal)}</div>
              </div>
            </div>

            {/* Inflation-Adjusted Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-amber-400 font-bold block">Inflation-Adjusted Purchasing Power</span>
                <span className="text-[11px] text-slate-400">Value of future corpus in today's money (@{inflationRate}% inflation)</span>
              </div>
              <div className="text-xl font-extrabold text-amber-300">
                {formatCurrency(inflationAdjustedVal)}
              </div>
            </div>

            {/* Growth Visualizer */}
            <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" /> Compounding Trajectory
              </h4>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Corpus Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* "WHAT IF?" SCENARIOS TAB */}
      {activeTab === 'whatif' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-white">Three-Tier Return Scenario Modeling</h3>
            <p className="text-xs text-slate-400">
              Comparing potential future wealth outcomes based on Conservative ({consReturn}%), Base ({annualReturn}%), and Optimistic ({optReturn}%) return assumptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Conservative ({consReturn}%)</span>
              <div className="text-2xl font-extrabold text-white">{formatCurrency(getFutureValForRate(consReturn))}</div>
              <p className="text-xs text-slate-400">Lower volatility debt-heavy allocations or mild equity performance.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-3 shadow-glow-emerald border-emerald-500/40">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Base Case ({annualReturn}%)</span>
              <div className="text-2xl font-extrabold text-emerald-300">{formatCurrency(getFutureValForRate(annualReturn))}</div>
              <p className="text-xs text-slate-400">Standard historical market CAGR over long horizons.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Optimistic ({optReturn}%)</span>
              <div className="text-2xl font-extrabold text-white">{formatCurrency(getFutureValForRate(optReturn))}</div>
              <p className="text-xs text-slate-400">High-growth small-cap or tech sector tailwinds.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAX AWARENESS TAB */}
      {activeTab === 'tax' && (
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-400" />
            Indian Capital Gains Tax Reference Guide
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">Equity Stocks & Equity Funds</span>
              <ul className="space-y-1.5 text-slate-300">
                <li>• <strong>Short-Term Capital Gains (STCG)</strong>: Holding &lt; 12 months = <strong>20% Tax</strong>.</li>
                <li>• <strong>Long-Term Capital Gains (LTCG)</strong>: Holding &gt; 12 months = <strong>12.5% Tax</strong> on profits exceeding ₹1.25 Lakhs per financial year.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-blue-400 text-sm block">Debt Funds & Sovereign Gold Bonds</span>
              <ul className="space-y-1.5 text-slate-300">
                <li>• <strong>Debt Funds</strong>: Taxed at your individual slab rate.</li>
                <li>• <strong>Sovereign Gold Bonds (SGB)</strong>: Capital gains are 100% tax-free if held until 8-year maturity!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <SafetyDisclaimer />
    </div>
  );
};
