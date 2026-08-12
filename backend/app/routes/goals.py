from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import FinancialGoal
from app.schemas.schemas import FinancialGoalCreate, FinancialGoalResponse
from app.services.calculator_service import calculate_goal_requirements

router = APIRouter(prefix="/goals", tags=["Financial Goals Planner"])

@router.get("/{user_id}", response_model=List[FinancialGoalResponse])
def get_user_goals(user_id: int, db: Session = Depends(get_db)):
    return db.query(FinancialGoal).filter(FinancialGoal.user_id == user_id).all()

@router.post("/{user_id}", response_model=FinancialGoalResponse)
def create_goal(user_id: int, goal_in: FinancialGoalCreate, db: Session = Depends(get_db)):
    reqs = calculate_goal_requirements(
        target_amount=goal_in.target_amount,
        current_savings=goal_in.current_amount,
        duration_years=goal_in.target_years,
        expected_return=goal_in.expected_return_rate
    )
    
    new_goal = FinancialGoal(
        user_id=user_id,
        title=goal_in.title,
        goal_category=goal_in.goal_category,
        target_amount=goal_in.target_amount,
        current_amount=goal_in.current_amount,
        target_years=goal_in.target_years,
        expected_return_rate=goal_in.expected_return_rate,
        monthly_sip_required=reqs["required_monthly_sip"]
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(FinancialGoal).filter(FinancialGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}
