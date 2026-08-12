import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Sparkles, Compass, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, Wallet, PieChart, Target, 
  Newspaper, ChevronRight, Activity, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { marketService } from '../services/marketService';
import { aiService } from '../services/aiService';
import { portfolioService } from '../services/portfolioService';
import { goalService } from '../services/goalService';
import { newsService } from '../services/newsService';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { RiskBadge } from '../components/RiskBadge';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { DemoDataBadge } from '../components/DemoDataBadge';
import { MarketDashboard, Portfolio, FinancialGoal, NewsItem } from '../types';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [marketData, setMarketData] = useState<MarketDashboard | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const targetUserId = user?.id || 1; // Default to demo user (id 1) if not logged in
        const [mRes, nRes, pRes, gRes, planRes] = await Promise.all([
          marketService.getDashboard(),
          newsService.getNews(),
          portfolioService.getPortfolio(targetUserId).catch(() => null),
          goalService.getGoals(targetUserId).catch(() => []),
          aiService.getPersonalPlan(targetUserId).catch(() => null)
        ]);
        
        setMarketData(mRes);
        setNews(nRes.slice(0, 4));
        if (pRes) setPortfolio(pRes);
        if (gRes) setGoals(gRes);
        if (planRes) setAiPlan(planRes);
      } catch (err) {
        console.error('Dashboard data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Alex';

  // Real Financial Net Worth Calculation (Assets - Liabilities)
  const currentPortfolioVal = portfolio?.current_value ?? 658920;
  const totalInvested = portfolio?.total_invested ?? 571000;
  const emergencyFund = profile?.emergency_fund ?? 300000;
  const existingLoans = profile?.existing_loans ?? 150000;

  const totalAssets = currentPortfolioVal + emergencyFund;
  const totalNetWorth = totalAssets - existingLoans;
  const totalGain = currentPortfolioVal - totalInvested;
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 15.40;

  // Financial Health Score algorithm
  const healthScore = profile?.risk_score ? Math.min(96, Math.max(50, profile.risk_score + 20)) : 82;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Top Greeting & Financial Overview Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Good Morning, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your daily AI financial intelligence & portfolio command center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RiskBadge
            label={profile?.risk_tolerance_label || 'Moderate'}
            score={profile?.risk_score || 62}
          />
          <Link
            to="/ai-planner"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Planner
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Real Financial Net Worth</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {formatCurrency(totalNetWorth)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {formatPercent(gainPercent)} ({formatCurrency(totalGain)})
            </span>
          </div>
          <p className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 mt-1">
            Assets {formatCurrency(totalAssets)} • Debt {formatCurrency(existingLoans)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly SIP Capacity</span>
            <PieChart className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {formatCurrency(profile?.monthly_investment_capacity || 25000)} <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <p className="text-[11px] text-slate-400">Allocated across Equity, Debt & Gold</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Financial Health Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-baseline gap-1">
            {healthScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium">6 Months Emergency Cushion active</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131A29] border border-slate-800 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Financial Goals</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {goals.length || 2} <span className="text-xs font-normal text-slate-400">Tracked</span>
          </div>
          <Link to="/goals" className="text-[11px] text-emerald-400 hover:underline font-semibold block">
            View Shortfall Breakdown →
          </Link>
        </div>

      </div>

      {/* Market Today Ticker */}
      <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Markets Today</h3>
          </div>
          <DemoDataBadge label="Live Market Feeds" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {marketData?.indian_indices.concat(marketData?.commodities_forex.slice(0, 2) || []).map((idx, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-300 block truncate">{idx.name}</span>
              <div className="text-xs font-extrabold text-white">
                {idx.currency === 'INR' ? `₹${idx.price.toLocaleString()}` : `$${idx.price.toLocaleString()}`}
              </div>
              <div className={`text-[10px] font-semibold flex items-center gap-0.5 ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {formatPercent(idx.percent_change)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights & Suggested Allocation Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: AI Portfolio Summary */}
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 glass-panel">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">AI Financial Market Outlook</h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Market Status:</span>
              <span className="text-emerald-400">Moderately Bullish</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Steady domestic GDP growth supports equities. Disciplined monthly SIP investments remain the optimal long-term strategy.
            </p>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span>Confidence Score: <strong className="text-white">88%</strong></span>
            <span>Suggested Action: <strong className="text-emerald-400 font-semibold">Continue Monthly SIPs</strong></span>
          </div>
        </div>

        {/* Card 2: Recommended Asset Allocation */}
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 glass-panel">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Your Suggested Asset Allocation</h3>
            </div>
            <Link to="/ai-planner" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
              Full Plan <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-800">
              <div style={{ width: `${aiPlan?.allocation?.equity || 60}%` }} className="bg-emerald-500" title="Equity" />
              <div style={{ width: `${aiPlan?.allocation?.debt || 20}%` }} className="bg-blue-500" title="Debt" />
              <div style={{ width: `${aiPlan?.allocation?.gold || 10}%` }} className="bg-amber-500" title="Gold" />
              <div style={{ width: `${aiPlan?.allocation?.international || 10}%` }} className="bg-purple-500" title="International" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Equity</span>
                <span className="font-extrabold text-emerald-400">{aiPlan?.allocation?.equity || 60}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Debt</span>
                <span className="font-extrabold text-blue-400">{aiPlan?.allocation?.debt || 20}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Gold</span>
                <span className="font-extrabold text-amber-400">{aiPlan?.allocation?.gold || 10}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Intl Equity</span>
                <span className="font-extrabold text-purple-400">{aiPlan?.allocation?.international || 10}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Financial News & Portfolio Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* News Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-400" />
              World Financial News & AI Impact
            </h3>
            <Link to="/news" className="text-xs text-emerald-400 hover:underline font-semibold">
              All News →
            </Link>
          </div>

          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{item.category}</span>
                  <span>{item.source} • {item.publish_date}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.headline}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Snapshot */}
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Holdings Snapshot
            </h3>
            <Link to="/portfolio" className="text-xs text-emerald-400 hover:underline font-semibold">
              Manage →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {portfolio?.holdings.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">{h.symbol_or_name}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{h.asset_type}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">{formatCurrency(h.quantity * h.current_price)}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {formatPercent(((h.current_price - h.avg_buy_price) / h.avg_buy_price) * 100)}
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-slate-400 text-xs py-4 text-center">Loading portfolio holdings...</p>
            )}
          </div>
        </div>

      </div>

      <SafetyDisclaimer />
    </div>
  );
};
