import React, { useState } from 'react';
import { Target, Calculator, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const RetirementPlanner: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<number | string>(30);
  const [retirementAge, setRetirementAge] = useState<number | string>(60);
  const [currentExpenses, setCurrentExpenses] = useState<number | string>(50000);
  const [inflationRate, setInflationRate] = useState<number | string>(6.0);
  const [existingInvestments, setExistingInvestments] = useState<number | string>(650000);
  const [expectedReturn, setExpectedReturn] = useState<number | string>(11.0);

  // Safe number parsing
  const numCurrentAge = Number(currentAge) || 30;
  const numRetirementAge = Number(retirementAge) || 60;
  const numExpenses = Number(currentExpenses) || 0;
  const numInflation = Number(inflationRate) || 0;
  const numExisting = Number(existingInvestments) || 0;
  const numReturn = Number(expectedReturn) || 0;

  // Math calculation
  const yearsToRetirement = Math.max(1, numRetirementAge - numCurrentAge);
  const futureMonthlyExpense = numExpenses * ((1 + numInflation / 100) ** yearsToRetirement);
  const requiredCorpus = futureMonthlyExpense * 12 * 25; // 25x safe withdrawal
  const existingCorpusAtRetirement = numExisting * ((1 + numReturn / 100) ** yearsToRetirement);
  const corpusShortfall = Math.max(0, requiredCorpus - existingCorpusAtRetirement);

  const months = yearsToRetirement * 12;
  const monthlyRate = (numReturn / 100) / 12;
  const monthlySipRequired = corpusShortfall > 0 && monthlyRate > 0
    ? corpusShortfall / ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate))
    : 0;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-2">
          <Target className="w-3.5 h-3.5" />
          RETIREMENT NEST EGG ENGINE
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Retirement Freedom Calculator</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate your required retirement nest egg considering future inflation and safe withdrawal rates.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Inputs */}
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-xl glass-panel">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Retirement Inputs
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setCurrentAge(e.target.value === '' ? '' : e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setRetirementAge(e.target.value === '' ? '' : e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs space-y-1">
            <label className="text-slate-300 font-semibold block">Monthly Living Expenses (Today's ₹)</label>
            <input
              type="number"
              value={currentExpenses}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setCurrentExpenses(e.target.value === '' ? '' : e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Inflation Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={inflationRate}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setInflationRate(e.target.value === '' ? '' : e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Expected Return (%)</label>
              <input
                type="number"
                step="0.5"
                value={expectedReturn}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setExpectedReturn(e.target.value === '' ? '' : e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs space-y-1">
            <label className="text-slate-300 font-semibold block">Existing Savings & Investments Total (₹)</label>
            <input
              type="number"
              value={existingInvestments}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setExistingInvestments(e.target.value === '' ? '' : e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Results Output Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Inflation-Adjusted Monthly Expense</span>
              <div className="text-2xl font-extrabold text-amber-400">
                {formatCurrency(futureMonthlyExpense)} / mo
              </div>
              <p className="text-[11px] text-slate-400">
                At age {retirementAge} (after {yearsToRetirement} years of {inflationRate}% inflation).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Target Retirement Corpus</span>
              <div className="text-2xl font-extrabold text-emerald-400">
                {formatCurrency(requiredCorpus)}
              </div>
              <p className="text-[11px] text-slate-400">
                25x annual expenses (Standard 4% Safe Withdrawal Rule).
              </p>
            </div>

          </div>

          {/* Shortfall & Monthly SIP Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 space-y-4 shadow-glow-emerald">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-300 font-semibold block">Required Monthly Investment SIP</span>
                <span className="text-3xl font-extrabold text-emerald-300 block mt-1">
                  {formatCurrency(monthlySipRequired)} / mo
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Current Assets Growth Future Value</span>
                <span className="text-lg font-bold text-white block mt-0.5">{formatCurrency(existingCorpusAtRetirement)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
              Starting a monthly SIP of <strong className="text-emerald-400">{formatCurrency(monthlySipRequired)}</strong> today will bridge your corpus shortfall of {formatCurrency(corpusShortfall)} completely by age {retirementAge}.
            </p>
          </div>

        </div>

      </div>

      <SafetyDisclaimer />
    </div>
  );
};
