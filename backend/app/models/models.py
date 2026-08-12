import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("FinancialGoal", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("WatchlistItem", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    age = Column(Integer, default=30)
    country = Column(String, default="India")
    employment_status = Column(String, default="Salaried")
    
    monthly_income = Column(Float, default=100000.0)
    monthly_expenses = Column(Float, default=50000.0)
    monthly_savings = Column(Float, default=50000.0)
    
    existing_investments = Column(Float, default=200000.0)
    existing_loans = Column(Float, default=0.0)
    emergency_fund = Column(Float, default=300000.0)
    
    monthly_investment_capacity = Column(Float, default=15000.0)
    initial_investment_amount = Column(Float, default=50000.0)
    investment_duration = Column(Integer, default=10) # years
    
    risk_tolerance_label = Column(String, default="Moderate") # Conservative, Moderately Conservative, Moderate, Moderately Aggressive, Aggressive
    risk_score = Column(Integer, default=55) # 0 to 100
    
    financial_goals = Column(JSON, default=list) # e.g. ["Wealth creation", "Retirement"]
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, default="My Core Investment Portfolio")
    total_invested = Column(Float, default=0.0)
    current_value = Column(Float, default=0.0)
    risk_score = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="portfolios")
    holdings = relationship("PortfolioHolding", back_populates="portfolio", cascade="all, delete-orphan")

class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol_or_name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # stock, mutual_fund, etf, gold, bond, cash
    category = Column(String, default="Equity") # Equity, Debt, Commodity, Cash
    quantity = Column(Float, default=1.0)
    avg_buy_price = Column(Float, default=100.0)
    current_price = Column(Float, default=110.0)
    currency = Column(String, default="INR")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    portfolio = relationship("Portfolio", back_populates="holdings")

class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False) # Retirement, House, Children Education
    goal_category = Column(String, default="Wealth Creation")
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_years = Column(Integer, default=10)
    expected_return_rate = Column(Float, default=10.0)
    monthly_sip_required = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="goals")

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String, nullable=False)
    name = Column(String, nullable=False)
    asset_type = Column(String, default="stock") # stock, mutual_fund, index
    added_price = Column(Float, default=0.0)
    target_price_alert = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="watchlist")

class FinancialNews(Base):
    __tablename__ = "financial_news"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String, nullable=False)
    source = Column(String, default="Financial Express")
    publish_date = Column(String, default="Today")
    summary = Column(Text, nullable=False)
    category = Column(String, default="Markets")
    related_markets = Column(String, default="Global Markets")
    sentiment = Column(String, default="Neutral")
    ai_impact_analysis = Column(JSON, default=dict)
    is_demo = Column(Boolean, default=True)

class AIAnalysisLog(Base):
    __tablename__ = "ai_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    analysis_type = Column(String, nullable=False) # planner, market_timing, stock, fund, portfolio, chatbot, news_impact
    input_payload = Column(JSON, default=dict)
    ai_response = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
