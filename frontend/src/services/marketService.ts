import { api } from './api';
import { MarketDashboard, Stock, MutualFund } from '../types';

export const DEMO_STOCKS: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    market: "India (NSE)",
    sector: "Energy / Conglomerate",
    price: 2980.50,
    change: 24.50,
    percent_change: 0.83,
    market_cap: "₹20,15,400 Cr",
    pe: 26.4,
    eps: 112.8,
    dividend_yield: "0.33%",
    high_52w: 3217.90,
    low_52w: 2220.30,
    revenue: "₹9,00,000 Cr",
    profit: "₹79,000 Cr",
    roe: "9.8%",
    debt_equity: 0.38,
    summary: "India's largest private enterprise with market-leading positions in Energy, Jio Telecom, and Retail."
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    market: "India (NSE)",
    sector: "Information Technology",
    price: 4210.00,
    change: 45.20,
    percent_change: 1.09,
    market_cap: "₹15,22,800 Cr",
    pe: 32.1,
    eps: 131.2,
    dividend_yield: "1.38%",
    high_52w: 4585.00,
    low_52w: 3310.00,
    revenue: "₹2,40,890 Cr",
    profit: "₹45,900 Cr",
    roe: "48.2%",
    debt_equity: 0.08,
    summary: "Global IT services leader with massive operating margin resilience, fortress balance sheet, and dividend track record."
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    market: "India (NSE)",
    sector: "Banking & Financial Services",
    price: 1645.75,
    change: -8.30,
    percent_change: -0.50,
    market_cap: "₹12,50,000 Cr",
    pe: 18.5,
    eps: 88.9,
    dividend_yield: "1.18%",
    high_52w: 1794.00,
    low_52w: 1363.00,
    revenue: "₹2,05,000 Cr",
    profit: "₹64,000 Cr",
    roe: "16.4%",
    debt_equity: 6.8,
    summary: "India's premier private bank post-merger with HDFC Ltd, boasting a dominant low-cost CASA deposit franchise."
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    market: "India (NSE)",
    sector: "Information Technology",
    price: 1795.30,
    change: 22.40,
    percent_change: 1.26,
    market_cap: "₹7,45,000 Cr",
    pe: 28.6,
    eps: 62.7,
    dividend_yield: "2.10%",
    high_52w: 1950.00,
    low_52w: 1355.00,
    revenue: "₹1,53,670 Cr",
    profit: "₹26,240 Cr",
    roe: "31.5%",
    debt_equity: 0.09,
    summary: "Digital transformation leader with strong cloud implementation capabilities across US and European enterprises."
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    market: "India (NSE)",
    sector: "Banking & Financial Services",
    price: 1215.20,
    change: 14.10,
    percent_change: 1.17,
    market_cap: "₹8,52,000 Cr",
    pe: 17.8,
    eps: 68.2,
    dividend_yield: "0.82%",
    high_52w: 1258.00,
    low_52w: 930.00,
    revenue: "₹1,42,000 Cr",
    profit: "₹44,200 Cr",
    roe: "18.9%",
    debt_equity: 6.2,
    summary: "High-margin private bank delivering industry-leading Return on Assets (ROA) driven by digital core banking."
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    market: "India (NSE)",
    sector: "Telecom",
    price: 1460.00,
    change: 18.50,
    percent_change: 1.28,
    market_cap: "₹8,30,000 Cr",
    pe: 54.2,
    eps: 26.9,
    dividend_yield: "0.55%",
    high_52w: 1530.00,
    low_52w: 840.00,
    revenue: "₹1,50,000 Cr",
    profit: "₹12,400 Cr",
    roe: "14.2%",
    debt_equity: 1.8,
    summary: "Telecom powerhouse benefiting from ARPU tariff increases, 5G rollouts, and growing enterprise data demand."
  },
  {
    symbol: "ITC",
    name: "ITC Ltd.",
    market: "India (NSE)",
    sector: "FMCG / Conglomerate",
    price: 490.50,
    change: 3.80,
    percent_change: 0.78,
    market_cap: "₹6,12,000 Cr",
    pe: 29.8,
    eps: 16.4,
    dividend_yield: "2.85%",
    high_52w: 520.00,
    low_52w: 399.00,
    revenue: "₹70,250 Cr",
    profit: "₹20,480 Cr",
    roe: "29.1%",
    debt_equity: 0.01,
    summary: "FMCG and paper giant with robust cash flows, expanding non-cigarette consumer brands, and high dividend payout."
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd.",
    market: "India (NSE)",
    sector: "Automotive / EV",
    price: 1020.80,
    change: 15.40,
    percent_change: 1.53,
    market_cap: "₹3,40,000 Cr",
    pe: 10.8,
    eps: 94.5,
    dividend_yield: "0.58%",
    high_52w: 1179.00,
    low_52w: 593.00,
    revenue: "₹4,37,900 Cr",
    profit: "₹31,800 Cr",
    roe: "42.8%",
    debt_equity: 0.65,
    summary: "Leading Indian auto EV maker and global luxury SUV maker (Jaguar Land Rover) with rapid debt deleveraging."
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    market: "India (NSE)",
    sector: "Public Sector Banking",
    price: 845.20,
    change: -5.10,
    percent_change: -0.60,
    market_cap: "₹7,54,000 Cr",
    pe: 11.2,
    eps: 75.4,
    dividend_yield: "1.62%",
    high_52w: 912.00,
    low_52w: 543.00,
    revenue: "₹3,90,000 Cr",
    profit: "₹61,000 Cr",
    roe: "19.2%",
    debt_equity: 7.1,
    summary: "India's largest public bank with unparalleled nationwide branch network, YONO digital app, and low valuations."
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd.",
    market: "India (NSE)",
    sector: "Engineering & Infrastructure",
    price: 3620.00,
    change: 32.00,
    percent_change: 0.89,
    market_cap: "₹4,97,000 Cr",
    pe: 36.5,
    eps: 99.1,
    dividend_yield: "0.77%",
    high_52w: 3919.00,
    low_52w: 2650.00,
    revenue: "₹2,21,000 Cr",
    profit: "₹13,000 Cr",
    roe: "15.8%",
    debt_equity: 1.1,
    summary: "Prime EPC conglomerate driving mega nation-building projects across renewable energy, metros, and defense."
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    market: "USA (NASDAQ)",
    sector: "Consumer Electronics / Tech",
    price: 224.50,
    change: 2.10,
    percent_change: 0.94,
    market_cap: "$3.42 Trillion",
    pe: 33.4,
    eps: 6.72,
    dividend_yield: "0.45%",
    high_52w: 237.23,
    low_52w: 164.08,
    revenue: "$385 Billion",
    profit: "$96.9 Billion",
    roe: "154%",
    debt_equity: 1.4,
    summary: "World's iconic hardware & ecosystem giant driving Apple Intelligence, App Store services, and Wearables."
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    market: "USA (NASDAQ)",
    sector: "Software & AI / Cloud",
    price: 448.20,
    change: 5.40,
    percent_change: 1.22,
    market_cap: "$3.33 Trillion",
    pe: 35.8,
    eps: 12.52,
    dividend_yield: "0.67%",
    high_52w: 468.35,
    low_52w: 309.45,
    revenue: "$245 Billion",
    profit: "$88.1 Billion",
    roe: "38.5%",
    debt_equity: 0.42,
    summary: "Cloud computing powerhouse (Azure) and leader in enterprise AI integration via Copilot and OpenAI partnership."
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    market: "USA (NASDAQ)",
    sector: "Semiconductors & AI Hardware",
    price: 128.80,
    change: 4.10,
    percent_change: 3.29,
    market_cap: "$3.16 Trillion",
    pe: 64.2,
    eps: 2.01,
    dividend_yield: "0.03%",
    high_52w: 140.76,
    low_52w: 39.23,
    revenue: "$96.3 Billion",
    profit: "$53.0 Billion",
    roe: "115%",
    debt_equity: 0.18,
    summary: "Dominant supplier of GPU compute chips powering hyperscaler AI data centers globally."
  }
];

function generateDynamicChartData(basePrice: number, timeframe: string) {
  const pointsMap: { [key: string]: number } = {
    '1D': 12,
    '1W': 14,
    '1M': 15,
    '6M': 18,
    '1Y': 24,
    '5Y': 30
  };

  const count = pointsMap[timeframe] || 20;
  const data = [];
  let currentPrice = basePrice * 0.88;

  const labelsMap: { [key: string]: (i: number) => string } = {
    '1D': (i) => `${9 + Math.floor(i * 0.5)}:${i % 2 === 0 ? '00' : '30'}`,
    '1W': (i) => `Day ${i + 1}`,
    '1M': (i) => `Week ${Math.floor(i / 3) + 1}`,
    '6M': (i) => `Month ${i + 1}`,
    '1Y': (i) => `M${i + 1}`,
    '5Y': (i) => `${2021 + Math.floor(i / 6)}`
  };

  const getLabel = labelsMap[timeframe] || ((i) => `T${i}`);

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    if (isLast) {
      currentPrice = basePrice;
    } else {
      const delta = (Math.sin(i * 0.7) * 0.03 + (Math.random() - 0.48) * 0.02) * basePrice;
      currentPrice = Math.max(10, currentPrice + delta);
    }
    data.push({
      time: getLabel(i),
      price: Number(currentPrice.toFixed(2))
    });
  }

  return data;
}

export const DEMO_MUTUAL_FUNDS: MutualFund[] = [
  {
    symbol: "PARAG_FLEXI",
    name: "Parag Parikh Flexi Cap Fund",
    category: "Flexi Cap",
    type: "Equity",
    nav: 74.85,
    expense_ratio: 0.58,
    aum: "₹68,500 Cr",
    return_1y: 28.4,
    return_3y: 19.8,
    return_5y: 22.5,
    risk: "Very High",
    benchmark: "NIFTY 500 TRI",
    fund_manager: "Rajeev Thakkar & Rukun Tarachandani",
    summary: "Renowned value-oriented flexi-cap fund with allocation to quality Indian bluechips plus global tech leaders (Alphabet, Amazon)."
  },
  {
    symbol: "SBI_BLUECHIP",
    name: "SBI Bluechip Fund",
    category: "Large Cap",
    type: "Equity",
    nav: 88.40,
    expense_ratio: 0.82,
    aum: "₹45,200 Cr",
    return_1y: 21.2,
    return_3y: 16.1,
    return_5y: 17.8,
    risk: "Very High",
    benchmark: "S&P BSE 100 TRI",
    fund_manager: "Sohini Andani",
    summary: "Consistent large-cap giant focused on resilient market leaders with low volatility drawdowns."
  },
  {
    symbol: "AXIS_MIDCAP",
    name: "Axis Midcap Fund",
    category: "Mid Cap",
    type: "Equity",
    nav: 104.20,
    expense_ratio: 0.54,
    aum: "₹28,400 Cr",
    return_1y: 31.5,
    return_3y: 20.4,
    return_5y: 21.9,
    risk: "Very High",
    benchmark: "S&P BSE Midcap TRI",
    fund_manager: "Shreyash Devalkar",
    summary: "Growth-at-reasonable-price strategy investing in high quality mid-sized corporations with scale capability."
  },
  {
    symbol: "NIPPON_SMALL",
    name: "Nippon India Small Cap Fund",
    category: "Small Cap",
    type: "Equity",
    nav: 168.90,
    expense_ratio: 0.67,
    aum: "₹52,800 Cr",
    return_1y: 42.1,
    return_3y: 28.9,
    return_5y: 31.2,
    risk: "Very High",
    benchmark: "NIFTY Smallcap 250 TRI",
    fund_manager: "Samir Rachh",
    summary: "High-conviction small-cap alpha finder holding a broadly diversified basket of high-growth emerging businesses."
  },
  {
    symbol: "QUANT_SMALL",
    name: "Quant Small Cap Fund",
    category: "Small Cap",
    type: "Equity",
    nav: 245.60,
    expense_ratio: 0.77,
    aum: "₹21,400 Cr",
    return_1y: 48.5,
    return_3y: 34.2,
    return_5y: 36.8,
    risk: "Very High",
    benchmark: "NIFTY Smallcap 250 TRI",
    fund_manager: "Sandeep Tandon",
    summary: "Proprietary VLRT momentum & predictive analytics engine picking high-velocity small cap multi-baggers."
  },
  {
    symbol: "MIRAE_LARGE",
    name: "Mirae Asset Large Cap Fund",
    category: "Large Cap",
    type: "Equity",
    nav: 112.30,
    expense_ratio: 0.52,
    aum: "₹39,100 Cr",
    return_1y: 22.8,
    return_3y: 15.9,
    return_5y: 17.4,
    risk: "Very High",
    benchmark: "NIFTY 100 TRI",
    fund_manager: "Gaurav Misra",
    summary: "Disciplined sector allocation across India's top 100 mega bluechip companies."
  },
  {
    symbol: "HDFC_TOP100",
    name: "HDFC Top 100 Fund",
    category: "Large Cap",
    type: "Equity",
    nav: 1140.20,
    expense_ratio: 1.08,
    aum: "₹33,200 Cr",
    return_1y: 29.5,
    return_3y: 21.1,
    return_5y: 18.9,
    risk: "Very High",
    benchmark: "NIFTY 100 TRI",
    fund_manager: "Rahul Baijal",
    summary: "Pioneer large-cap equity fund invested in market-dominating conglomerates."
  },
  {
    symbol: "MOTILAL_MID",
    name: "Motilal Oswal Midcap Fund",
    category: "Mid Cap",
    type: "Equity",
    nav: 92.40,
    expense_ratio: 0.62,
    aum: "₹16,800 Cr",
    return_1y: 54.2,
    return_3y: 38.6,
    return_5y: 30.1,
    risk: "Very High",
    benchmark: "NIFTY Midcap 150 TRI",
    fund_manager: "Niket Shah",
    summary: "High-growth 'QGLP' (Quality, Growth, Longevity, Price) focused concentrated mid-cap portfolio."
  },
  {
    symbol: "ICICI_EQUITY_DEBT",
    name: "ICICI Prudential Equity & Debt Fund",
    category: "Hybrid",
    type: "Hybrid",
    nav: 340.50,
    expense_ratio: 0.78,
    aum: "₹35,600 Cr",
    return_1y: 26.5,
    return_3y: 21.4,
    return_5y: 20.1,
    risk: "High",
    benchmark: "CRISIL Hybrid 35+65 Aggressive",
    fund_manager: "Sankaran Naren",
    summary: "Aggressive hybrid asset allocator dynamically shifting between equity (65-80%) and high yield bonds."
  },
  {
    symbol: "HDFC_SHORT_DEBT",
    name: "HDFC Short Term Debt Fund",
    category: "Debt",
    type: "Debt",
    nav: 29.40,
    expense_ratio: 0.35,
    aum: "₹15,400 Cr",
    return_1y: 7.4,
    return_3y: 6.8,
    return_5y: 7.1,
    risk: "Low to Moderate",
    benchmark: "CRISIL Short Duration Debt Index",
    fund_manager: "Anil Bamboli",
    summary: "High credit quality debt instrument focusing on AAA sovereign/corporate bonds for capital preservation."
  },
  {
    symbol: "HDFC_INDEX_NIFTY",
    name: "HDFC Index Fund - NIFTY 50 Plan",
    category: "Index",
    type: "Equity",
    nav: 215.10,
    expense_ratio: 0.20,
    aum: "₹14,200 Cr",
    return_1y: 24.1,
    return_3y: 17.5,
    return_5y: 18.2,
    risk: "Very High",
    benchmark: "NIFTY 50 TRI",
    fund_manager: "Nirman Morakhia",
    summary: "Ultra low cost passive index fund accurately tracking the NIFTY 50 benchmark."
  }
];

export const marketService = {
  async getDashboard(): Promise<MarketDashboard> {
    try {
      const res = await api.get('/market/dashboard');
      return res.data;
    } catch {
      return {
        indian_indices: [
          { symbol: 'NIFTY 50', name: 'NIFTY 50', price: 24320.50, change: 142.30, percent_change: 0.59, currency: 'INR' },
          { symbol: 'SENSEX', name: 'BSE SENSEX', price: 79840.10, change: 420.15, percent_change: 0.53, currency: 'INR' }
        ],
        global_indices: [
          { symbol: 'SPX', name: 'S&P 500', price: 5560.20, change: 32.40, percent_change: 0.59, currency: 'USD' }
        ],
        commodities_forex: [
          { symbol: 'GOLD', name: 'Gold (10g)', price: 72450.00, change: 310.00, percent_change: 0.43, currency: 'INR' }
        ],
        is_demo_data: true,
        last_updated: 'Simulated live data'
      };
    }
  },

  async getStocks(search?: string): Promise<Stock[]> {
    try {
      const res = await api.get('/stocks', { params: { search } });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      console.warn("Backend stocks endpoint unavailable, using client dataset.");
    }

    let filtered = DEMO_STOCKS;
    if (search && search.trim()) {
      const q = search.toLowerCase();
      filtered = DEMO_STOCKS.filter(
        (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
      );
    }
    return filtered;
  },

  async getStockBySymbol(symbol: string): Promise<Stock> {
    try {
      const res = await api.get(`/stocks/${symbol}`);
      if (res.data) return res.data;
    } catch {
      console.warn(`Backend stock detail for ${symbol} unavailable, using fallback dataset.`);
    }

    const found = DEMO_STOCKS.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) return found;

    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Ltd.`,
      market: "India (NSE)",
      sector: "Diversified Holdings",
      price: 1550.00,
      change: 18.20,
      percent_change: 1.19,
      market_cap: "₹1,50,000 Cr",
      pe: 24.5,
      eps: 63.2,
      dividend_yield: "1.10%",
      high_52w: 1750.00,
      low_52w: 1200.00,
      revenue: "₹45,000 Cr",
      profit: "₹6,800 Cr",
      roe: "18.5%",
      debt_equity: 0.25,
      summary: "Leading market participant with consistent earnings power and strong ROE profile."
    };
  },

  async getStockChart(symbol: string, timeframe: string = '1Y') {
    try {
      const res = await api.get(`/stocks/${symbol}/chart`, { params: { timeframe } });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      console.warn(`Backend chart for ${symbol} (${timeframe}) unavailable, generating dynamic chart.`);
    }

    const stock = await this.getStockBySymbol(symbol);
    return generateDynamicChartData(stock.price, timeframe);
  },

  async getMutualFunds(category?: string, type_filter?: string): Promise<MutualFund[]> {
    try {
      const res = await api.get('/mutual-funds', { params: { category, type_filter } });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      console.warn("Backend mutual funds endpoint unavailable, using client dataset.");
    }

    let filtered = DEMO_MUTUAL_FUNDS;
    if (type_filter && type_filter !== 'All') {
      filtered = filtered.filter((f) => f.type.toLowerCase() === type_filter.toLowerCase());
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((f) => f.category.toLowerCase().includes(category.toLowerCase()));
    }
    return filtered;
  },

  async compareMutualFunds(symbols: string[]): Promise<MutualFund[]> {
    try {
      const res = await api.get('/mutual-funds/compare/batch', { params: { symbols } });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      console.warn("Backend compare mutual funds unavailable, using client filter.");
    }

    return DEMO_MUTUAL_FUNDS.filter((f) => symbols.map(s => s.toUpperCase()).includes(f.symbol.toUpperCase()));
  }
};

