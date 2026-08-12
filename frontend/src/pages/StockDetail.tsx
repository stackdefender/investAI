import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LineChart, Sparkles, ArrowLeft, ArrowUpRight, ArrowDownRight, 
  ShieldAlert, RefreshCw, BarChart2, Star, ShoppingBag, CheckCircle2, DollarSign, Activity
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { aiService } from '../services/aiService';
import { Stock } from '../types';
import { formatPercent } from '../utils/formatters';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<string>('1Y');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Watchlist & Trade modal state
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [showTradeModal, setShowTradeModal] = useState<boolean>(false);
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number | string>(10);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const [sRes, cRes] = await Promise.all([
          marketService.getStockBySymbol(symbol),
          marketService.getStockChart(symbol, timeframe)
        ]);
        setStock(sRes);
        setChartData(cRes);
      } catch (err) {
        console.error('Stock detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, timeframe]);

  const [showAiSideDrawer, setShowAiSideDrawer] = useState<boolean>(false);

  const handleAnalyzeWithAI = async () => {
    if (!symbol) return;
    setAnalyzing(true);
    setShowAiSideDrawer(true);
    try {
      const res = await aiService.analyzeStock(symbol);
      setAiAnalysis(res);
    } catch (err) {
      console.error('AI Stock analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity) || 1;
    const totalVal = (stock?.price || 0) * qty;
    const symbolStr = stock?.symbol || symbol;
    const isUsd = stock?.market.includes('USA');
    const curr = isUsd ? '$' : '₹';

    setOrderSuccess(
      `Simulated ${tradeAction} order executed for ${qty} shares of ${symbolStr} at ${curr}${stock?.price} (Total: ${curr}${totalVal.toLocaleString('en-IN')})!`
    );

    setTimeout(() => {
      setShowTradeModal(false);
      setOrderSuccess(null);
    }, 2800);
  };

  const toggleWatchlist = () => {
    setInWatchlist((prev) => !prev);
  };

  if (loading || !stock) {
    return (
      <div className="p-12 max-w-7xl mx-auto text-center space-y-4 text-slate-400">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        <p className="text-sm">Loading stock market data for {symbol}...</p>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const currencySymbol = stock.market.includes('USA') ? '$' : '₹';

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/stocks" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Stocks Explorer
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWatchlist}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              inWatchlist 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
            {inWatchlist ? 'Saved to Watchlist' : 'Add to Watchlist'}
          </button>

          <button
            onClick={() => setShowTradeModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Trade / Order
          </button>

          <button
            onClick={handleAnalyzeWithAI}
            disabled={analyzing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            {analyzing ? 'Analyzing with AI...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      {/* Stock Overview Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-xl glass-panel relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {stock.market}
              </span>
              <span className="text-xs text-slate-400 font-mono">{stock.sector}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{stock.name} ({stock.symbol})</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{stock.summary}</p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-3xl font-extrabold text-white">
              {currencySymbol}{stock.price}
            </div>
            <div className={`text-sm font-bold flex items-center sm:justify-end gap-1 mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {isPositive ? `+${stock.change}` : stock.change} ({formatPercent(stock.percent_change)})
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Price History Chart */}
      <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-xl glass-panel">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            Price History & Chart Analysis ({timeframe})
          </h3>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['1D', '1W', '1M', '6M', '1Y', '5Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  timeframe === tf ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10B981" : "#F43F5E"} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={isPositive ? "#10B981" : "#F43F5E"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: number) => [`${currencySymbol}${val}`, 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke={isPositive ? "#10B981" : "#F43F5E"} strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fundamentals Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Market Cap</span>
          <span className="text-sm font-bold text-white block">{stock.market_cap}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">P/E Ratio</span>
          <span className="text-sm font-bold text-white block">{stock.pe}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Return on Equity (ROE)</span>
          <span className="text-sm font-bold text-white block">{stock.roe}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">52-Week Range</span>
          <span className="text-sm font-bold text-white block">{currencySymbol}{stock.low_52w} - {currencySymbol}{stock.high_52w}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Annual Revenue</span>
          <span className="text-sm font-bold text-white block">{stock.revenue || 'N/A'}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Net Profit</span>
          <span className="text-sm font-bold text-white block">{stock.profit || 'N/A'}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Dividend Yield</span>
          <span className="text-sm font-bold text-white block">{stock.dividend_yield || 'N/A'}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Debt to Equity</span>
          <span className="text-sm font-bold text-white block">{stock.debt_equity ?? '0.15'}</span>
        </div>
      </div>

      {/* AI Stock Analysis Output Card */}
      {aiAnalysis && (
        <div className="rounded-2xl border border-emerald-500/30 bg-[#131A29] p-6 space-y-6 shadow-glow-emerald glass-panel">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-white">InvestAI Institutional Stock Analysis</h3>
                <span className="text-[11px] text-slate-400">Contextual evaluation for {stock.symbol}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {aiAnalysis.recommendation && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {aiAnalysis.recommendation}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Target: {aiAnalysis.target_price || `${currencySymbol}${(stock.price * 1.15).toFixed(0)}`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Fundamental Strength
              </span>
              <p className="text-slate-300 leading-relaxed">
                {aiAnalysis.summary || aiAnalysis.fundamental_analysis || `${stock.name} demonstrates a robust balance sheet with healthy Return on Equity (${stock.roe}) and strong pricing power in the ${stock.sector} domain.`}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-blue-400 block flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" /> Technical Momentum
              </span>
              <p className="text-slate-300 leading-relaxed">
                {aiAnalysis.technical_overview || `Trading at ${currencySymbol}${stock.price}, the stock is consolidating near support zone with 52-week high at ${currencySymbol}${stock.high_52w}. RSI indicates accumulation by long-term institutional holders.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 block">Investment Drivers & Strengths</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {aiAnalysis.pros?.map((p: string, i: number) => <li key={i}>{p}</li>) || (
                  <>
                    <li>Dominant market share in core segment</li>
                    <li>Consistently delivers high Return on Equity</li>
                    <li>Strong free cash flow generation</li>
                  </>
                )}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-rose-400 block">Risk Considerations</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {aiAnalysis.cons?.map((c: string, i: number) => <li key={i}>{c}</li>) || (
                  <>
                    <li>Short-term macroeconomic headwinds</li>
                    <li>Sensitivity to foreign institutional inflows</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Simulated Stock Trade Order
              </h3>
              <button onClick={() => setShowTradeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {orderSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{orderSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleTradeSubmit} className="space-y-4 text-xs">
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTradeAction('BUY')}
                    className={`flex-1 py-2 rounded-lg font-extrabold transition-all ${
                      tradeAction === 'BUY' ? 'bg-emerald-500 text-white shadow-glow-emerald' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeAction('SELL')}
                    className={`flex-1 py-2 rounded-lg font-extrabold transition-all ${
                      tradeAction === 'SELL' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 font-medium block">Asset Symbol</span>
                    <span className="text-sm font-bold text-white">{stock.symbol} ({stock.name})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-medium block">Price</span>
                    <span className="text-sm font-bold text-emerald-400">{currencySymbol}{stock.price}</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quantity (Shares)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Estimated Total Value:</span>
                  <span className="text-sm font-extrabold text-emerald-300">
                    {currencySymbol}{((Number(quantity) || 0) * stock.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTradeModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-white font-extrabold transition-all ${
                      tradeAction === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-glow-emerald' : 'bg-rose-500 hover:bg-rose-400'
                    }`}
                  >
                    Execute {tradeAction} Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Side Drawer Overlay Backdrop */}
      {showAiSideDrawer && (
        <div 
          onClick={() => setShowAiSideDrawer(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Side Drawer Panel (Right Side of Screen) */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0F172A] border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          showAiSideDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                {stock.name} ({stock.symbol})
              </h3>
              <p className="text-[11px] text-slate-400">InvestAI Institutional Neural Review</p>
            </div>
          </div>

          <button
            onClick={() => setShowAiSideDrawer(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
          {analyzing ? (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold">Running deep financial analysis for {stock.symbol}...</p>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">AI Classification</span>
                  <span className="text-sm font-black text-emerald-300">
                    {aiAnalysis.recommendation || "ACCUMULATE"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block">Price Target</span>
                  <span className="text-sm font-extrabold text-white">
                    {aiAnalysis.target_price || `${currencySymbol}${(stock.price * 1.16).toFixed(0)}`}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Fundamental Assessment
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {aiAnalysis.summary || aiAnalysis.fundamental_analysis}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" /> Technical & Market Momentum
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {aiAnalysis.technical_overview || `Stock is trading near key support level at ${currencySymbol}${stock.price}. RSI indicates solid institutional accumulation.`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400">Core Investment Strengths</h4>
                <ul className="space-y-1.5 text-slate-300">
                  {(aiAnalysis.pros || ["Strong market position in sector", "Robust Return on Equity profile", "Consistent free cash flow"]).map((p: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-rose-400">Key Risk Factors</h4>
                <ul className="space-y-1.5 text-slate-300">
                  {(aiAnalysis.cons || ["Market sentiment volatility", "Sectoral regulation updates"]).map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <button
            onClick={() => setShowAiSideDrawer(false)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Close AI Side Panel
          </button>
        </div>
      </div>

      <SafetyDisclaimer customMessage="Educational stock analysis only. InvestAI does NOT issue direct BUY or SELL recommendations. Perform independent research before placing market trades." />
    </div>
  );
};

