from fastapi import APIRouter
from app.services.market_service import get_market_dashboard

router = APIRouter(prefix="/market", tags=["Market Data"])

@router.get("/dashboard")
def market_dashboard():
    return get_market_dashboard()
