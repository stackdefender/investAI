from sqlalchemy.orm import Session
from app.models.models import User, UserProfile, Portfolio, PortfolioHolding, FinancialGoal, WatchlistItem, FinancialNews
from app.core.security import get_password_hash
from app.services.market_service import get_market_dashboard
from app.services.news_service import NEWS_ITEMS

def seed_database(db: Session):
    # Check if user exists
    user_count = db.query(User).count()
    if user_count > 0:
        return

    # Seed Demo User
    demo_user = User(
        email="demo@investai.com",
        full_name="Alex Sharma",
        hashed_password=get_password_hash("InvestAI2026!"),
        is_active=True
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    # Seed User Profile
    demo_profile = UserProfile(
        user_id=demo_user.id,
        age=32,
        country="India",
        employment_status="Salaried Software Engineer",
        monthly_income=120000.0,
        monthly_expenses=50000.0,
        monthly_savings=70000.0,
        existing_investments=650000.0,
        existing_loans=150000.0,
        emergency_fund=300000.0,
        monthly_investment_capacity=25000.0,
        initial_investment_amount=100000.0,
        investment_duration=15,
        risk_tolerance_label="Moderate",
        risk_score=62,
        financial_goals=["Wealth Creation", "Retirement", "House Purchase"]
    )
    db.add(demo_profile)

    # Seed Portfolio
    demo_portfolio = Portfolio(
        user_id=demo_user.id,
        name="Alex's Core Growth Portfolio",
        total_invested=550000.0,
        current_value=642500.0,
        risk_score=65
    )
    db.add(demo_portfolio)
    db.commit()
    db.refresh(demo_portfolio)

    # Seed Holdings
    holdings_data = [
        {"symbol_or_name": "TCS", "asset_type": "stock", "category": "Equity", "quantity": 30, "avg_buy_price": 3800.0, "current_price": 4210.0},
        {"symbol_or_name": "RELIANCE", "asset_type": "stock", "category": "Equity", "quantity": 40, "avg_buy_price": 2650.0, "current_price": 2980.5},
        {"symbol_or_name": "PARAG_FLEXI", "asset_type": "mutual_fund", "category": "Equity", "quantity": 2500, "avg_buy_price": 60.0, "current_price": 74.85},
        {"symbol_or_name": "HDFC_SHORT_DEBT", "asset_type": "mutual_fund", "category": "Debt", "quantity": 4000, "avg_buy_price": 27.0, "current_price": 29.4},
        {"symbol_or_name": "Gold SGB 2026", "asset_type": "gold", "category": "Commodity", "quantity": 15, "avg_buy_price": 6200.0, "current_price": 7245.0}
    ]

    for h in holdings_data:
        holding = PortfolioHolding(
            portfolio_id=demo_portfolio.id,
            **h
        )
        db.add(holding)

    # Seed Goals
    goals_data = [
        {
            "title": "Dream Home Down Payment",
            "goal_category": "House",
            "target_amount": 3500000.0,
            "current_amount": 400000.0,
            "target_years": 7,
            "expected_return_rate": 11.0,
            "monthly_sip_required": 24500.0
        },
        {
            "title": "Retirement Nest Egg",
            "goal_category": "Retirement",
            "target_amount": 25000000.0,
            "current_amount": 250000.0,
            "target_years": 23,
            "expected_return_rate": 12.0,
            "monthly_sip_required": 18200.0
        }
    ]

    for g in goals_data:
        goal = FinancialGoal(
            user_id=demo_user.id,
            **g
        )
        db.add(goal)

    # Seed Watchlist
    watchlist_data = [
        {"symbol": "INFY", "name": "Infosys Ltd.", "asset_type": "stock", "added_price": 1750.0, "target_price_alert": 1900.0},
        {"symbol": "NIPPON_SMALL", "name": "Nippon India Small Cap Fund", "asset_type": "mutual_fund", "added_price": 160.0, "target_price_alert": 180.0},
        {"symbol": "NVDA", "name": "NVIDIA Corp.", "asset_type": "stock", "added_price": 120.0, "target_price_alert": 140.0}
    ]

    for w in watchlist_data:
        item = WatchlistItem(
            user_id=demo_user.id,
            **w
        )
        db.add(item)

    # Seed Financial News
    for item in NEWS_ITEMS:
        news = FinancialNews(
            headline=item["headline"],
            source=item["source"],
            publish_date=item["publish_date"],
            summary=item["summary"],
            category=item["category"],
            related_markets=item["related_markets"],
            sentiment=item["sentiment"],
            ai_impact_analysis=item["ai_impact_analysis"],
            is_demo=True
        )
        db.add(news)

    db.commit()
    print("Database successfully seeded with demo user and financial data!")
