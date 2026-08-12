export const GLOBAL_SAFETY_DISCLAIMER = 
  "Investments are subject to market risks. InvestAI provides educational analysis, market reasoning, and scenario modeling based on historical data. This platform does NOT provide guaranteed returns or individualized certified investment advice.";

export const getRiskBadgeColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case 'conservative':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'moderately conservative':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    case 'moderate':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'moderately aggressive':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'aggressive':
    case 'very high':
    case 'high risk':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
};
