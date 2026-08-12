from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Portfolio, PortfolioHolding, UserProfile
from app.schemas.schemas import PortfolioResponse, HoldingCreate, HoldingResponse
from app.services.ai_service import analyze_portfolio_health

router = APIRouter(prefix="/portfolio", tags=["Portfolio Tracker"])

@router.get("/{user_id}", response_model=PortfolioResponse)
def get_user_portfolio(user_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    if not portfolio:
        portfolio = Portfolio(user_id=user_id, name="My Primary Portfolio")
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
    
    # Recalculate totals
    total_inv = sum(h.quantity * h.avg_buy_price for h in portfolio.holdings)
    curr_val = sum(h.quantity * h.current_price for h in portfolio.holdings)
    portfolio.total_invested = round(total_inv, 2)
    portfolio.current_value = round(curr_val, 2)
    db.commit()

    return portfolio

@router.post("/{user_id}/holdings", response_model=HoldingResponse)
def add_holding(user_id: int, holding_in: HoldingCreate, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    if not portfolio:
        portfolio = Portfolio(user_id=user_id)
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)

    new_holding = PortfolioHolding(
        portfolio_id=portfolio.id,
        **holding_in.dict()
    )
    db.add(new_holding)
    db.commit()
    db.refresh(new_holding)
    return new_holding

@router.delete("/holdings/{holding_id}")
def delete_holding(holding_id: int, db: Session = Depends(get_db)):
    holding = db.query(PortfolioHolding).filter(PortfolioHolding.id == holding_id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    db.delete(holding)
    db.commit()
    return {"message": "Holding deleted successfully"}

@router.post("/{user_id}/analyze-health")
def analyze_portfolio(user_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    holdings_list = []
    if portfolio:
        for h in portfolio.holdings:
            holdings_list.append({
                "symbol": h.symbol_or_name,
                "asset_type": h.asset_type,
                "category": h.category,
                "value": h.quantity * h.current_price
            })

    port_data = {
        "current_value": portfolio.current_value if portfolio else 0,
        "holdings": holdings_list
    }
    prof_dict = {"age": profile.age, "risk_score": profile.risk_score} if profile else None

    return analyze_portfolio_health(port_data, prof_dict)
