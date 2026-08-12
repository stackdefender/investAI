export interface User {
  id: number;
  email: str;
  full_name: str;
  is_active: boolean;
}

export interface UserProfile {
  id?: number;
  user_id?: number;
  age: number;
  country: string;
  employment_status: string;
  monthly_income: number;
  monthly_expenses: number;
  monthly_savings: number;
  existing_investments: number;
  existing_loans: number;
  emergency_fund: number;
  monthly_investment_capacity: number;
  initial_investment_amount: number;
  investment_duration: number;
  risk_tolerance_label: 'Conservative' | 'Moderately Conservative' | 'Moderate' | 'Moderately Aggressive' | 'Aggressive';
  risk_score: number;
  financial_goals: string[];
}

export interface Stock {
  symbol: string;
  name: string;
  market: string;
  sector: string;
  price: number;
  change: number;
  percent_change: number;
  market_cap: string;
  pe: number;
  eps: number;
  dividend_yield: string;
  high_52w: number;
  low_52w: number;
  revenue: string;
  profit: string;
  roe: string;
  debt_equity: number;
  summary: string;
}

export interface MutualFund {
  symbol: string;
  name: string;
  category: string;
  type: string;
  nav: number;
  expense_ratio: number;
  aum: string;
  return_1y: number;
  return_3y: number;
  return_5y: number;
  risk: string;
  benchmark: string;
  fund_manager: string;
  summary: string;
}

export interface PortfolioHolding {
  id?: number;
  symbol_or_name: string;
  asset_type: 'stock' | 'mutual_fund' | 'etf' | 'gold' | 'bond' | 'cash';
  category: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  currency: string;
}

export interface Portfolio {
  id: number;
  user_id: number;
  name: string;
  total_invested: number;
  current_value: number;
  risk_score: number;
  holdings: PortfolioHolding[];
}

export interface FinancialGoal {
  id?: number;
  title: string;
  goal_category: string;
  target_amount: number;
  current_amount: number;
  target_years: number;
  expected_return_rate: number;
  monthly_sip_required: number;
}

export interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  asset_type: string;
  added_price: number;
  target_price_alert?: number;
}

export interface SectorImpact {
  sector: string;
  impact: string;
  detail?: string;
  reason?: string;
  key_stocks?: string;
}

export interface AssetClassImpact {
  equities?: string;
  bonds_debt?: string;
  gold?: string;
  currency?: string;
}

export interface NewsImpactAnalysis {
  headline_summary?: string;
  what_happened?: string;
  why_it_matters?: string;
  sentiment?: string;
  sentiment_score?: number;
  impact_score?: number;
  risk_level?: string;
  indian_equities_impact?: string;
  sector_impacts?: SectorImpact[];
  sectors_affected?: SectorImpact[];
  affected_sectors?: string[];
  asset_class_impact?: AssetClassImpact;
  short_term_outlook?: string;
  long_term_outlook?: string;
  key_investor_action?: string;
  recommended_investor_action?: string;
  key_takeaway?: string;
  disclaimer?: string;
}

export interface NewsItem {
  id: number;
  headline: string;
  source: string;
  publish_date: string;
  category: string;
  region: string;
  url?: string;
  summary: string;
  related_markets: string;
  sentiment: string;
  ai_impact_analysis: NewsImpactAnalysis;
}


export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  currency: string;
}

export interface MarketDashboard {
  indian_indices: MarketIndex[];
  global_indices: MarketIndex[];
  commodities_forex: MarketIndex[];
  is_demo_data: boolean;
  last_updated: string;
}
