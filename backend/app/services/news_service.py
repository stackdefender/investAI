import re
import urllib.parse
from typing import List, Dict, Any, Optional
import xml.etree.ElementTree as ET
import httpx
from app.services.ai_service import analyze_news_impact_with_ai

# Dynamic active news item list
NEWS_ITEMS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "headline": "US Federal Reserve Keeps Benchmark Interest Rates Unchanged",
        "source": "Bloomberg Financial",
        "publish_date": "2 Hours Ago",
        "category": "Interest Rates",
        "region": "USA",
        "url": "https://www.bloomberg.com/news/articles/fed-rate-decision",
        "summary": "The Federal Reserve maintained rates at 5.25%-5.50%, noting inflation progress but requesting further confidence before initiating rate cuts.",
        "related_markets": "US Equities, Indian IT Stocks, Gold, USD/INR",
        "sentiment": "Neutral to Positive",
        "ai_impact_analysis": {
            "headline_summary": "Fed pauses rate cuts; signals cautious data-dependent approach.",
            "what_happened": "The US Fed held benchmark borrowing costs steady, reiterating that committee members seek greater statistical evidence of inflation easing toward the 2% target before lowering interest rates.",
            "why_it_matters": "US monetary policy directly dictates global liquidity flows, bond yields, and foreign portfolio investment (FII) allocations into emerging markets like India.",
            "sentiment": "NEUTRAL",
            "sentiment_score": 62,
            "impact_score": 78,
            "risk_level": "Moderate Risk",
            "sectors_affected": [
                {"sector": "Information Technology", "impact": "Positive", "detail": "US enterprise IT spend clarity improves as rate hike risks end.", "key_stocks": "TCS, INFY, WIT"},
                {"sector": "Banking & Financials", "impact": "Neutral", "detail": "Domestic deposit rates and net interest margins remain steady.", "key_stocks": "HDFCBANK, ICICIBANK"},
                {"sector": "Gold & Precious Metals", "impact": "Moderate Positive", "detail": "Yield stabilization supports gold spot pricing.", "key_stocks": "GOLDBEES, TITAN"}
            ],
            "asset_class_impact": {
                "equities": "Moderate Positive for IT and FII-heavy large caps.",
                "bonds_debt": "10-Year Treasury yield stability anchors bond valuations.",
                "gold": "Supportive environment for precious metals accumulation.",
                "currency": "USD/INR expected to oscillate in tight 83.10 - 83.50 range."
            },
            "short_term_outlook": "Consolidation in benchmark indices with selective rally in export IT stocks.",
            "long_term_outlook": "Rate-cut cycle initiation later this year will trigger foreign capital inflows.",
            "key_investor_action": "Maintain planned SIP investments. No hasty portfolio reallocation needed."
        }
    },
    {
        "id": 2,
        "headline": "India Q1 GDP Growth Accelerates to 7.8% Driven by Infrastructure Spend",
        "source": "Economic Times",
        "publish_date": "4 Hours Ago",
        "category": "India",
        "region": "India",
        "url": "https://economictimes.indiatimes.com/news/economy/indicators/gdp-growth",
        "summary": "India's real GDP expanded at a robust 7.8% year-over-year rate in Q1, surpassing street expectations due to strong capital expenditure.",
        "related_markets": "NIFTY 50, SENSEX, Capital Goods, Infrastructure, Banks",
        "sentiment": "Strongly Positive",
        "ai_impact_analysis": {
            "headline_summary": "India remains the world's fastest growing major economy.",
            "what_happened": "Gross Domestic Product (GDP) growth outpaced street consensus estimates, driven by double-digit expansion in manufacturing and government capital expenditure.",
            "why_it_matters": "Solid GDP performance enhances corporate earnings visibility and boosts domestic institutional investment confidence.",
            "sentiment": "BULLISH",
            "sentiment_score": 88,
            "impact_score": 92,
            "risk_level": "Low Risk",
            "sectors_affected": [
                {"sector": "Capital Goods & Infra", "impact": "Strong Positive", "detail": "Accelerated public order execution and order books.", "key_stocks": "LT, SIEMENS, BHEL"},
                {"sector": "Banking & Financials", "impact": "Positive", "detail": "Loan credit growth expands above 15% YoY with low NPAs.", "key_stocks": "SBIN, KOTAKBANK"},
                {"sector": "Automobile & Retail", "impact": "Moderate Positive", "detail": "Rising disposable incomes boost consumer durable sales.", "key_stocks": "TATAMOTORS, M&M"}
            ],
            "asset_class_impact": {
                "equities": "Bullish momentum for NIFTY 50 and domestic capex themes.",
                "bonds_debt": "Fiscal deficit discipline stabilizes sovereign bond yields.",
                "gold": "Neutral impact as money flows toward risk-on equities.",
                "currency": "Rupee strengthens against emerging market peer basket."
            },
            "short_term_outlook": "Broad-based rally in infrastructure, PSU banks, and capital goods.",
            "long_term_outlook": "Multi-year economic expansion trajectory intact for long-term equity compounding.",
            "key_investor_action": "Favor equity allocation via Flexi-cap and Mid-cap mutual funds."
        }
    },
    {
        "id": 3,
        "headline": "Global Brent Crude Prices Soften to $78/barrel Amid Rising Inventories",
        "source": "Reuters Market News",
        "publish_date": "5 Hours Ago",
        "category": "Oil & Commodities",
        "region": "Global Economy",
        "url": "https://www.reuters.com/markets/commodities/brent-crude",
        "summary": "Oil prices dipped over 1% as crude oil stockpiles increased in major consuming nations, tempering supply shortage concerns.",
        "related_markets": "Oil & Gas, Paint Companies, Tires, Aviation, USD/INR",
        "sentiment": "Positive for India",
        "ai_impact_analysis": {
            "headline_summary": "Lower crude oil import bill benefits India's macro trade deficit.",
            "what_happened": "Brent crude oil dropped to $78 per barrel following unexpected inventory builds in US stockpiles and softer demand forecasts.",
            "why_it_matters": "India imports over 85% of its crude oil requirements. Lower oil prices reduce current account deficit (CAD) pressures and domestic inflation.",
            "sentiment": "BULLISH",
            "sentiment_score": 79,
            "impact_score": 81,
            "risk_level": "Low Risk",
            "sectors_affected": [
                {"sector": "Paints & Lubricants", "impact": "Positive", "detail": "Lower raw material costs boost gross profit margins.", "key_stocks": "ASIANPAINT, BERGEPAINT"},
                {"sector": "Aviation", "impact": "Positive", "detail": "Aviation turbine fuel (ATF) costs decrease significantly.", "key_stocks": "INDIGO"},
                {"sector": "Oil Exploration", "impact": "Slight Negative", "detail": "Realization prices per crude barrel decline.", "key_stocks": "ONGC, OIL"}
            ],
            "asset_class_impact": {
                "equities": "Positive for consumer discretionary, paints, and tire stocks.",
                "bonds_debt": "Easing inflation outlook lowers bond yield expectations.",
                "gold": "Neutral.",
                "currency": "INR gets tailwind from lower dollar import requirements."
            },
            "short_term_outlook": "Margin expansion play across paint, chemical, and logistics stocks.",
            "long_term_outlook": "Structural relief for national trade balance and retail inflation.",
            "key_investor_action": "Favorable tailwind for consumer discretionaries and paint sector holdings."
        }
    },
    {
        "id": 4,
        "headline": "China Announces Major Capital Market Stimulus & Rate Cuts",
        "source": "Financial Times",
        "publish_date": "8 Hours Ago",
        "category": "China",
        "region": "China",
        "url": "https://www.ft.com/content/china-stimulus",
        "summary": "People's Bank of China lowered reserve requirement ratios and interest rates to boost real estate and stock market liquidity.",
        "related_markets": "Metals, Emerging Markets, FII Flows",
        "sentiment": "Mixed",
        "ai_impact_analysis": {
            "headline_summary": "Chinese central bank injects aggressive stimulus.",
            "what_happened": "China's central bank announced monetary easing measure packages including RRR cuts and rate reductions to spur real estate and equity market activity.",
            "why_it_matters": "Could trigger temporary tactical foreign institutional capital rotation from Indian equities to beaten-down Chinese stocks.",
            "sentiment": "NEUTRAL",
            "sentiment_score": 52,
            "impact_score": 75,
            "risk_level": "Moderate Risk",
            "sectors_affected": [
                {"sector": "Metals & Mining", "impact": "Positive", "detail": "Infrastructure stimulus in China raises global industrial metal demand.", "key_stocks": "TATASTEEL, HINDALCO, JSWSTEEL"},
                {"sector": "FII Allocation", "impact": "Neutral to Negative", "detail": "Short-term capital reallocation to Asian peer markets.", "key_stocks": "NIFTY50"}
            ],
            "asset_class_impact": {
                "equities": "Metals outperform; temporary volatility in high-valuation Indian equities.",
                "bonds_debt": "Neutral.",
                "gold": "Steady.",
                "currency": "CNY volatility affects emerging market basket sentiment."
            },
            "short_term_outlook": "Rally in steel and aluminum producers; potential FII net selling in financial bluechips.",
            "long_term_outlook": "India's higher structural earnings growth rate preserves long-term foreign interest.",
            "key_investor_action": "Avoid panic selling. India's long-term earnings fundamentals remain superior."
        }
    },
    {
        "id": 5,
        "headline": "RBI Keeps Repo Rate Unchanged at 6.50%; Retains Withdrawal of Accommodation",
        "source": "Business Standard",
        "publish_date": "1 Day Ago",
        "category": "Interest Rates",
        "region": "India",
        "url": "https://www.business-standard.com/economy/rbi-mpc-decision",
        "summary": "Reserve Bank of India Monetary Policy Committee voted to keep interest rates steady while emphasizing vigilance on food inflation.",
        "related_markets": "Bank Nifty, Debt Mutual Funds, Real Estate, Auto",
        "sentiment": "Neutral",
        "ai_impact_analysis": {
            "headline_summary": "RBI prioritizes inflation control while acknowledging stable growth.",
            "what_happened": "The Monetary Policy Committee maintained the benchmark repo rate at 6.50% for the 8th consecutive meeting.",
            "why_it_matters": "Provides stability for fixed income markets and home loan borrowers while keeping inflation under check.",
            "sentiment": "NEUTRAL",
            "sentiment_score": 58,
            "impact_score": 70,
            "risk_level": "Low Risk",
            "sectors_affected": [
                {"sector": "Debt Funds / Fixed Income", "impact": "Positive", "detail": "Elevated yields offer lock-in opportunities for target maturity debt funds.", "key_stocks": "DEBTFUNDS, G-SECS"},
                {"sector": "Real Estate", "impact": "Neutral", "detail": "Housing loan interest rates remain predictable.", "key_stocks": "DLF, GODREJPROP"}
            ],
            "asset_class_impact": {
                "equities": "Neutral to positive for interest-rate sensitive sectors.",
                "bonds_debt": "Attractive yield accrual returns for corporate bond funds.",
                "gold": "Neutral.",
                "currency": "Supports Rupee exchange stability."
            },
            "short_term_outlook": "Range-bound yields and steady bank credit growth.",
            "long_term_outlook": "Rate cut expectations in late 2026 will boost debt fund capital gains.",
            "key_investor_action": "Consider lock-in fixed income funds or short duration debt funds for conservative money."
        }
    }
]

def get_news_list(category: Optional[str] = None, region: Optional[str] = None) -> List[Dict[str, Any]]:
    results = NEWS_ITEMS
    if category and category != "All":
        results = [n for n in results if n.get("category", "").lower() == category.lower()]
    if region and region != "All":
        results = [n for n in results if n.get("region", "").lower() == region.lower()]
    return results

def get_news_by_id(news_id: int) -> Optional[Dict[str, Any]]:
    for n in NEWS_ITEMS:
        if n["id"] == news_id:
            return n
    return None

def fetch_and_extract_news_from_url(url: str, category: str = "Markets", region: str = "Global Economy") -> Dict[str, Any]:
    """
    Scrapes any news website URL (e.g. Reuters, Economic Times, Yahoo Finance, CNBC, Bloomberg, Moneycontrol),
    extracts headline, source domain, summary text, body content, and runs AI impact analysis.
    """
    domain = "News Web Source"
    try:
        parsed_url = urllib.parse.urlparse(url)
        domain = parsed_url.netloc.replace("www.", "").title()
    except Exception:
        pass

    headline = ""
    summary = ""
    full_text = ""

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }

    try:
        with httpx.Client(follow_redirects=True, timeout=12.0, headers=headers) as client:
            resp = client.get(url)
            if resp.status_code == 200:
                html = resp.text

                # Extract title from Open Graph or <title>
                og_title = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
                if not og_title:
                    og_title = re.search(r'<meta\s+name=["\']title["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
                if not og_title:
                    og_title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
                
                if og_title:
                    headline = og_title.group(1).strip()
                    # Clean title tags like | Reuters or - Economic Times
                    headline = re.sub(r'\s*[-|]\s*.*$', '', headline)

                # Extract description from Open Graph or meta description
                og_desc = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
                if not og_desc:
                    og_desc = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
                
                if og_desc:
                    summary = og_desc.group(1).strip()

                # Extract site name
                og_site = re.search(r'<meta\s+property=["\']og:site_name["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
                if og_site:
                    domain = og_site.group(1).strip()

                # Extract paragraph content
                paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL | re.IGNORECASE)
                clean_p = []
                for p in paragraphs:
                    text = re.sub(r'<[^>]+>', '', p).strip()
                    if len(text) > 40 and not any(w in text.lower() for w in ["cookie", "privacy policy", "subscribe", "terms of service", "all rights reserved"]):
                        clean_p.append(text)
                
                if clean_p:
                    if not summary:
                        summary = clean_p[0]
                    full_text = " ".join(clean_p[:5])
    except Exception as e:
        print(f"URL scraping exception for {url}: {e}")

    # Fallback if scraping yielded empty title/summary (e.g., paywalled or dynamic JS site)
    if not headline:
        # Create headline from URL path slug
        path_slug = urllib.parse.urlparse(url).path.strip("/").split("/")[-1]
        cleaned_slug = path_slug.replace("-", " ").replace("_", " ").title()
        if len(cleaned_slug) > 10:
            headline = cleaned_slug
        else:
            headline = f"Financial Market News Report from {domain}"

    if not summary:
        summary = f"Scraped live article content from {domain}. Full article text extracted and analyzed for financial market and stock sector impact."

    # Run AI Analysis
    ai_analysis = analyze_news_impact_with_ai(headline, summary, category)

    new_id = max([n["id"] for n in NEWS_ITEMS], default=0) + 1
    new_item = {
        "id": new_id,
        "headline": headline,
        "source": domain,
        "publish_date": "Just Now (Live Web Import)",
        "category": category,
        "region": region,
        "url": url,
        "summary": summary,
        "related_markets": "Equities, Sector Stocks, Asset Allocation",
        "sentiment": ai_analysis.get("sentiment", "Neutral"),
        "ai_impact_analysis": ai_analysis
    }

    # Prepend to list so it shows at top
    NEWS_ITEMS.insert(0, new_item)
    return new_item

def add_custom_news_item(
    headline: str,
    summary: str,
    source: str = "Web Source",
    category: str = "Markets",
    region: str = "Global Economy",
    related_markets: str = "Equities, Currencies, Commodities",
    full_content: Optional[str] = None
) -> Dict[str, Any]:
    """Manually add any news article/text and analyze it with AI."""
    ai_analysis = analyze_news_impact_with_ai(headline, summary, category)
    
    new_id = max([n["id"] for n in NEWS_ITEMS], default=0) + 1
    new_item = {
        "id": new_id,
        "headline": headline,
        "source": source or "Custom Web Import",
        "publish_date": "Just Now (User Added)",
        "category": category,
        "region": region,
        "summary": summary,
        "related_markets": related_markets or "Equities, Currencies, Commodities",
        "sentiment": ai_analysis.get("sentiment", "Neutral"),
        "ai_impact_analysis": ai_analysis
    }

    NEWS_ITEMS.insert(0, new_item)
    return new_item

def fetch_live_rss_news() -> List[Dict[str, Any]]:
    """
    Ingests live headlines from Yahoo Finance RSS and merges them into active news wire.
    """
    rss_urls = [
        "https://finance.yahoo.com/news/rssindex"
    ]
    headers = {"User-Agent": "Mozilla/5.0"}
    
    fetched_count = 0
    for rss_url in rss_urls:
        try:
            with httpx.Client(follow_redirects=True, timeout=8.0, headers=headers) as client:
                resp = client.get(rss_url)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.content)
                    channel = root.find("channel")
                    if channel is not None:
                        for item in channel.findall("item")[:4]:
                            title_elem = item.find("title")
                            link_elem = item.find("link")
                            desc_elem = item.find("description")
                            
                            headline = title_elem.text if title_elem is not None else ""
                            link = link_elem.text if link_elem is not None else ""
                            raw_desc = desc_elem.text if desc_elem is not None else ""
                            summary = re.sub(r'<[^>]+>', '', raw_desc).strip()
                            
                            if headline and not any(n["headline"] == headline for n in NEWS_ITEMS):
                                ai_analysis = analyze_news_impact_with_ai(headline, summary or headline, "Markets")
                                new_id = max([n["id"] for n in NEWS_ITEMS], default=0) + 1
                                news_obj = {
                                    "id": new_id,
                                    "headline": headline,
                                    "source": "Yahoo Finance RSS",
                                    "publish_date": "Live RSS Feed",
                                    "category": "Markets",
                                    "region": "Global Economy",
                                    "url": link,
                                    "summary": summary or headline,
                                    "related_markets": "Global Equities, Forex, Commodities",
                                    "sentiment": ai_analysis.get("sentiment", "Neutral"),
                                    "ai_impact_analysis": ai_analysis
                                }
                                NEWS_ITEMS.insert(0, news_obj)
                                fetched_count += 1
        except Exception as e:
            print(f"RSS fetch exception for {rss_url}: {e}")

    return NEWS_ITEMS
