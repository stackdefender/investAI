import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Filter, 
  Globe, 
  ExternalLink, 
  Link as LinkIcon, 
  PlusCircle, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Zap, 
  Layers, 
  DollarSign, 
  ShieldCheck,
  Building2,
  PieChart
} from 'lucide-react';
import { newsService } from '../services/newsService';
import { aiService } from '../services/aiService';
import { NewsItem, NewsImpactAnalysis } from '../types';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { DemoDataBadge } from '../components/DemoDataBadge';

export const WorldNews: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  
  // URL Scraping state
  const [inputUrl, setInputUrl] = useState<string>('');
  const [fetchingUrl, setFetchingUrl] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Custom text manual state
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customHeadline, setCustomHeadline] = useState<string>('');
  const [customSummary, setCustomSummary] = useState<string>('');
  const [customSource, setCustomSource] = useState<string>('Web Source');
  const [customCategory, setCustomCategory] = useState<string>('Markets');
  const [addingCustom, setAddingCustom] = useState<boolean>(false);

  // AI Modal state
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [aiImpact, setAiImpact] = useState<NewsImpactAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  const [loading, setLoading] = useState(true);
  const [rssLoading, setRssLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsService.getNews(selectedCategory, selectedRegion);
      setNewsList(res);
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, selectedRegion]);

  const handleFetchUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl || !inputUrl.trim()) return;

    let targetUrl = inputUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setFetchingUrl(true);
    setUrlError(null);

    try {
      const newArticle = await newsService.fetchAndAnalyzeUrl(targetUrl, selectedCategory, selectedRegion);
      setNewsList((prev) => [newArticle, ...prev.filter(n => n.id !== newArticle.id)]);
      setInputUrl('');
      // Open AI modal automatically for instant feedback!
      handleOpenAIModal(newArticle);
    } catch (err: any) {
      console.error('URL fetch error:', err);
      setUrlError(err.response?.data?.detail || 'Failed to fetch article from this news URL. Please check the web link.');
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleAddCustomNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeadline.trim() || !customSummary.trim()) return;

    setAddingCustom(true);
    try {
      const newItem = await newsService.addCustomNews({
        headline: customHeadline,
        summary: customSummary,
        source: customSource || 'Custom Web Ingestion',
        category: customCategory,
        region: selectedRegion === 'All' ? 'Global Economy' : selectedRegion
      });
      setNewsList((prev) => [newItem, ...prev]);
      setShowCustomModal(false);
      setCustomHeadline('');
      setCustomSummary('');
      // Open AI Analysis immediately
      handleOpenAIModal(newItem);
    } catch (err) {
      console.error('Error adding custom news:', err);
    } finally {
      setAddingCustom(false);
    }
  };

  const handleFetchLiveRss = async () => {
    setRssLoading(true);
    try {
      const updatedList = await newsService.getLiveRssNews();
      setNewsList(updatedList);
    } catch (err) {
      console.error('Live RSS error:', err);
    } finally {
      setRssLoading(false);
    }
  };

  const handleOpenAIModal = async (item: NewsItem) => {
    setSelectedNews(item);
    if (item.ai_impact_analysis && (item.ai_impact_analysis.what_happened || item.ai_impact_analysis.headline_summary)) {
      setAiImpact(item.ai_impact_analysis);
      setAnalyzing(false);
    } else {
      setAnalyzing(true);
      try {
        const res = await aiService.analyzeNewsImpact(item.headline, item.summary, item.category);
        setAiImpact(res);
      } catch (err) {
        console.error('News impact analysis error:', err);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const copyAnalysisSummary = () => {
    if (!selectedNews || !aiImpact) return;
    const text = `📰 INVESTAI MARKET ANALYSIS\n\nHeadline: "${selectedNews.headline}"\nSource: ${selectedNews.source}\nSentiment: ${aiImpact.sentiment || selectedNews.sentiment}\nImpact Score: ${aiImpact.impact_score || 80}/100\n\nWhat Happened:\n${aiImpact.what_happened || aiImpact.headline_summary}\n\nKey Investor Action:\n${aiImpact.key_investor_action || aiImpact.recommended_investor_action}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getSentimentBadge = (sentiment?: string) => {
    const s = (sentiment || '').toLowerCase();
    if (s.includes('bullish') || s.includes('positive')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <TrendingUp className="w-3.5 h-3.5" /> Bullish Market
        </span>
      );
    } else if (s.includes('bearish') || s.includes('negative')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <TrendingDown className="w-3.5 h-3.5" /> Bearish Shift
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Minus className="w-3.5 h-3.5" /> Neutral Sentiment
      </span>
    );
  };

  const sampleNewsSites = [
    { name: 'Reuters Wire', url: 'https://www.reuters.com/business/finance' },
    { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/markets' },
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news' },
    { name: 'CNBC Markets', url: 'https://www.cnbc.com/world-markets' },
    { name: 'Moneycontrol', url: 'https://www.moneycontrol.com/news/business/markets/' }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            LIVE WORLD FINANCIAL NEWS & AI IMPACT ENGINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">World Financial News</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ingest articles from any news website URL, live RSS feeds, or custom articles, with AI-driven sector impact breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFetchLiveRss}
            disabled={rssLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${rssLoading ? 'animate-spin' : ''}`} />
            {rssLoading ? 'Fetching Live Wire...' : 'Sync Live Wire'}
          </button>
          <DemoDataBadge label="Real-Time News AI" />
        </div>
      </div>

      {/* URL Scraping & Ingestion Bar */}
      <div className="rounded-2xl border border-indigo-500/30 bg-[#131A29] p-5 sm:p-6 space-y-4 shadow-xl glass-panel relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Analyze News From Any Website</h2>
              <p className="text-[11px] text-slate-400">Paste any URL (Reuters, Economic Times, Yahoo Finance, CNBC, Moneycontrol) to scrape and analyze with AI.</p>
            </div>
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            Add Manual Article
          </button>
        </div>

        <form onSubmit={handleFetchUrl} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste article URL (e.g. https://www.reuters.com/business/... or https://economictimes.indiatimes.com/...)"
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            {inputUrl && (
              <button
                type="button"
                onClick={() => setInputUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={fetchingUrl || !inputUrl.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-50 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            {fetchingUrl ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Scraping & AI Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Fetch & Analyze with AI
              </>
            )}
          </button>
        </form>

        {urlError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            ⚠️ {urlError}
          </div>
        )}

        {/* Quick Sample Links */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 font-semibold shrink-0">Sample Sources:</span>
          {sampleNewsSites.map((site) => (
            <button
              key={site.name}
              onClick={() => setInputUrl(site.url)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 font-mono transition-colors shrink-0 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 text-slate-500" />
              {site.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Region Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131A29] p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Sector:
          </span>
          {['All', 'India', 'Interest Rates', 'Oil & Commodities', 'China', 'Markets'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          Add Article
        </button>
      </div>

      {/* News Feed Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p>Loading real-time financial news wire...</p>
        </div>
      ) : newsList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#131A29] text-slate-400 text-xs space-y-3">
          <Globe className="w-8 h-8 mx-auto text-slate-600" />
          <p>No news articles found for selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsList.map((item) => (
            <div 
              key={item.id} 
              className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all glass-panel group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.category}
                    </span>
                    {getSentimentBadge(item.sentiment)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{item.publish_date}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  {item.headline}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-400" />
                    Source: <strong className="text-emerald-400 font-mono">{item.source}</strong>
                  </span>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono hover:underline"
                    >
                      Visit Original <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Related Markets:</strong> {item.related_markets}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Sector Analysis: <strong className="text-slate-200">Ready</strong></span>
                </div>

                <button
                  onClick={() => handleOpenAIModal(item)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Analyze Market Impact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Impact Breakdown Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="rounded-3xl border border-emerald-500/30 bg-[#131A29] p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl shadow-emerald-500/10 my-8 max-h-[90vh] overflow-y-auto glass-panel border-glow">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  INVESTAI FINANCIAL INTELLIGENCE ANALYSIS
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                  "{selectedNews.headline}"
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Source: <strong className="text-emerald-400">{selectedNews.source}</strong></span>
                  <span>•</span>
                  <span>Category: {selectedNews.category}</span>
                </p>
              </div>

              <button
                onClick={() => { setSelectedNews(null); setAiImpact(null); }}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-mono transition-colors"
              >
                ✕
              </button>
            </div>

            {analyzing ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-400" />
                <p className="text-xs font-semibold text-slate-300">Generating AI Financial Impact Breakdown...</p>
                <p className="text-[11px] text-slate-500">Evaluating sector sentiment, equities, bond yields, and investor recommendations.</p>
              </div>
            ) : aiImpact ? (
              <div className="space-y-6">

                {/* Score & Sentiment Meter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Sentiment */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Market Sentiment</span>
                    <div className="mt-2">
                      {getSentimentBadge(aiImpact.sentiment || selectedNews.sentiment)}
                    </div>
                  </div>

                  {/* Impact Score */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Market Impact Score</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-extrabold text-amber-400 font-mono">
                        {aiImpact.impact_score || 78}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">/ 100</span>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Risk Horizon</span>
                    <div className="text-sm font-bold text-indigo-400 mt-1">
                      {aiImpact.risk_level || 'Moderate Risk'}
                    </div>
                  </div>
                </div>

                {/* 1. What Happened & 2. Why It Matters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Zap className="w-4 h-4" />
                      <span>1. What Happened?</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {aiImpact.what_happened || aiImpact.headline_summary || selectedNews.summary}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <Globe className="w-4 h-4" />
                      <span>2. Why Does It Matter?</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {aiImpact.why_it_matters || aiImpact.indian_equities_impact || "Directly impacts investor liquidity, corporate profit forecasts, and institutional money flows."}
                    </p>
                  </div>
                </div>

                {/* Sector Impact Matrix */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                      <PieChart className="w-4 h-4" />
                      3. Sector & Stock Impact Matrix
                    </span>
                    <span className="text-[11px] text-slate-500">Categorized by Stock Sectors</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(aiImpact.sectors_affected || aiImpact.sector_impacts || []).map((sec, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{sec.sector}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (sec.impact || '').toLowerCase().includes('positive') 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : (sec.impact || '').toLowerCase().includes('negative')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {sec.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {sec.detail || sec.reason}
                        </p>
                        {sec.key_stocks && (
                          <div className="text-[10px] text-indigo-400 font-mono pt-0.5">
                            Impacted Tickers: {sec.key_stocks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asset Class Impact Grid */}
                {aiImpact.asset_class_impact && (
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5 text-xs">
                      <Layers className="w-4 h-4" />
                      4. Broad Asset Class Outlook
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-semibold block">Equities</span>
                        <span className="text-emerald-400 font-bold mt-1 block">
                          {aiImpact.asset_class_impact.equities || "Positive"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-semibold block">Bonds & Debt</span>
                        <span className="text-blue-400 font-bold mt-1 block">
                          {aiImpact.asset_class_impact.bonds_debt || "Stable"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-semibold block">Gold & Metals</span>
                        <span className="text-amber-400 font-bold mt-1 block">
                          {aiImpact.asset_class_impact.gold || "Supportive"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-semibold block">Forex (INR/USD)</span>
                        <span className="text-teal-400 font-bold mt-1 block">
                          {aiImpact.asset_class_impact.currency || "Range-Bound"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actionable Investor Guidance */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/30 text-xs space-y-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    Investor Action Recommendation
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {aiImpact.key_investor_action || aiImpact.recommended_investor_action}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <button
                    onClick={copyAnalysisSummary}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        Copy Summary
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => { setSelectedNews(null); setAiImpact(null); }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                  >
                    Done
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

      {/* Custom Article Ingestion Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl border border-slate-800 bg-[#131A29] p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl glass-panel">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Add Custom Financial News Article
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomNews} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">News Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder="e.g., Tech Giant Announces $10B Infrastructure Investment in India"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Article Summary / Content *</label>
                <textarea
                  required
                  rows={4}
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  placeholder="Paste main paragraphs or executive summary of the news story..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Source Name</label>
                  <input
                    type="text"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    placeholder="e.g. Wall Street Journal"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Markets">Markets</option>
                    <option value="India">India</option>
                    <option value="Interest Rates">Interest Rates</option>
                    <option value="Oil & Commodities">Oil & Commodities</option>
                    <option value="China">China</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCustom}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
                >
                  {addingCustom ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Publish & Analyze
                    </>
                  )}
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
