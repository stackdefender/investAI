import math
from typing import Dict, Any, List

def calculate_sip_and_lumpsum(
    initial_investment: float,
    monthly_sip: float,
    annual_return: float,
    duration_years: int,
    inflation_rate: float = 6.0
) -> Dict[str, Any]:
    months = duration_years * 12
    monthly_rate = (annual_return / 100) / 12
    monthly_inflation = (inflation_rate / 100) / 12

    # Lumpsum growth
    lumpsum_future_val = initial_investment * ((1 + (annual_return / 100)) ** duration_years)

    # SIP growth
    if monthly_rate > 0:
        sip_future_val = monthly_sip * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        sip_future_val = monthly_sip * months

    total_future_val = lumpsum_future_val + sip_future_val
    total_invested = initial_investment + (monthly_sip * months)
    estimated_gains = max(0.0, total_future_val - total_invested)

    # Inflation adjusted future value (Purchasing Power)
    real_rate = (1 + annual_return/100) / (1 + inflation_rate/100) - 1
    real_future_val = total_invested * ((1 + real_rate) ** duration_years) if total_invested > 0 else 0

    # Year by year breakdown
    yearly_breakdown = []
    current_invested = initial_investment
    current_val = initial_investment

    for yr in range(1, duration_years + 1):
        # 12 months in this year
        for m in range(12):
            current_invested += monthly_sip
            current_val = (current_val + monthly_sip) * (1 + monthly_rate)
        
        yearly_breakdown.append({
            "year": yr,
            "total_invested": round(current_invested, 2),
            "estimated_value": round(current_val, 2),
            "gains": round(max(0.0, current_val - current_invested), 2)
        })

    # CAGR calculation
    cagr = annual_return

    return {
        "initial_investment": round(initial_investment, 2),
        "monthly_sip": round(monthly_sip, 2),
        "duration_years": duration_years,
        "assumed_annual_return": annual_return,
        "inflation_rate": inflation_rate,
        "total_invested": round(total_invested, 2),
        "estimated_gains": round(estimated_gains, 2),
        "future_value": round(total_future_val, 2),
        "inflation_adjusted_value": round(total_future_val / ((1 + inflation_rate/100) ** duration_years), 2),
        "cagr_percent": round(cagr, 2),
        "yearly_breakdown": yearly_breakdown,
        "disclaimer": "These calculations are estimates based on assumed rates of return and do not guarantee future performance."
    }

def calculate_scenarios(
    monthly_sip: float,
    initial_investment: float,
    duration_years: int,
    base_return: float = 10.0,
    inflation_rate: float = 6.0
) -> Dict[str, Any]:
    conservative_return = max(4.0, base_return - 3.0)
    optimistic_return = base_return + 3.0

    conservative = calculate_sip_and_lumpsum(initial_investment, monthly_sip, conservative_return, duration_years, inflation_rate)
    base = calculate_sip_and_lumpsum(initial_investment, monthly_sip, base_return, duration_years, inflation_rate)
    optimistic = calculate_sip_and_lumpsum(initial_investment, monthly_sip, optimistic_return, duration_years, inflation_rate)

    return {
        "conservative": {
            "rate": conservative_return,
            "future_value": conservative["future_value"],
            "total_invested": conservative["total_invested"],
            "gains": conservative["estimated_gains"]
        },
        "base": {
            "rate": base_return,
            "future_value": base["future_value"],
            "total_invested": base["total_invested"],
            "gains": base["estimated_gains"]
        },
        "optimistic": {
            "rate": optimistic_return,
            "future_value": optimistic["future_value"],
            "total_invested": optimistic["total_invested"],
            "gains": optimistic["estimated_gains"]
        }
    }

def calculate_goal_requirements(
    target_amount: float,
    current_savings: float,
    duration_years: int,
    expected_return: float = 10.0
) -> Dict[str, Any]:
    months = duration_years * 12
    monthly_rate = (expected_return / 100) / 12

    # Lumpsum growth of current savings
    current_savings_future_val = current_savings * ((1 + (expected_return / 100)) ** duration_years)
    remaining_target = max(0.0, target_amount - current_savings_future_val)

    if remaining_target <= 0:
        required_sip = 0.0
    else:
        if monthly_rate > 0:
            required_sip = remaining_target / ((((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate))
        else:
            required_sip = remaining_target / months

    return {
        "target_amount": round(target_amount, 2),
        "current_savings": round(current_savings, 2),
        "current_savings_future_val": round(current_savings_future_val, 2),
        "duration_years": duration_years,
        "expected_return": expected_return,
        "remaining_shortfall_future": round(remaining_target, 2),
        "required_monthly_sip": round(required_sip, 2),
        "required_yearly_investment": round(required_sip * 12, 2)
    }

def calculate_retirement(
    current_age: int,
    retirement_age: int,
    current_monthly_expenses: float,
    inflation_rate: float,
    current_savings: float,
    existing_investments: float,
    expected_return: float
) -> Dict[str, Any]:
    years_to_retirement = max(1, retirement_age - current_age)
    
    # Expense at retirement
    future_monthly_expense = current_monthly_expenses * ((1 + inflation_rate / 100) ** years_to_retirement)
    future_annual_expense = future_monthly_expense * 12
    
    # Required corpus assuming 25x annual expenses (safe 4% withdrawal rate in retirement)
    required_corpus = future_annual_expense * 25

    # Existing nest egg growth
    total_existing = current_savings + existing_investments
    existing_corpus_at_retirement = total_existing * ((1 + expected_return / 100) ** years_to_retirement)

    shortfall = max(0.0, required_corpus - existing_corpus_at_retirement)

    # Monthly SIP to cover shortfall
    months = years_to_retirement * 12
    monthly_rate = (expected_return / 100) / 12
    if shortfall > 0 and monthly_rate > 0:
        monthly_sip_needed = shortfall / ((((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate))
    else:
        monthly_sip_needed = 0.0

    return {
        "current_age": current_age,
        "retirement_age": retirement_age,
        "years_to_retirement": years_to_retirement,
        "current_monthly_expenses": current_monthly_expenses,
        "future_monthly_expenses_at_retirement": round(future_monthly_expense, 2),
        "required_retirement_corpus": round(required_corpus, 2),
        "existing_assets_future_value": round(existing_corpus_at_retirement, 2),
        "corpus_shortfall": round(shortfall, 2),
        "monthly_sip_required": round(monthly_sip_needed, 2)
    }
