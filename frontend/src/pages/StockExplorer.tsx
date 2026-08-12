import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Search, Sparkles, ArrowUpRight, ArrowDownRight, 
  ChevronRight, X, Activity, BarChart2, CheckCircle2, ShieldAlert, ShoppingBag, RefreshCw 
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { aiService } from '../services/aiService';
import { Stock } from '../types';
import { formatPercent } from '../utils/formatters';

export const StockExplorer: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Side Drawer AI state
  const [selectedStockForAI, setSelectedStockForAI] = useState<Stock | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingSymbol, setAnalyzingSymbol] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const res = await marketService.getStocks(search);
        setStocks(res);
      } catch (err) {
        console.error('Stocks fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, [search]);

  const handleOpenAiDrawer = async (stock: Stock, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStockForAI(stock);
    setAiAnalysis(null);
    setAnalyzingSymbol(stock.symbol);

    try {
      const res = await aiService.analyzeStock(stock.symbol);
      setAiAnalysis(res);
    } catch (err) {
      console.error('AI Analysis error:', err);
    } finally {
      setAnalyzingSymbol(null);
    }
  };

  const filteredStocks = stocks.filter((s) => {
    if (categoryFilter === 'NSE') return s.market.includes('NSE');
    if (categoryFilter === 'NASDAQ') return s.market.includes('NASDAQ');
    if (categoryFilter === 'BANKING') return s.sector.toLowerCase().includes('bank') || s.sector.toLowerCase().includes('financial');
    if (categoryFilter === 'TECH') return s.sector.toLowerCase().includes('tech') || s.sector.toLowerCase().includes('software');
    return true;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20 mb-2">
            <LineChart className="w-3.5 h-3.5" />
            GLOBAL & INDIAN STOCK EXPLORER
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Stock Markets Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search top stocks across NSE and NASDAQ with fundamental metrics, price charts, and 1-click AI analysis.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol e.g. RELIANCE, TCS, AAPL..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#131A29] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: 'ALL', label: 'All Markets' },
          { id: 'NSE', label: '🇮🇳 NSE India Bluechips' },
          { id: 'NASDAQ', label: '🇺🇸 NASDAQ US Tech' },
          { id: 'BANKING', label: '🏦 Banking & Finance' },
          { id: 'TECH', label: '💻 IT & Software' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setCategoryFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
              categoryFilter === f.id
                ? 'bg-emerald-500 text-white shadow-glow-emerald'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map((stock) => {
          const isPositive = stock.change >= 0;
          const currency = stock.market.includes('USA') ? '$' : '₹';

          return (
            <div key={stock.symbol} className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between glass-panel">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono block">{stock.market} • {stock.sector}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{stock.name}</h3>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">{stock.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-white">
                      {currency}{stock.price}
                    </div>
                    <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isPositive ? `+${stock.change}` : stock.change} ({formatPercent(stock.percent_change)})
                    </div>
                  </div>
                </div>

                {/* Key Fundamentals Pills */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800/80">
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">P/E Ratio</span>
                    <span className="font-bold text-white">{stock.pe}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">ROE</span>
                    <span className="font-bold text-white">{stock.roe}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">Market Cap</span>
                    <span className="font-bold text-white truncate block">{stock.market_cap}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {stock.summary}
                </p>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={(e) => handleOpenAiDrawer(stock, e)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Analyze with AI</span>
                </button>

                <Link
                  to={`/stocks/${stock.symbol}`}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 transition-all"
                >
                  Charts & Trade <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Drawer Overlay Backdrop */}
      {selectedStockForAI && (
        <div 
          onClick={() => setSelectedStockForAI(null)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Side Drawer Panel (Right Side of Screen) */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0F172A] border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          selectedStockForAI ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedStockForAI && (
          <>
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {selectedStockForAI.name} ({selectedStockForAI.symbol})
                  </h3>
                  <p className="text-[11px] text-slate-400">{selectedStockForAI.market} • {selectedStockForAI.sector}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStockForAI(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Stock Price Banner inside Side Panel */}
              <div className="p-4 rounded-xl bg-[#131A29] border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Price</span>
                  <span className="text-2xl font-extrabold text-white">
                    {selectedStockForAI.market.includes('USA') ? '$' : '₹'}{selectedStockForAI.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">24h Change</span>
                  <span className={`font-bold text-xs flex items-center justify-end gap-0.5 ${selectedStockForAI.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedStockForAI.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {formatPercent(selectedStockForAI.percent_change)}
                  </span>
                </div>
              </div>

              {/* Loading Spinner or AI Results */}
              {analyzingSymbol ? (
                <div className="py-12 text-center space-y-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs font-semibold">InvestAI is running neural financial analysis for {selectedStockForAI.symbol}...</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-5">
                  {/* Rating & Classification Badge */}
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
                        {aiAnalysis.target_price || `${selectedStockForAI.market.includes('USA') ? '$' : '₹'}${(selectedStockForAI.price * 1.16).toFixed(0)}`}
                      </span>
                    </div>
                  </div>

                  {/* Fundamental Summary */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> Fundamental Assessment
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {aiAnalysis.summary || aiAnalysis.fundamental_analysis}
                    </p>
                  </div>

                  {/* Technical Momentum */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4" /> Technical & Market Momentum
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {aiAnalysis.technical_overview || `Stock is trading near key support level with 52-week range between ${selectedStockForAI.low_52w} and ${selectedStockForAI.high_52w}. Consolidating for long-term growth.`}
                    </p>
                  </div>

                  {/* Strengths & Drivers */}
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

                  {/* Risk Considerations */}
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

            {/* Drawer Footer CTA */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
              <Link
                to={`/stocks/${selectedStockForAI.symbol}`}
                onClick={() => setSelectedStockForAI(null)}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs text-center shadow-glow-emerald flex items-center justify-center gap-1.5 transition-all"
              >
                Open Full Charts, Trade & Fundamentals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


