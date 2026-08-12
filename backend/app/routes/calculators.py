from fastapi import APIRouter
from app.schemas.schemas import CalculatorInput
from app.services.calculator_service import (
    calculate_sip_and_lumpsum,
    calculate_scenarios,
    calculate_retirement
)

router = APIRouter(prefix="/calculators", tags=["Investment Calculators"])

@router.post("/sip")
def calculate_sip(calc_in: CalculatorInput):
    return calculate_sip_and_lumpsum(
        initial_investment=calc_in.initial_investment,
        monthly_sip=calc_in.monthly_sip,
        annual_return=calc_in.annual_return,
        duration_years=calc_in.duration_years,
        inflation_rate=calc_in.inflation_rate
    )

@router.post("/scenarios")
def calculate_what_if_scenarios(calc_in: CalculatorInput):
    return calculate_scenarios(
        monthly_sip=calc_in.monthly_sip,
        initial_investment=calc_in.initial_investment,
        duration_years=calc_in.duration_years,
        base_return=calc_in.annual_return,
        inflation_rate=calc_in.inflation_rate
    )

@router.post("/retirement")
def calculate_retirement_plan(
    current_age: int = 30,
    retirement_age: int = 60,
    monthly_expenses: float = 50000.0,
    inflation_rate: float = 6.0,
    current_savings: float = 200000.0,
    existing_investments: float = 500000.0,
    expected_return: float = 11.0
):
    return calculate_retirement(
        current_age=current_age,
        retirement_age=retirement_age,
        current_monthly_expenses=monthly_expenses,
        inflation_rate=inflation_rate,
        current_savings=current_savings,
        existing_investments=existing_investments,
        expected_return=expected_return
    )
