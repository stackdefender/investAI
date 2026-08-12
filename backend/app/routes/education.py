from fastapi import APIRouter

router = APIRouter(prefix="/education", tags=["Financial Education & Quizzes"])

EDUCATIONAL_MODULES = [
    {
        "id": "stock-basics",
        "title": "Stock Market Basics",
        "category": "Equities",
        "read_time": "5 min read",
        "level": "Beginner",
        "summary": "Understand what stocks represent, how stock exchanges work, and how corporate market capitalization is calculated.",
        "content": """
        ### What is a Stock?
        A stock (also known as equity or share) represents proportional ownership in a company. When you purchase a share of Reliance or Apple, you own a tiny slice of that enterprise and are entitled to a share of its earnings and asset growth.

        ### Market Capitalization
        Market Cap = Total Shares Outstanding × Current Market Price per Share.
        - **Large-Cap**: Industry market leaders (Market Cap > ₹20,000 Cr). High stability, reliable dividends.
        - **Mid-Cap**: High-growth expanding companies (Market Cap ₹5,000 Cr - ₹20,000 Cr). Balanced risk & reward.
        - **Small-Cap**: Emerging high-potential or niche firms (Market Cap < ₹5,000 Cr). High potential, higher price volatility.

        ### Key Valuation Metric: P/E Ratio
        The Price-to-Earnings ratio measures how much the market values ₹1 of company profits. High P/E implies high growth expectations, while low P/E may signify undervaluation or slow growth.
        """,
        "quiz": {
            "question": "If a company has 1,000,000 shares priced at ₹500 each, what is its Market Capitalization?",
            "options": ["₹5 Crore", "₹50 Crore", "₹500 Crore", "₹5,000 Crore"],
            "correct_index": 1,
            "explanation": "Market Cap = 1,000,000 × ₹500 = ₹500,000,000 (which equals ₹50 Crore)."
        }
    },
    {
        "id": "mutual-funds-sip",
        "title": "Mutual Funds & The Magic of SIP",
        "category": "Mutual Funds",
        "read_time": "6 min read",
        "level": "Beginner",
        "summary": "Learn how professionally managed pool funds work and how monthly systematic investing builds long-term wealth.",
        "content": """
        ### What is a Mutual Fund?
        A mutual fund pools money from thousands of retail investors to purchase a diversified portfolio of stocks, bonds, or commodities managed by professional Asset Management Companies (AMCs) and Fund Managers.

        ### Power of Rupee Cost Averaging
        With a Systematic Investment Plan (SIP), you buy more units when market prices drop and fewer units when prices surge. This mitigates emotional market timing mistakes automatically.

        ### Direct vs Regular Mutual Funds
        - **Direct Plans**: Lower expense ratio because you invest directly with the AMC (0.5% lower cost on average).
        - **Regular Plans**: Higher expense ratio because distributor commissions are embedded into the fund's NAV.
        """,
        "quiz": {
            "question": "What primary advantage does a Systematic Investment Plan (SIP) provide during market downturns?",
            "options": [
                "Guarantees positive returns immediately",
                "Buys more fund units at lower prices (Rupee Cost Averaging)",
                "Cancels your risk exposure completely",
                "Waives all exit loads automatically"
            ],
            "correct_index": 1,
            "explanation": "During market dips, a fixed SIP installment buys more units at cheaper Net Asset Values (NAV)."
        }
    },
    {
        "id": "compounding-inflation",
        "title": "Compounding & Defeating Inflation",
        "category": "Personal Finance",
        "read_time": "4 min read",
        "level": "Beginner",
        "summary": "Understand why Albert Einstein called compounding the 8th wonder of the world and how inflation erodes cash.",
        "content": """
        ### The Power of Compound Interest
        Compounding occurs when your investment returns start generating their own returns over extended time horizons.
        
        **The Rule of 72**: Divide 72 by your expected annual interest rate to determine how many years it takes your money to double.
        - At 12% annual return: 72 / 12 = **6 Years to Double Your Capital**.

        ### The Silent Wealth Tax: Inflation
        If annual inflation is 6%, ₹100,000 today will buy only ₹55,000 worth of goods after 10 years. Keeping long-term savings in zero-yield savings accounts guarantees purchasing power loss.
        """,
        "quiz": {
            "question": "Using the Rule of 72, approximately how many years will it take to double an investment earning 9% per year?",
            "options": ["4 Years", "8 Years", "12 Years", "16 Years"],
            "correct_index": 1,
            "explanation": "72 / 9 = 8 Years."
        }
    },
    {
        "id": "taxation-india",
        "title": "Indian Investment Taxes Simplified (LTCG & STCG)",
        "category": "Taxes",
        "read_time": "5 min read",
        "level": "Intermediate",
        "summary": "Learn how Long-Term Capital Gains (LTCG) and Short-Term Capital Gains (STCG) apply to equities and debt.",
        "content": """
        ### Equity Capital Gains Tax (Stocks & Equity Mutual Funds)
        - **STCG (Holding < 1 Year)**: Taxed at 20% on realized capital gains.
        - **LTCG (Holding > 1 Year)**: Taxed at 12.5% on gains exceeding ₹1.25 Lakhs per financial year.

        ### Debt Funds & Fixed Income
        - Gains from debt funds are added to your annual income tax slab rate.

        *Note: Tax regulations are updated periodically in union budgets. Consult a chartered accountant for specific tax filing.*
        """,
        "quiz": {
            "question": "For equity mutual funds held for more than 1 year, what is the current LTCG tax rate above the annual threshold?",
            "options": ["5%", "10%", "12.5%", "20%"],
            "correct_index": 2,
            "explanation": "Equity LTCG is taxed at 12.5% on gains exceeding the ₹1.25 Lakh threshold."
        }
    }
]

@router.get("")
def list_education_modules():
    return EDUCATIONAL_MODULES
