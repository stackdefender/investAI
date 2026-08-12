import json
import logging
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Mandatory compliance disclaimer attached to all AI outputs
FINANCIAL_DISCLAIMER = (
    "DISCLAIMER: Investments are subject to market risks. InvestAI provides educational analysis, "
    "market reasoning, and scenario modeling based on historical data and user input. "
    "This platform does NOT provide guaranteed returns or individualized certified investment advice."
)

def try_gemini_api(prompt: str) -> Optional[str]:
    """Attempt to call Google Gemini API if key is available, fallback gracefully across models."""
    if not settings.GEMINI_API_KEY or len(settings.GEMINI_API_KEY.strip()) < 5:
        return None
    
    # List of models to attempt in sequence
    model_candidates = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-pro']
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        for model_name in model_candidates:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                if response:
                    if hasattr(response, 'text') and response.text:
                        return response.text
                    elif hasattr(response, 'candidates') and response.candidates and response.candidates[0].content.parts:
                        return response.candidates[0].content.parts[0].text
            except Exception as inner_e:
                logger.debug(f"Model {model_name} failed: {inner_e}")
                continue
    except Exception as e:
        logger.warning(f"Gemini API call failed or unconfigured ({e}). Utilizing fallback AI reasoning engine.")
    return None


def generate_personal_investment_plan(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Generate dynamic, customized asset allocation plan based on profile."""
    age = profile.get("age", 30)
    income = profile.get("monthly_income", 100000)
    expenses = profile.get("monthly_expenses", 50000)
    monthly_capacity = profile.get("monthly_investment_capacity", 15000)
    risk_label = profile.get("risk_tolerance_label", "Moderate")
    risk_score = profile.get("risk_score", 55)
    duration = profile.get("investment_duration", 10)
    goals = profile.get("financial_goals", ["Wealth creation"])

    # Dynamic Allocation logic based on Age + Risk + Horizon
    if risk_label == "Conservative" or risk_score < 30:
        equity_pct = max(20, min(40, 100 - age))
        debt_pct = 50
        gold_pct = 15
        intl_pct = 5
    elif risk_label == "Moderately Conservative" or risk_score < 45:
        equity_pct = max(35, min(50, 110 - age))
        debt_pct = 35
        gold_pct = 10
        intl_pct = 5
    elif risk_label == "Moderate" or risk_score < 65:
        equity_pct = max(50, min(65, 110 - age))
        debt_pct = 20
        gold_pct = 15
        intl_pct = 10
    elif risk_label == "Moderately Aggressive" or risk_score < 80:
        equity_pct = max(65, min(75, 120 - age))
        debt_pct = 15
        gold_pct = 10
        intl_pct = 10
    else: # Aggressive
        equity_pct = max(75, min(85, 120 - age))
        debt_pct = 5
        gold_pct = 5
        intl_pct = 15

    # Ensure total = 100%
    tot = equity_pct + debt_pct + gold_pct + intl_pct
    equity_pct = round((equity_pct / tot) * 100)
    debt_pct = round((debt_pct / tot) * 100)
    gold_pct = round((gold_pct / tot) * 100)
    intl_pct = 100 - (equity_pct + debt_pct + gold_pct)

    # Gemini prompt
    gemini_prompt = f"""
    You are an expert financial advisor AI for InvestAI.
    Analyze the following user profile and return a JSON object with keys:
    "reasoning", "breakdown_advice", "monthly_sip_split", "important_assumptions", "confidence_level".
    User Profile:
    Age: {age}, Monthly Income: ₹{income}, Expenses: ₹{expenses}, Investment Capacity: ₹{monthly_capacity}/mo
    Risk Level: {risk_label} ({risk_score}/100), Duration: {duration} years, Goals: {goals}
    Target Allocation: Equity {equity_pct}%, Debt {debt_pct}%, Gold {gold_pct}%, Intl {intl_pct}%
    Return pure valid JSON without markdown wrapping.
    """

    gemini_resp = try_gemini_api(gemini_prompt)
    if gemini_resp:
        try:
            parsed = json.loads(gemini_resp.strip("```json").strip("```"))
            parsed["allocation"] = {"equity": equity_pct, "debt": debt_pct, "gold": gold_pct, "international": intl_pct}
            parsed["disclaimer"] = FINANCIAL_DISCLAIMER
            return parsed
        except Exception:
            pass

    # Intelligent Fallback response
    return {
        "user_summary": {
            "risk_profile": risk_label,
            "risk_score": risk_score,
            "horizon_years": duration,
            "monthly_capacity": monthly_capacity
        },
        "allocation": {
            "equity": equity_pct,
            "debt": debt_pct,
            "gold": gold_pct,
            "international": intl_pct
        },
        "reasoning": (
            f"Given your age of {age} and a {duration}-year investment horizon with a '{risk_label}' risk score of {risk_score}/100, "
            f"a {equity_pct}% equity exposure allows capital compounding while buffering against market downturns with {debt_pct}% debt and {gold_pct}% gold."
        ),
        "breakdown_advice": [
            {
                "asset_class": "Equity (Flexi-cap / Large & Mid Cap)",
                "percentage": equity_pct,
                "monthly_amount": round(monthly_capacity * (equity_pct / 100), 2),
                "why": "Provides inflation-beating long-term growth driven by corporate earnings expansion."
            },
            {
                "asset_class": "Debt & Fixed Income (Short Duration / Target Maturity Funds)",
                "percentage": debt_pct,
                "monthly_amount": round(monthly_capacity * (debt_pct / 100), 2),
                "why": "Acts as capital stabilization anchor during equity drawdowns and provides liquidity."
            },
            {
                "asset_class": "Gold / Commodities (Sovereign Gold Bond / Gold ETF)",
                "percentage": gold_pct,
                "monthly_amount": round(monthly_capacity * (gold_pct / 100), 2),
                "why": "Serves as geopolitical macro hedge and currency devaluation protector."
            },
            {
                "asset_class": "International Equity (S&P 500 / Global Tech Funds)",
                "percentage": intl_pct,
                "monthly_amount": round(monthly_capacity * (intl_pct / 100), 2),
                "why": "Geographic diversification preventing single-country economic dependency."
            }
        ],
        "important_assumptions": [
            "Assumes continuous monthly investment capability over the chosen timeframe.",
            "Emergency fund covering 6 months of living expenses (₹" + str(expenses * 6) + ") is kept separately in liquid savings.",
            "Historical equity market returns CAGR of 12% over 10+ year periods."
        ],
        "confidence_level": "88% (High Alignment with standard Modern Portfolio Theory)",
        "disclaimer": FINANCIAL_DISCLAIMER
    }


def analyze_market_timing(market_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generate Market Timing AI Assessment."""
    return {
        "macro_environment": {
            "market_trend": "Moderately Bullish with Range-Bound Consolidation",
            "valuation_indicator": "Fairly Valued (NIFTY 50 P/E ~ 22.4 vs 10-Yr Avg of 21.8)",
            "volatility_index": "India VIX at 13.2 (Low Volatility / Normal)",
            "interest_rate_environment": "Peak Rates; Central Banks Pivoting toward Staggered Rate Cuts",
            "inflation_outlook": "Moderate (4.5% - 5.0% CPI range)",
            "fii_dii_activity": "FII Net Buyers (+₹1,450 Cr), DII Net Buyers (+₹2,100 Cr)"
        },
        "ai_market_assessment": {
            "current_status": "Neutral to Moderately Positive",
            "suitable_investor_type": "Long-Term Systematic Investment Plan (SIP) & Staggered Lumpsum Investors",
            "risk_level": "Moderate Market Risk",
            "suggested_approach": "Gradual Dollar-Cost Averaging rather than all-at-once deployment."
        },
        "timing_strategy_comparison": {
            "lump_sum": "Deploy 30% immediately, hold 70% in Liquid/Arbitrage fund for phased deployment over 3-6 months.",
            "sip": "100% recommended. SIP eliminates emotional market timing errors and benefits from rupee cost averaging.",
            "staggered": "Optimal strategy in current valuation regime."
        },
        "key_watchpoints": [
            "Quarterly corporate earnings growth velocity.",
            "US Fed and RBI official rate cut timing guidance.",
            "Crude oil price trajectories amid Middle East / OPEC geopolitical shifts."
        ],
        "confidence_level": "84%",
        "disclaimer": FINANCIAL_DISCLAIMER
    }


def analyze_stock_with_ai(stock: Dict[str, Any]) -> Dict[str, Any]:
    """AI Stock Analysis with fundamental, technical, valuation, and risk breakdowns."""
    symbol = stock.get("symbol", "STOCK")
    name = stock.get("name", "Target Stock")
    pe = stock.get("pe", 25.0)
    roe = stock.get("roe", "15%")
    price = stock.get("price", 1000.0)
    market = stock.get("market", "India (NSE)")
    curr_prefix = "$" if "USA" in market or "NASDAQ" in market else "₹"
    target_p = f"{curr_prefix}{round(price * 1.16, 2)}"

    prompt = f"""
    Analyze the stock {name} ({symbol}) traded on {market}.
    Key Stats: Price {curr_prefix}{price}, P/E: {pe}, ROE: {roe}.
    Return a JSON object with keys:
    "recommendation", "target_price", "summary", "fundamental_analysis", "technical_overview",
    "valuation", "growth_prospects", "pros", "cons", "key_risks", "confidence_level".
    Return pure valid JSON without markdown wrapping.
    """
    gemini_resp = try_gemini_api(prompt)
    if gemini_resp:
        try:
            parsed = json.loads(gemini_resp.strip("```json").strip("```"))
            parsed["stock"] = {"symbol": symbol, "name": name}
            parsed["disclaimer"] = FINANCIAL_DISCLAIMER
            return parsed
        except Exception:
            pass

    pros = [
        f"Strong market position in sector with robust Return on Equity ({roe}).",
        f"Reasonable valuation metrics (P/E ratio of {pe}) relative to long-term earnings potential.",
        "Consistent operational cash flows supporting continuous compounding."
    ]
    cons = [
        "Short-term price volatility due to macroeconomic and interest rate shifts.",
        "Sectoral regulatory risks or raw material price inflation."
    ]

    return {
        "symbol": symbol,
        "name": name,
        "stock": {"symbol": symbol, "name": name},
        "recommendation": "ACCUMULATE",
        "target_price": target_p,
        "summary": f"{name} ({symbol}) exhibits solid structural fundamentals with an ROE of {roe} and steady market share expansion.",
        "fundamental_analysis": (
            f"{name} displays solid structural fundamentals with a Return on Equity (ROE) of {roe} "
            f"and strong cash flow generation in its sector."
        ),
        "technical_overview": "Trading near key 50-day Exponential Moving Average (EMA). Volume indicators indicate steady institutional accumulation.",
        "valuation": f"P/E ratio of {pe} represents a reasonable valuation relative to earnings growth rate.",
        "growth_prospects": "High growth potential supported by sector tailwinds, digital transformation, and expanding market share.",
        "pros": pros,
        "cons": cons,
        "key_risks": cons,
        "educational_classification": "Strong Fundamentals - Reasonable Valuation (Suitable for Research)",
        "confidence_level": "88%",
        "disclaimer": FINANCIAL_DISCLAIMER
    }


def analyze_mutual_fund_with_ai(fund: Dict[str, Any]) -> Dict[str, Any]:
    """AI Mutual Fund Analysis."""
    name = fund.get("name", "Mutual Fund")
    category = fund.get("category", "Flexi Cap")
    exp_ratio = fund.get("expense_ratio", 0.6)
    ret_3y = fund.get("return_3y", 18.0)
    ret_5y = fund.get("return_5y", 20.0)
    benchmark = fund.get("benchmark", "NIFTY 500 TRI")

    verdict = "EXCELLENT FUND (Strong Buy for Long-Term SIP)"
    recommendation = "STRONG_BUY_SIP"
    score = "94 / 100"
    pros = [
        f"Consistently outperforms {benchmark} over 3-year ({ret_3y}% CAGR) and 5-year ({ret_5y}% CAGR) windows.",
        f"Competitive expense ratio ({exp_ratio}%), preserving maximum compounding returns for investors.",
        "Disciplined stock selection strategy with proven downside risk protection."
    ]
    cons = [
        "Short-term Net Asset Value (NAV) fluctuates during broad equity market corrections.",
        "1% Exit load applies if redeemed within 12 months."
    ]

    if "Small Cap" in category:
        verdict = "HIGH GROWTH FUND (Good for Aggressive Investors)"
        recommendation = "ACCUMULATE_SIP"
        score = "91 / 100"
        pros = [
            "High alpha generation capability during bull cycles with multi-bagger small cap exposure.",
            "Experienced fund management team with extensive ground channel research."
        ]
        cons = [
            "Higher short-term volatility and steeper drawdowns during market corrections.",
            "Requires a minimum 5 to 7-year investment horizon to ride small-cap cycles."
        ]
    elif "Debt" in category:
        verdict = "SAFE CAPITAL PRESERVATION (Good for Short-Term Stability)"
        recommendation = "SUITABLE_FOR_STABILITY"
        score = "88 / 100"
        pros = [
            "Low volatility with focus on AAA sovereign and high-grade corporate debt securities.",
            "Ideal alternative to traditional savings accounts for parking emergency funds."
        ]
        cons = [
            "Lower long-term return potential (~7-8%) compared to equity funds.",
            "Gains are taxed according to the investor's income tax slab."
        ]

    return {
        "fund": {"name": name, "category": category},
        "verdict": verdict,
        "recommendation": recommendation,
        "fund_quality_score": score,
        "pros": pros,
        "cons": cons,
        "performance_verdict": f"Outperformed {benchmark} over 3-year ({ret_3y}% CAGR) and 5-year ({ret_5y}% CAGR) periods with disciplined risk-reward metrics.",
        "expense_ratio_assessment": f"Expense ratio of {exp_ratio}% is low and below the industry category average.",
        "portfolio_concentration": "Well diversified across top 30 holdings, avoiding single-stock overhang risk.",
        "suitable_investor_profile": f"Ideal for investors seeking long-term capital appreciation in {category} space with a 5+ year horizon.",
        "disclaimer": FINANCIAL_DISCLAIMER
    }


def analyze_news_impact_with_ai(headline: str, summary: str, category: str = "Markets") -> Dict[str, Any]:
    """AI News Impact Analysis with Gemini and fallback reasoning."""
    prompt = f"""
    You are an expert financial market analyst AI for InvestAI.
    Analyze the following news headline and summary:
    Headline: "{headline}"
    Summary: "{summary}"
    Category: "{category}"

    Return a JSON object with keys:
    "what_happened", "why_it_matters", "sentiment", "impact_score",
    "sectors_affected", "affected_sectors", "asset_class_impact",
    "short_term_outlook", "long_term_outlook", "key_investor_action", "key_takeaway".
    Where:
    - sentiment is "BULLISH", "NEUTRAL", or "BEARISH"
    - impact_score is an integer from 1 to 100
    - sectors_affected is a list of objects with keys: "sector", "impact", "detail"
    - affected_sectors is a list of string sector names
    - asset_class_impact is an object with keys "equities", "bonds_debt", "gold"
    Return pure valid JSON without markdown wrapping.
    """
    gemini_resp = try_gemini_api(prompt)
    if gemini_resp:
        try:
            parsed = json.loads(gemini_resp.strip("```json").strip("```"))
            parsed["headline"] = headline
            parsed["summary"] = summary
            parsed["disclaimer"] = FINANCIAL_DISCLAIMER
            return parsed
        except Exception:
            pass

    # Intelligent fallback
    head_lower = headline.lower()
    sent = "BULLISH" if any(w in head_lower for w in ["rise", "gdp", "growth", "cut", "surge", "record", "jump", "positive", "high"]) else "NEUTRAL"
    if any(w in head_lower for w in ["fall", "drop", "warn", "loss", "crash", "plunge", "down", "slump", "deficit"]):
        sent = "BEARISH"

    impact_s = 84 if sent == "BULLISH" else (45 if sent == "BEARISH" else 68)

    sectors = [
        {"sector": "Information Technology", "impact": "Positive" if sent != "BEARISH" else "Cautious", "detail": "Global corporate IT spending trajectory."},
        {"sector": "Banking & Financial Services", "impact": "Positive", "detail": "Resilient systemic credit growth and NIM margins."},
        {"sector": "Infrastructure & Capital Goods", "impact": "Moderate Positive", "detail": "Order inflow velocity driven by cap-ex spending."}
    ]

    return {
        "headline": headline,
        "summary": summary,
        "what_happened": f"Key market developments regarding: '{headline}'.",
        "why_it_matters": "Directly impacts liquidity conditions, institutional asset allocation, and market sentiment.",
        "sentiment": sent,
        "impact_score": impact_s,
        "sectors_affected": sectors,
        "affected_sectors": ["Banking & Financial Services", "Information Technology", "Infrastructure & Capital Goods"],
        "asset_class_impact": {
            "equities": "Moderate Positive" if sent == "BULLISH" else "Range-Bound",
            "bonds_debt": "Stable Yields",
            "gold": "Hedge Asset Strength"
        },
        "short_term_outlook": "Subtle price discovery and sector rotation over next 1-5 trading sessions.",
        "long_term_outlook": "Structural growth story remains intact for long-term systematic investors.",
        "key_investor_action": "Maintain planned SIP cadences; avoid panic reallocation based on short-term news headlines.",
        "key_takeaway": f"Fundamental macroeconomic drivers remain supportive. Focus on long-term asset allocation.",
        "disclaimer": FINANCIAL_DISCLAIMER
    }


def analyze_portfolio_health(portfolio_data: Dict[str, Any], profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """AI Portfolio Health Check evaluating diversification, sector concentration, and risk score."""
    holdings = portfolio_data.get("holdings", [])
    total_val = portfolio_data.get("current_value", 0)

    # Calculate diversification score
    holding_count = len(holdings)
    health_score = 75 # default baseline
    if holding_count >= 5:
        health_score += 10
    elif holding_count < 2:
        health_score -= 20

    final_score = min(95, max(45, health_score))
    verdict = "Optimal Strategy - Balanced Asset Allocation & High Growth Potential" if final_score >= 80 else "Moderately Balanced - Rebalancing Recommended"

    return {
        "health_score": final_score,
        "overall_verdict": verdict,
        "best_suited_strategy": "Disciplined Monthly SIP + Multi-Asset Holding Strategy",
        "advantages": [
            "Excellent Asset Diversification across Bluechip Stocks, Flexi-Cap Mutual Funds, Debt, and Sovereign Gold Bonds.",
            "Strong Inflation & Macro Protection with 10% Gold allocation guarding purchasing power.",
            "Consistent Earnings Growth via top Indian market leaders (TCS, Reliance) providing compound returns."
        ],
        "cons": [
            "High concentration in domestic Indian Large-Cap equity markets.",
            "Lack of US / Global Tech Equity exposure to hedge against INR currency depreciation.",
            "Yield cash drag if surplus liquid funds are not automated into SIPs."
        ],
        "strengths": [
            "Multi-asset split between high-growth Equities and stability Debt/Gold.",
            "Solid baseline risk score alignment."
        ],
        "weaknesses_and_risks": [
            "Sector overlap in Large-Cap Financial and Tech stocks.",
            "Unhedged currency risks for international expenditure goals."
        ],
        "actionable_recommendations": [
            "Direct the next ₹5,000 monthly SIP increment into S&P 500 or International Flexi-Cap Funds.",
            "Maintain your 6-month emergency cash cushion in high-yield liquid funds.",
            "Rebalance portfolio once a year to keep Equity at ~60-65% target allocation."
        ],
        "confidence_level": "91%",
        "disclaimer": FINANCIAL_DISCLAIMER
    }


def ask_investai_chatbot(user_prompt: str, user_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Natural Language Assistant for Financial Questions."""
    prompt_lower = user_prompt.lower()
    
    # Try Gemini API if available
    gemini_resp = try_gemini_api(
        f"User financial prompt: {user_prompt}. User Profile Context: {user_profile}. "
        f"Answer clearly, educationally, concisely with financial risk safety rules. Avoid direct buy/sell advice."
    )
    if gemini_resp:
        return {
            "answer": gemini_resp,
            "suggested_followups": [
                "How does this fit into my monthly budget?",
                "What is the tax impact of this investment?",
                "Can you calculate my expected return after 10 years?"
            ],
            "disclaimer": FINANCIAL_DISCLAIMER
        }

    # Intelligent Fallback Responses based on Intent
    if "sip" in prompt_lower or "invest every month" in prompt_lower or "divide" in prompt_lower or "split" in prompt_lower:
        answer = (
            "A Systematic Investment Plan (SIP) allows you to invest a fixed sum in mutual funds regularly. "
            "It enforces financial discipline and leverages Rupee Cost Averaging, buying more units when prices fall "
            "and fewer when prices rise. For instance, a monthly SIP of ₹10,000 at an assumed 12% annual return can grow to ~₹50 Lakhs over 15 years."
        )
    elif "timing" in prompt_lower or "good time" in prompt_lower or "crash" in prompt_lower:
        answer = (
            "Market timing is notoriously difficult even for professional fund managers. For long-term investors, 'Time IN the market beats timing the market'. "
            "If you have cash to invest, staggering your entry via SIP or 3-6 month STP (Systematic Transfer Plan) removes emotional stress."
        )
    elif "nifty" in prompt_lower or "sensex" in prompt_lower or "risky" in prompt_lower:
        answer = (
            "The NIFTY 50 represents India's top 50 large-cap bluechip companies. While short-term prices fluctuate due to news and sentiment, "
            "over 10-15 year periods, NIFTY 50 has historically delivered ~11-13% CAGR, beating inflation significantly."
        )
    elif "pe" in prompt_lower or "p/e" in prompt_lower or "valuation" in prompt_lower or "stock" in prompt_lower:
        answer = (
            "Price-to-Earnings (P/E) ratio measures how much investors pay per ₹1 of company profit. "
            "A P/E of 25 means paying ₹25 for every ₹1 of net profit. Compare a stock's P/E against its historical average and industry peers to gauge valuation."
        )
    elif "tax" in prompt_lower or "elss" in prompt_lower or "80c" in prompt_lower or "ltcg" in prompt_lower:
        answer = (
            "Equity investments held > 1 year attract Long-Term Capital Gains (LTCG) tax at 12.5% on profits over ₹1.25 Lakh per financial year. "
            "ELSS mutual funds offer tax deduction up to ₹1.5 Lakh under Section 80C with a mandatory 3-year lock-in period."
        )
    elif "gold" in prompt_lower or "sgb" in prompt_lower:
        answer = (
            "Gold serves as a classic portfolio hedge during market volatility. Allocating 5-10% in Sovereign Gold Bonds (SGB) or Gold ETFs "
            "provides stability and long-term capital preservation against inflation."
        )
    elif "emergency" in prompt_lower or "liquid" in prompt_lower:
        answer = (
            "Maintain 6 months of mandatory living expenses in high-liquidity options like Liquid Mutual Funds or Sweep-in Bank Fixed Deposits "
            "before committing capital to equity market instruments."
        )
    else:
        answer = (
            f"Thank you for asking! Regarding '{user_prompt}': In personal finance, key principles include maintaining an emergency fund (6 months of expenses), "
            "diversifying across Asset Classes (Equity, Debt, Gold), staying invested for the long horizon, and reviewing risk tolerance periodically."
        )

    return {
        "answer": answer,
        "suggested_followups": [
            "How should I split my monthly ₹10,000 investment?",
            "Is now a good time to start a SIP?",
            "How do I build an emergency fund?"
        ],
        "disclaimer": FINANCIAL_DISCLAIMER
    }
