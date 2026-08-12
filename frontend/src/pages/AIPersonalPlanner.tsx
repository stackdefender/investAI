import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, PieChart as PieChartIcon, 
  Sliders, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';
import { formatCurrency } from '../utils/formatters';
import { RiskBadge } from '../components/RiskBadge';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const AIPersonalPlanner: React.FC = () => {
  const { user, profile } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTuning, setShowTuning] = useState(false);

  // Interactive Parameter States for Recalculation
  const [monthlySip, setMonthlySip] = useState<number>(25000);
  const [riskScore, setRiskScore] = useState<number>(65);
  const [horizonYears, setHorizonYears] = useState<number>(15);
  const [age, setAge] = useState<number>(30);

  useEffect(() => {
    if (profile) {
      if (profile.monthly_investment_capacity) setMonthlySip(profile.monthly_investment_capacity);
      if (profile.risk_score) setRiskScore(profile.risk_score);
      if (profile.investment_duration) setHorizonYears(profile.investment_duration);
      if (profile.age) setAge(profile.age);
    }
  }, [profile]);

  const computeDynamicPlan = (sip: number, risk: number, horizon: number, userAge: number) => {
    // Dynamic formula for allocation
    let equityPct = Math.max(20, Math.min(85, Math.round(risk * 0.75 + (100 - userAge) * 0.15)));
    let debtPct = Math.max(10, Math.min(50, Math.round((100 - equityPct) * 0.65)));
    let goldPct = Math.max(5, Math.min(15, Math.round((100 - equityPct - debtPct) * 0.6)));
    let intlPct = Math.max(0, 100 - equityPct - debtPct - goldPct);

    const getRiskLabel = (s: number) => {
      if (s < 40) return 'Conservative';
      if (s < 70) return 'Moderate Risk';
      return 'Aggressive Growth';
    };

    const riskLabel = getRiskLabel(risk);

    return {
      allocation: {
        equity: equityPct,
        debt: debtPct,
        gold: goldPct,
        international: intlPct
      },
      reasoning: `Tailored for Age ${userAge} (${riskLabel}, ${risk}/100 score) with a ${horizon}-year horizon. Allocating ${equityPct}% to equities captures compounding growth while maintaining ${debtPct}% debt and ${goldPct}% gold as buffer against downside volatility.`,
      breakdown_advice: [
        {
          asset_class: 'Equity Mutual Funds & Stocks',
          percentage: equityPct,
          monthly_amount: Math.round(sip * (equityPct / 100)),
          why: `Primary growth driver via Nifty 50 Index and Flexi-cap funds across a ${horizon}-yr horizon.`
        },
        {
          asset_class: 'Debt Instruments (PPF / Debt Funds)',
          percentage: debtPct,
          monthly_amount: Math.round(sip * (debtPct / 100)),
          why: `Stability layer providing guaranteed yields and rebalancing liquidity during market corrections.`
        },
        {
          asset_class: 'Gold & Sovereign Gold Bonds',
          percentage: goldPct,
          monthly_amount: Math.round(sip * (goldPct / 100)),
          why: `Inflation hedge safeguarding purchasing power against currency devaluation.`
        },
        {
          asset_class: 'International Equity Funds',
          percentage: intlPct,
          monthly_amount: Math.round(sip * (intlPct / 100)),
          why: `Global diversification into US S&P 500 tech leaders for INR-USD currency hedge.`
        }
      ],
      important_assumptions: [
        `Assumes disciplined monthly SIP reinvestment over ${horizon} years`,
        `Assumes equity return CAGR of 12-14% and debt CAGR of 6-7%`,
        `Emergency fund of at least 6 months expenses held separately`
      ]
    };
  };

  const fetchPlan = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const data = await aiService.getPersonalPlan(user.id);
        if (data && data.allocation) {
          setPlan(data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend plan fallback triggered:', err);
    }
    
    // Fallback/instant calculation
    const calculated = computeDynamicPlan(monthlySip, riskScore, horizonYears, age);
    setPlan(calculated);
    setLoading(false);
  };

  const handleRecalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = computeDynamicPlan(monthlySip, riskScore, horizonYears, age);
      setPlan(updated);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchPlan();
  }, [user?.id]);

  const allocationData = plan?.allocation ? [
    { name: 'Equity', value: plan.allocation.equity, color: '#10B981' },
    { name: 'Debt', value: plan.allocation.debt, color: '#3B82F6' },
    { name: 'Gold / SGB', value: plan.allocation.gold, color: '#F59E0B' },
    { name: 'International', value: plan.allocation.international, color: '#8B5CF6' }
  ] : [];

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI PORTFOLIO ENGINE
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white">AI Personal Investment Plan</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic asset allocation tuned to your risk profile and financial goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTuning(!showTuning)}
            className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            {showTuning ? 'Hide Inputs' : 'Adjust Inputs'}
          </button>

          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-glow-emerald flex items-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recalculate Plan
          </button>
        </div>
      </div>

      {/* Interactive Parameter Tuning Drawer / Bar */}
      {showTuning && (
        <div className="p-4 rounded-2xl bg-[#131A29] border border-emerald-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Tune Allocation Parameters
            </h3>
            <button 
              onClick={handleRecalculate}
              className="text-xs text-emerald-400 font-semibold hover:underline"
            >
              Apply & Update →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Monthly SIP: <span className="text-white font-bold">{formatCurrency(monthlySip)}</span></label>
              <input 
                type="range" 
                min="5000" 
                max="200000" 
                step="5000"
                value={monthlySip} 
                onChange={(e) => setMonthlySip(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Risk Score: <span className="text-emerald-400 font-bold">{riskScore}/100</span></label>
              <input 
                type="range" 
                min="20" 
                max="95" 
                step="5"
                value={riskScore} 
                onChange={(e) => setRiskScore(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Horizon: <span className="text-white font-bold">{horizonYears} Years</span></label>
              <input 
                type="range" 
                min="3" 
                max="30" 
                step="1"
                value={horizonYears} 
                onChange={(e) => setHorizonYears(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Age: <span className="text-white font-bold">{age} Yrs</span></label>
              <input 
                type="range" 
                min="18" 
                max="65" 
                step="1"
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overview Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#131A29] border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400 block">Risk Profile Score</span>
          <div className="mt-0.5">
            <RiskBadge label={riskScore > 70 ? 'Aggressive' : riskScore > 45 ? 'Moderate' : 'Conservative'} score={riskScore} />
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Time Horizon</span>
          <span className="text-sm sm:text-base font-bold text-white block mt-0.5">{horizonYears} Years</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Monthly SIP Target</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">{formatCurrency(monthlySip)} / mo</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">Target Age Horizon</span>
          <span className="text-sm sm:text-base font-bold text-blue-400 block mt-0.5">Age {age + horizonYears}</span>
        </div>
      </div>

      {/* Asset Allocation & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-5 space-y-3 flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5 self-start uppercase tracking-wider text-slate-300">
            <PieChartIcon className="w-3.5 h-3.5 text-emerald-400" />
            Asset Allocation Split
          </h3>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Allocation']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full text-xs">
            {allocationData.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <span className="text-slate-300 font-medium truncate">{a.name}</span>
                <span className="font-bold text-white ml-auto">{a.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Breakdown Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#131A29] p-5 space-y-4">
          
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Investment Strategy</h3>
            <p className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              {plan?.reasoning || "Calculating customized asset allocation reasoning..."}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly {formatCurrency(monthlySip)} Deployment Plan</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plan?.breakdown_advice?.map((item: any, idx: number) => {
                const pct = item.percentage || 0;
                const amt = (item.monthly_amount && item.monthly_amount > 0)
                  ? item.monthly_amount
                  : Math.round(monthlySip * (pct / 100));
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="text-emerald-400 truncate">{item.asset_class}</span>
                      <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-extrabold text-[11px]">
                        {pct}% share • {formatCurrency(amt)}/mo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{item.why}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Guidelines */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Plan Guidelines:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              {plan?.important_assumptions?.map((ass: string, i: number) => (
                <li key={i}>{ass}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      <SafetyDisclaimer />
    </div>
  );
};
