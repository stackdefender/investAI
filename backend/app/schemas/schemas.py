from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# Auth schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool

    class Config:
        from_attributes = True

# Profile schemas
class UserProfileUpdate(BaseModel):
    age: Optional[int] = 30
    country: Optional[str] = "India"
    employment_status: Optional[str] = "Salaried"
    monthly_income: Optional[float] = 100000.0
    monthly_expenses: Optional[float] = 50000.0
    monthly_savings: Optional[float] = 50000.0
    existing_investments: Optional[float] = 200000.0
    existing_loans: Optional[float] = 0.0
    emergency_fund: Optional[float] = 300000.0
    monthly_investment_capacity: Optional[float] = 15000.0
    initial_investment_amount: Optional[float] = 50000.0
    investment_duration: Optional[int] = 10
    risk_tolerance_label: Optional[str] = "Moderate"
    risk_score: Optional[int] = 55
    financial_goals: Optional[List[str]] = []

class UserProfileResponse(UserProfileUpdate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Holding & Portfolio schemas
class HoldingCreate(BaseModel):
    symbol_or_name: str
    asset_type: str
    category: str = "Equity"
    quantity: float
    avg_buy_price: float
    current_price: float
    currency: str = "INR"

class HoldingResponse(HoldingCreate):
    id: int
    portfolio_id: int

    class Config:
        from_attributes = True

class PortfolioCreate(BaseModel):
    name: str = "My Core Portfolio"

class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    name: str
    total_invested: float
    current_value: float
    risk_score: int
    holdings: List[HoldingResponse] = []

    class Config:
        from_attributes = True

# Goal schemas
class FinancialGoalCreate(BaseModel):
    title: str
    goal_category: str = "Wealth Creation"
    target_amount: float
    current_amount: float = 0.0
    target_years: int = 10
    expected_return_rate: float = 10.0

class FinancialGoalResponse(FinancialGoalCreate):
    id: int
    user_id: int
    monthly_sip_required: float

    class Config:
        from_attributes = True

# Watchlist schemas
class WatchlistCreate(BaseModel):
    symbol: str
    name: str
    asset_type: str = "stock"
    added_price: float = 0.0
    target_price_alert: Optional[float] = None

class WatchlistResponse(WatchlistCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Calculator input/outputs
class CalculatorInput(BaseModel):
    initial_investment: float = 0.0
    monthly_sip: float = 10000.0
    annual_return: float = 12.0
    duration_years: int = 15
    inflation_rate: float = 6.0

# AI query inputs
class AIQueryRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

class NewsImpactRequest(BaseModel):
    headline: str
    summary: str
    category: Optional[str] = "Markets"

class NewsUrlFetchRequest(BaseModel):
    url: str
    category: Optional[str] = "Markets"
    region: Optional[str] = "Global Economy"

class NewsCustomCreateRequest(BaseModel):
    headline: str
    summary: str
    source: Optional[str] = "Web Source"
    category: Optional[str] = "Markets"
    region: Optional[str] = "Global Economy"
    related_markets: Optional[str] = "Equities, Currencies, Commodities"
    full_content: Optional[str] = None

