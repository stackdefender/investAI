from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from app.services.market_service import get_mutual_funds, get_mutual_fund_by_symbol
from app.services.ai_service import analyze_mutual_fund_with_ai

router = APIRouter(prefix="/mutual-funds", tags=["Mutual Funds Explorer"])

@router.get("")
def list_mutual_funds(category: Optional[str] = None, type_filter: Optional[str] = None):
    return get_mutual_funds(category=category, type_filter=type_filter)

@router.get("/{symbol}")
def get_mutual_fund(symbol: str):
    fund = get_mutual_fund_by_symbol(symbol)
    if not fund:
        raise HTTPException(status_code=404, detail="Mutual fund not found")
    return fund

@router.get("/compare/batch")
def compare_mutual_funds(symbols: List[str] = Query(...)):
    results = []
    for sym in symbols[:4]: # Max 4 funds
        f = get_mutual_fund_by_symbol(sym)
        if f:
            results.append(f)
    return results

@router.post("/{symbol}/analyze")
def analyze_mutual_fund(symbol: str):
    fund = get_mutual_fund_by_symbol(symbol)
    if not fund:
        raise HTTPException(status_code=404, detail="Mutual fund not found")
    return analyze_mutual_fund_with_ai(fund)
