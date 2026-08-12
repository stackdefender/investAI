from typing import List, Dict, Any, Optional

INDIAN_INDICES = [
    {"symbol": "NIFTY 50", "name": "NIFTY 50", "price": 24320.50, "change": 142.30, "percent_change": 0.59, "currency": "INR"},
    {"symbol": "SENSEX", "name": "BSE SENSEX", "price": 79840.10, "change": 420.15, "percent_change": 0.53, "currency": "INR"},
    {"symbol": "BANKNIFTY", "name": "NIFTY Bank", "price": 52110.80, "change": -85.20, "percent_change": -0.16, "currency": "INR"},
    {"symbol": "NIFTYMID", "name": "NIFTY Midcap 100", "price": 56780.25, "change": 490.60, "percent_change": 0.87, "currency": "INR"},
    {"symbol": "NIFTYSML", "name": "NIFTY Smallcap 100", "price": 18450.40, "change": 210.10, "percent_change": 1.15, "currency": "INR"}
]

GLOBAL_INDICES = [
    {"symbol": "SPX", "name": "S&P 500", "price": 5560.20, "change": 32.40, "percent_change": 0.59, "currency": "USD"},
    {"symbol": "IXIC", "name": "NASDAQ Composite", "price": 17820.60, "change": 145.80, "percent_change": 0.83, "currency": "USD"},
    {"symbol": "DJI", "name": "Dow Jones", "price": 40120.30, "change": -45.20, "percent_change": -0.11, "currency": "USD"},
    {"symbol": "FTSE", "name": "FTSE 100 (UK)", "price": 8230.15, "change": 18.50, "percent_change": 0.23, "currency": "GBP"},
    {"symbol": "N225", "name": "Nikkei 225 (Japan)", "price": 38900.50, "change": 310.20, "percent_change": 0.80, "currency": "JPY"},
    {"symbol": "HSI", "name": "Hang Seng (HK)", "price": 17450.80, "change": -120.40, "percent_change": -0.68, "currency": "HKD"}
]

COMMODITIES_FOREX = [
    {"symbol": "GOLD", "name": "Gold (10g / oz)", "price": 72450.00, "change": 310.00, "percent_change": 0.43, "currency": "INR"},
    {"symbol": "SILVER", "name": "Silver (1kg)", "price": 86200.00, "change": 850.00, "percent_change": 1.00, "currency": "INR"},
    {"symbol": "CRUDE", "name": "Brent Crude Oil", "price": 78.40, "change": -0.85, "percent_change": -1.07, "currency": "USD"},
    {"symbol": "USDINR", "name": "USD / INR", "price": 83.95, "change": 0.04, "percent_change": 0.05, "currency": "INR"},
    {"symbol": "EURINR", "name": "EUR / INR", "price": 91.60, "change": -0.12, "percent_change": -0.13, "currency": "INR"}
]

STOCKS_LIST = [
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd.",
        "market": "India (NSE)",
        "sector": "Energy / Conglomerate",
        "price": 2980.50,
        "change": 24.50,
        "percent_change": 0.83,
        "market_cap": "₹20,15,400 Cr",
        "pe": 26.4,
        "eps": 112.8,
        "dividend_yield": "0.33%",
        "high_52w": 3217.90,
        "low_52w": 2220.30,
        "revenue": "₹9,00,000 Cr",
        "profit": "₹79,000 Cr",
        "roe": "9.8%",
        "debt_equity": 0.38,
        "summary": "India's largest private company with diversified presence in Oil-to-Chemicals, Telecom (Jio), and Retail."
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "market": "India (NSE)",
        "sector": "Information Technology",
        "price": 4210.00,
        "change": 45.20,
        "percent_change": 1.09,
        "market_cap": "₹15,22,800 Cr",
        "pe": 32.1,
        "eps": 131.2,
        "dividend_yield": "1.38%",
        "high_52w": 4585.00,
        "low_52w": 3310.00,
        "revenue": "₹2,40,890 Cr",
        "profit": "₹45,900 Cr",
        "roe": "48.2%",
        "debt_equity": 0.08,
        "summary": "Global IT services leader with massive operating margin resilience, fortress balance sheet, and dividend track record."
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Ltd.",
        "market": "India (NSE)",
        "sector": "Banking & Financial Services",
        "price": 1645.75,
        "change": -8.30,
        "percent_change": -0.50,
        "market_cap": "₹12,50,000 Cr",
        "pe": 18.5,
        "eps": 88.9,
        "dividend_yield": "1.18%",
        "high_52w": 1794.00,
        "low_52w": 1363.00,
        "revenue": "₹2,05,000 Cr",
        "profit": "₹64,000 Cr",
        "roe": "16.4%",
        "debt_equity": 6.8,
        "summary": "India's premier private sector bank post-merger with HDFC Ltd, offering dominant retail deposit franchise."
    },
    {
        "symbol": "INFY",
        "name": "Infosys Ltd.",
        "market": "India (NSE)",
        "sector": "Information Technology",
        "price": 1795.30,
        "change": 22.40,
        "percent_change": 1.26,
        "market_cap": "₹7,45,000 Cr",
        "pe": 28.6,
        "eps": 62.7,
        "dividend_yield": "2.10%",
        "high_52w": 1950.00,
        "low_52w": 1355.00,
        "revenue": "₹1,53,670 Cr",
        "profit": "₹26,240 Cr",
        "roe": "31.5%",
        "debt_equity": 0.09,
        "summary": "Digital transformation & cloud transformation specialist with large deal wins across US & European enterprises."
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Ltd.",
        "market": "India (NSE)",
        "sector": "Banking & Financial Services",
        "price": 1215.20,
        "change": 14.10,
        "percent_change": 1.17,
        "market_cap": "₹8,52,000 Cr",
        "pe": 17.8,
        "eps": 68.2,
        "dividend_yield": "0.82%",
        "high_52w": 1258.00,
        "low_52w": 930.00,
        "revenue": "₹1,42,000 Cr",
        "profit": "₹44,200 Cr",
        "roe": "18.9%",
        "debt_equity": 6.2,
        "summary": "Industry benchmarking return on assets (ROA) driven by digital core banking and clean credit book."
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "market": "USA (NASDAQ)",
        "sector": "Consumer Electronics / Tech",
        "price": 224.50,
        "change": 2.10,
        "percent_change": 0.94,
        "market_cap": "$3.42 Trillion",
        "pe": 33.4,
        "eps": 6.72,
        "dividend_yield": "0.45%",
        "high_52w": 237.23,
        "low_52w": 164.08,
        "revenue": "$385 Billion",
        "profit": "$96.9 Billion",
        "roe": "154%",
        "debt_equity": 1.4,
        "summary": "World's iconic hardware & ecosystem giant driving Apple Intelligence, App Store services, and Wearables."
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corp.",
        "market": "USA (NASDAQ)",
        "sector": "Software & AI / Cloud",
        "price": 448.20,
        "change": 5.40,
        "percent_change": 1.22,
        "market_cap": "$3.33 Trillion",
        "pe": 35.8,
        "eps": 12.52,
        "dividend_yield": "0.67%",
        "high_52w": 468.35,
        "low_52w": 309.45,
        "revenue": "$245 Billion",
        "profit": "$88.1 Billion",
        "roe": "38.5%",
        "debt_equity": 0.42,
        "summary": "Cloud computing powerhouse (Azure) and leader in enterprise AI integration via Copilot and OpenAI partnership."
    },
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corp.",
        "market": "USA (NASDAQ)",
        "sector": "Semiconductors & AI Hardware",
        "price": 128.80,
        "change": 4.10,
        "percent_change": 3.29,
        "market_cap": "$3.16 Trillion",
        "pe": 64.2,
        "eps": 2.01,
        "dividend_yield": "0.03%",
        "high_52w": 140.76,
        "low_52w": 39.23,
        "revenue": "$96.3 Billion",
        "profit": "$53.0 Billion",
        "roe": "115%",
        "debt_equity": 0.18,
        "summary": "Dominant supplier of GPU compute chips powering hyperscaler AI data centers globally."
    }
]

MUTUAL_FUNDS_LIST = [
    {
        "symbol": "PARAG_FLEXI",
        "name": "Parag Parikh Flexi Cap Fund",
        "category": "Flexi Cap",
        "type": "Equity",
        "nav": 74.85,
        "expense_ratio": 0.58,
        "aum": "₹68,500 Cr",
        "return_1y": 28.4,
        "return_3y": 19.8,
        "return_5y": 22.5,
        "risk": "Very High",
        "benchmark": "NIFTY 500 TRI",
        "fund_manager": "Rajeev Thakkar",
        "summary": "Renowned value-oriented flexi-cap fund with allocation to quality Indian equities plus selected US tech stocks."
    },
    {
        "symbol": "SBI_BLUECHIP",
        "name": "SBI Bluechip Fund",
        "category": "Large Cap",
        "type": "Equity",
        "nav": 88.40,
        "expense_ratio": 0.82,
        "aum": "₹45,200 Cr",
        "return_1y": 21.2,
        "return_3y": 16.1,
        "return_5y": 17.8,
        "risk": "Very High",
        "benchmark": "S&P BSE 100 TRI",
        "fund_manager": "Sohini Andani",
        "summary": "Consistent large-cap giant focused on resilient market leaders with low volatility drawdowns."
    },
    {
        "symbol": "AXIS_MIDCAP",
        "name": "Axis Midcap Fund",
        "category": "Mid Cap",
        "type": "Equity",
        "nav": 104.20,
        "expense_ratio": 0.54,
        "aum": "₹28,400 Cr",
        "return_1y": 31.5,
        "return_3y": 20.4,
        "return_5y": 21.9,
        "risk": "Very High",
        "benchmark": "S&P BSE Midcap TRI",
        "fund_manager": "Shreyash Devalkar",
        "summary": "Growth-at-reasonable-price strategy investing in high quality mid-sized corporations with scale capability."
    },
    {
        "symbol": "NIPPON_SMALL",
        "name": "Nippon India Small Cap Fund",
        "category": "Small Cap",
        "type": "Equity",
        "nav": 168.90,
        "expense_ratio": 0.67,
        "aum": "₹52,800 Cr",
        "return_1y": 42.1,
        "return_3y": 28.9,
        "return_5y": 31.2,
        "risk": "Very High",
        "benchmark": "NIFTY Smallcap 250 TRI",
        "fund_manager": "Samir Rachh",
        "summary": "High-conviction small-cap alpha finder holding a broadly diversified basket of high-growth emerging businesses."
    },
    {
        "symbol": "MIRAE_LARGE",
        "name": "Mirae Asset Large Cap Fund",
        "category": "Large Cap",
        "type": "Equity",
        "nav": 112.30,
        "expense_ratio": 0.52,
        "aum": "₹39,100 Cr",
        "return_1y": 22.8,
        "return_3y": 15.9,
        "return_5y": 17.4,
        "risk": "Very High",
        "benchmark": "NIFTY 100 TRI",
        "fund_manager": "Gaurav Misra",
        "summary": "Disciplined sector allocation across India's top 100 bluechip companies."
    },
    {
        "symbol": "ICICI_EQUITY_DEBT",
        "name": "ICICI Prudential Equity & Debt Fund",
        "category": "Hybrid",
        "type": "Hybrid",
        "nav": 340.50,
        "expense_ratio": 0.78,
        "aum": "₹35,600 Cr",
        "return_1y": 26.5,
        "return_3y": 21.4,
        "return_5y": 20.1,
        "risk": "High",
        "benchmark": "CRISIL Hybrid 35+65 Aggressive",
        "fund_manager": "Sankaran Naren",
        "summary": "Aggressive hybrid asset allocator dynamically shifting between equity (65-80%) and high yield bonds."
    },
    {
        "symbol": "HDFC_SHORT_DEBT",
        "name": "HDFC Short Term Debt Fund",
        "category": "Debt",
        "type": "Debt",
        "nav": 29.40,
        "expense_ratio": 0.35,
        "aum": "₹15,400 Cr",
        "return_1y": 7.4,
        "return_3y": 6.8,
        "return_5y": 7.1,
        "risk": "Low to Moderate",
        "benchmark": "CRISIL Short Duration Debt Index",
        "fund_manager": "Anil Bamboli",
        "summary": "High credit quality debt instrument focusing on AAA sovereign/corporate bonds for capital preservation."
    },
    {
        "symbol": "HDFC_INDEX_NIFTY",
        "name": "HDFC Index Fund - NIFTY 50 Plan",
        "category": "Index",
        "type": "Equity",
        "nav": 215.10,
        "expense_ratio": 0.20,
        "aum": "₹14,200 Cr",
        "return_1y": 24.1,
        "return_3y": 17.5,
        "return_5y": 18.2,
        "risk": "Very High",
        "benchmark": "NIFTY 50 TRI",
        "fund_manager": "Nirman Morakhia",
        "summary": "Ultra low cost passive index fund accurately tracking the NIFTY 50 benchmark."
    }
]

def get_market_dashboard() -> Dict[str, Any]:
    return {
        "indian_indices": INDIAN_INDICES,
        "global_indices": GLOBAL_INDICES,
        "commodities_forex": COMMODITIES_FOREX,
        "is_demo_data": True,
        "last_updated": "Live simulation active"
    }

def get_stock_list(search: Optional[str] = None) -> List[Dict[str, Any]]:
    if not search:
        return STOCKS_LIST
    search_lower = search.lower()
    return [
        s for s in STOCKS_LIST 
        if search_lower in s["symbol"].lower() or search_lower in s["name"].lower() or search_lower in s["sector"].lower()
    ]

def get_stock_by_symbol(symbol: str) -> Optional[Dict[str, Any]]:
    sym_clean = symbol.upper().replace("-", "").replace("_", "").replace(" ", "")
    for s in STOCKS_LIST:
        s_sym = s["symbol"].upper().replace("-", "").replace("_", "").replace(" ", "")
        if s_sym == sym_clean or sym_clean in s_sym or s_sym in sym_clean:
            return s
        if sym_clean in s["name"].upper().replace(" ", ""):
            return s
    name_formatted = symbol.replace("_", " ").replace("-", " ").title()
    return {
        "symbol": symbol.upper(),
        "name": f"{name_formatted} Ltd.",
        "market": "India (NSE)",
        "sector": "Diversified Equity",
        "price": 1250.00,
        "change": 15.20,
        "percent_change": 1.23,
        "market_cap": "₹50,000 Cr",
        "pe": 24.5,
        "eps": 51.0,
        "dividend_yield": "0.85%",
        "high_52w": 1450.00,
        "low_52w": 980.00,
        "revenue": "₹25,000 Cr",
        "profit": "₹3,500 Cr",
        "roe": "16.5%",
        "debt_equity": 0.45,
        "summary": f"Established equity asset ({name_formatted}) with healthy fundamental indicators and growth trajectory."
    }

def get_stock_chart_data(symbol: str, timeframe: str = "1Y") -> List[Dict[str, Any]]:
    stock = get_stock_by_symbol(symbol)
    base_price = stock["price"] if stock else 1000.0

    points_count = {
        "1D": 24,
        "1W": 7,
        "1M": 30,
        "6M": 26,
        "1Y": 12,
        "5Y": 20
    }.get(timeframe, 12)

    chart_data = []
    # Generate realistic trend
    for i in range(points_count):
        # Add slight oscillation around base price
        factor = 1.0 + (math.sin(i * 0.5) * 0.05) + ((i / points_count - 0.5) * 0.15)
        p = round(base_price * factor, 2)
        
        if timeframe == "1D":
            label = f"{i:02d}:00"
        elif timeframe in ["1W", "1M"]:
            label = f"Day {i+1}"
        elif timeframe == "6M":
            label = f"Wk {i+1}"
        elif timeframe == "1Y":
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            label = months[i % 12]
        else:
            label = f"Year {2022 + (i // 4)}"

        chart_data.append({"time": label, "price": p, "volume": int(p * 1500)})

    return chart_data

def get_mutual_funds(category: Optional[str] = None, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    results = MUTUAL_FUNDS_LIST
    if type_filter and type_filter != "All":
        results = [f for f in results if f["type"].lower() == type_filter.lower()]
    if category and category != "All":
        results = [f for f in results if f["category"].lower() == category.lower()]
    return results

def get_mutual_fund_by_symbol(symbol: str) -> Optional[Dict[str, Any]]:
    sym_clean = symbol.upper().replace("-", "_").replace(" ", "_")
    for f in MUTUAL_FUNDS_LIST:
        f_sym = f["symbol"].upper().replace("-", "_")
        if f_sym == sym_clean or sym_clean in f_sym or f_sym in sym_clean:
            return f
        if sym_clean in f["name"].upper().replace(" ", "_"):
            return f
    name_formatted = symbol.replace("_", " ").replace("-", " ").title()
    return {
        "symbol": symbol.upper(),
        "name": f"{name_formatted} Fund",
        "category": "Flexi Cap",
        "type": "Equity",
        "nav": 150.0,
        "expense_ratio": 0.65,
        "aum": "₹12,500 Cr",
        "return_1y": 19.5,
        "return_3y": 18.2,
        "return_5y": 20.1,
        "risk": "Very High",
        "benchmark": "NIFTY 500 TRI",
        "fund_manager": "Expert Fund Manager",
        "summary": "Diversified equity growth mutual fund suitable for long-term SIP wealth accumulation."
    }
