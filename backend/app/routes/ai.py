from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import UserProfile
from app.schemas.schemas import AIQueryRequest
from app.services.ai_service import (
    generate_personal_investment_plan,
    analyze_market_timing,
    ask_investai_chatbot
)

router = APIRouter(prefix="/ai", tags=["AI Advisor Core Services"])

@router.post("/planner/{user_id}")
def get_investment_plan(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if profile:
        cap = profile.monthly_investment_capacity if (profile.monthly_investment_capacity and profile.monthly_investment_capacity > 0) else max(15000, (profile.monthly_income or 100000) - (profile.monthly_expenses or 50000))
        profile_dict = {
            "age": profile.age or 30,
            "monthly_income": profile.monthly_income or 100000,
            "monthly_expenses": profile.monthly_expenses or 50000,
            "monthly_investment_capacity": cap,
            "risk_tolerance_label": profile.risk_tolerance_label or "Moderate",
            "risk_score": profile.risk_score or 60,
            "investment_duration": profile.investment_duration or 10,
            "financial_goals": profile.financial_goals or []
        }
    else:
        profile_dict = {"age": 30, "monthly_income": 100000, "monthly_expenses": 50000, "monthly_investment_capacity": 15000, "risk_tolerance_label": "Moderate", "risk_score": 55, "investment_duration": 10}

    return generate_personal_investment_plan(profile_dict)

@router.get("/market-timing")
def get_market_timing():
    return analyze_market_timing()

@router.post("/chatbot")
def chatbot(req: AIQueryRequest):
    return ask_investai_chatbot(req.prompt, req.context)
